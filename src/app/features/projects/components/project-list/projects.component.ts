import { Component, OnDestroy, OnInit } from '@angular/core';
import {MediaFileContent, Media, Project} from '../../models/project-models';
import { Tag } from '../../models/project-models';
import { ProjectService } from '../../services/project/project.service';
import { DataView } from 'primeng/dataview';
import { CollaboratorService } from '../../services/collaborator/collaborator.service';
import { Subscription, firstValueFrom, map } from 'rxjs';
import { TagService } from '../../services/tag/tag.service';
import {MediaService} from "../../services/media/media.service";
import { StorageService } from 'src/app/features/accounts/services/authentication/storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/features/accounts/services/authentication/authentication.service';
import { Nullable } from 'primeng/ts-helpers';

import { WebsocketService } from '../../services/websocket/websocket.service';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProjectsComponent implements OnInit, OnDestroy {
  data: Project[] = [];
  filteredData: Project[] = [];
  layout: DataView["layout"] = "list";
  projectName: string = '';
  projectCollaborator: string = ''
  tagNames: string[] = []
  selectedTagNames: string[] = []
  isLoggedIn: boolean = false;
  username: string = '';
  role: Nullable<string> = '';


  wsProjectsSubscription: Subscription = new Subscription();
  wsCollaboratorsProjectSubscription: Subscription = new Subscription()
  wsTagsSubscription: Subscription = new Subscription()
  wsTagsProjectSubscription: Subscription = new Subscription()
  wsMediaProjectSubscription: Subscription = new Subscription()


  projectsWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/projects",
    deserializer: msg => String(msg.data)
  })
  collaboratorsProjectWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/collaborators/project",
    deserializer: msg => String(msg.data)
  })
  tagsWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/tags",
    deserializer: msg => String(msg.data)
  })
  tagsProjectWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/tags/project",
    deserializer: msg => String(msg.data)
  })
  mediaProjectWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/media/project",
    deserializer: msg => String(msg.data)
  })

  constructor(
    private readonly projectService: ProjectService,
    private readonly collaboratorService: CollaboratorService,
    private tagService: TagService,
    private mediaService: MediaService,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    if(this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.username = this.storageService.getUser();
      try {
        const role = await this.authenticationService.getRole(this.username).toPromise();
        if (role) {
          this.storageService.saveRole(role);
          this.role = role;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role is undefined.' });
        }
      } catch (error) {
        console.error('Error fetching role:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not get role.' });
      }
    }
    await this.initProjects()
    console.log("OnInit called")

    this.wsProjectsSubscription = this.projectsWebSocket.subscribe(
      async msg => {
        const words = msg.split(" ")
        if(words[0].includes("edited")) {
          console.log("refreshing only project: " + words[1])
          this.data.filter(x => x.projectId == words[1]).forEach(async x => {
             const project = await this.getProjectForId(x.projectId)
             x.title = project.title
             x.description = project.description
             x.archived = project.archived
            })
        }
        else
        {
        console.log("refreshing all projects");
        await this.initProjects()
      }
      }
    )

    this.wsCollaboratorsProjectSubscription = this.collaboratorsProjectWebSocket.subscribe(
      async msg => {
            console.log("refreshing only collaborators for project: " + msg)
            switch(msg) {
              case "all" : return this.data.forEach(async x => x.collaboratorNames = await this.getCollaboratorsForId(x.projectId))
              default : return this.data.filter(x => x.projectId == msg).forEach(async x => x.collaboratorNames = await this.getCollaboratorsForId(x.projectId))
          }}
    )

    this.wsTagsSubscription = this.tagsWebSocket.subscribe(
      async msg => {
            console.log("refreshing entire tag list")
            this.tagNames = await this.getAllTagNames()
      }
    )

    this.wsTagsProjectSubscription = this.tagsProjectWebSocket.subscribe(
      async msg => {
            console.log("refreshing only tags for project: " + msg)
            switch(msg) {
              case "all" : return this.data.forEach(async x => {x.tagNames = await this.getTagNamesForId(x.projectId);
                                                                x.tags = await this.getTagsForId(x.projectId)})
              default : return this.data.filter(x => x.projectId == msg).forEach(async x => {x.tagNames = await this.getTagNamesForId(x.projectId);
                                                                                             x.tags = await this.getTagsForId(x.projectId)})
            }
      }
    )

    this.wsMediaProjectSubscription = this.mediaProjectWebSocket.subscribe(
      async msg => {
            console.log("refreshing media for project: " + msg)
              this.data.filter(x => x.projectId == msg).forEach(async x => {
                const newMedia = await this.getMediaForId(x.projectId)
                x.media = newMedia
                console.log(x.media)
                if (newMedia && newMedia.length > 0) {
                  x.thumbnail = await this.getImageForId(newMedia[0].mediaId);
                }
                else
                  x.thumbnail = undefined
              })
      }
    )
    }
  getColorCode(color:string):string{
    return this.tagService.getColorCode(color);
  }

    ngOnDestroy() {

      console.log("OnDestroyCalled")

      if(this.wsProjectsSubscription){
        this.wsProjectsSubscription.unsubscribe()
        this.projectsWebSocket.unsubscribe()
      }
      if(this.wsCollaboratorsProjectSubscription){
        this.wsCollaboratorsProjectSubscription.unsubscribe()
        this.collaboratorsProjectWebSocket.unsubscribe()
      }
      if(this.wsTagsSubscription){
        this.wsTagsSubscription.unsubscribe()
        this.tagsWebSocket.unsubscribe()
      }
      if(this.wsTagsProjectSubscription){
        this.wsTagsProjectSubscription.unsubscribe()
        this.tagsProjectWebSocket.unsubscribe()
      }
      if(this.wsMediaProjectSubscription){
        this.wsMediaProjectSubscription.unsubscribe()
        this.mediaProjectWebSocket.unsubscribe()
      }
    }

    async initProjects(): Promise<void> {
      this.projectService.getAllProjects().subscribe((response: Project[]) => {
        this.data = response;
        this.data.forEach(async x => x.collaboratorNames = await this.getCollaboratorsForId(x.projectId))
        this.data.forEach(async x => x.tagNames = await this.getTagNamesForId(x.projectId))
        this.data.forEach(async x => x.tags = await this.getTagsForId(x.projectId))
        this.data.forEach(async x =>x.media = await this.getMediaForId(x.projectId))
        this.data.forEach(async (x) => {
          x.media = await this.getMediaForId(x.projectId);
          if (x.media && x.media.length > 0) {
            x.thumbnail = await this.getImageForId(x.media[0].mediaId);
          }
        });
        this.filteredData = this.data
      })
        this.tagNames = await this.getAllTagNames();
    }





  async getProjectForId(id: string): Promise<Project> {
    return firstValueFrom(this.projectService.getProjectById(id))
  }

  async getCollaboratorsForId(id: string): Promise<string[]> {
    return firstValueFrom(this.collaboratorService.getCollaboratorsByProjectId(id).pipe(
      map(data => data.map(x => x.name))
    ))
  }
  async getImageForId(id: string): Promise<MediaFileContent> {
    return firstValueFrom(this.mediaService.getDocumentContent(id).pipe())
  }
  async getMediaForId(id: string): Promise<Media[]> {
    return firstValueFrom(this.mediaService.getDocumentsByProjectId(id).pipe())
  }

   async getTagsForId(id: string): Promise<Tag[]> {
     return firstValueFrom(this.tagService.getTagsByProjectId(id))
   }

   async getTagNamesForId(id: string): Promise<string[]> {
     return firstValueFrom(this.tagService.getTagsByProjectId(id)
     .pipe(
       map(data => data.map(x => x.name))
     ))
   }

   async getAllTagNames(): Promise<string[]> {
     return firstValueFrom(this.tagService.getAllTags().pipe(
       map(x => x.map(x => x.name))
     ))
   }

  onTitleFilterChange(event: Event): void {
    this.projectName = (event.target as HTMLInputElement).value
    this.filterProjects()
  }

  filterByTitle(dataToFilter: Project[]): Project[] {
    if(this.projectName == '')
      return dataToFilter
    return dataToFilter.filter(x => x.title.toLocaleLowerCase().includes(this.projectName.toLocaleLowerCase()))
  }


  onCollaboratorFilterChange(event: Event): void {
    this.projectCollaborator = (event.target as HTMLInputElement).value
    this.filterProjects()
  }

  filterByCollaborator(dataToFilter: Project[]): Project[] {
    if(this.projectCollaborator == '')
      return dataToFilter
    return dataToFilter.filter(project =>
      project.collaboratorNames.some(collaborator =>
        collaborator.toLocaleLowerCase().includes(this.projectCollaborator.toLocaleLowerCase())
      )
    );
  }

  onTagSelectedFilterChanged(): void {
    this.filterProjects()
  }

  filterByTags(dataToFilter: Project[]) {
    if(this.selectedTagNames.length == 0)
      return dataToFilter
    return dataToFilter.filter(project => this.selectedTagNames.every(name => project.tagNames.includes(name)))
  }


  filterProjects(): void {
    this.filteredData = this.filterByTitle(this.data)
    this.filteredData = this.filterByCollaborator(this.filteredData)
    this.filteredData = this.filterByTags(this.filteredData)
  }

     getImageSrc(project:Project): string {
       if(project.thumbnail == undefined)
         return 'https://as2.ftcdn.net/v2/jpg/01/25/64/11/1000_F_125641180_KxdtmpD15Ar5h8jXXrE5vQLcusX8z809.jpg'
      return `data:${project.thumbnail.filePath};base64,${project.thumbnail.fileContent}`;
    }



    logout() {
      this.confirmationService.confirm({
        message: "Are you sure you want to log out of the account " + this.storageService.getUser() + "?",
        accept: () => {
          this.authenticationService.logout().subscribe({
            next: () => {
              this.isLoggedIn = false;
              this.storageService.clean();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully.' });
              return;
            },
            error: err => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not be logged out.' });
            }
          })
        }
      })
    }
  }
