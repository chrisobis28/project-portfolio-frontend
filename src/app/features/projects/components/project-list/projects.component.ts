import { Component, OnDestroy, OnInit } from '@angular/core';
import {MediaFileContent, Media, Project} from '../../models/project-models';
import { Tag } from '../../models/project-models';
import { ProjectService } from '../../services/project/project.service';
import { DataView } from 'primeng/dataview';
import { CollaboratorService } from '../../services/collaborator/collaborator.service';
import { Subscription, firstValueFrom, map } from 'rxjs';
import { TagService } from '../../services/tag/tag.service';
import {MediaService} from "../../services/media/media.service";
import { WebsocketService } from '../../services/websocket/websocket.service';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  data: Project[] = [];
  filteredData: Project[] = [];
  layout: DataView["layout"] = "list";
  projectName: string = '';
  projectCollaborator: string = ''
  tagNames: string[] = []
  selectedTagNames: string[] = []


  wsProjectsSubscription: Subscription = new Subscription();
  wsCollaboratorsProjectSubscription: Subscription = new Subscription()

  
  projectsWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/projects",
    deserializer: msg => String(msg.data)
  })
  collaboratorsProjectWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/collaborators/project",
    deserializer: msg => String(msg.data)
  })
  
  constructor(
    private readonly projectService: ProjectService,
    private readonly collaboratorService: CollaboratorService,
    private tagService: TagService,
    private mediaService: MediaService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initProjects()
    console.log("OnInit called")

    this.wsProjectsSubscription = this.projectsWebSocket.subscribe(
      async msg => {console.log("refreshing all projects.."); await this.initProjects()}
    )

    this.wsCollaboratorsProjectSubscription = this.collaboratorsProjectWebSocket.subscribe(
      async msg => {
            console.log("refreshing only collaborators")
            switch(msg) {
              case "all" : return this.data.forEach(async x => x.collaboratorNames = await this.getCollaboratorsForId(x.projectId))
              default : return this.data.filter(x => x.projectId == msg).forEach(async x => x.collaboratorNames = await this.getCollaboratorsForId(x.projectId)) 
          }}
    )
  
    }

    ngOnDestroy() {
      if(this.wsProjectsSubscription)
        this.wsProjectsSubscription.unsubscribe()
      if(this.wsCollaboratorsProjectSubscription)
        this.wsCollaboratorsProjectSubscription.unsubscribe()
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
            x.tmb = await this.getImageForId(x.media[0].mediaId);
          }
        });
        this.filteredData = this.data
      })
        this.tagNames = await this.getAllTagNames();
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
    return dataToFilter.filter(x => x.title.toLocaleLowerCase().includes(this.projectName.toLocaleLowerCase()))
  }


  onCollaboratorFilterChange(event: Event): void {
    this.projectCollaborator = (event.target as HTMLInputElement).value
    this.filterProjects()
  }

  filterByCollaborator(dataToFilter: Project[]): Project[] {
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
    return dataToFilter.filter(project => this.selectedTagNames.every(name => project.tagNames.includes(name)))
  }


  filterProjects(): void {
    this.filteredData = this.filterByTitle(this.data)
    this.filteredData = this.filterByCollaborator(this.filteredData)
    this.filteredData = this.filterByTags(this.filteredData)
  }

  getColorCode(color: string): string {
      switch(color) {
        case "red":
          return "rgba(255, 93, 70, 0.45)"
        case "green":
          return "rgba(10, 118, 77, 0.45)"
        case "blue":
          return "rgba(10, 118, 255, 0.45)"
        case "yellow":
          return "rgba(255, 255, 0, 0.45)"
        case "orange":
          return "rgba(255, 190, 61, 0.45)"
        case "purple":
          return "rgba(106, 0, 255, 0.45)"
        case "black":
          return "rgba(0, 0, 0, 0.4)"
        default:
          return "rgba(111, 118, 133, 0.45)"
      }
  }
     getImageSrc(project:Project): string {
       if(project.tmb == undefined)
         return 'https://as2.ftcdn.net/v2/jpg/01/25/64/11/1000_F_125641180_KxdtmpD15Ar5h8jXXrE5vQLcusX8z809.jpg'
      return `data:${project.tmb.a};base64,${project.tmb.b}`;
    }


 }
