import { Component , OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { Collaborator, Link, Media, MediaFileContent, Project, Request, Tag, Template } from '../../models/project-models';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from '../../services/project/project.service';
import {FileUploadEvent, FileUploadModule} from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import{ MediaService} from "../../services/media/media.service";
import { DropdownModule } from 'primeng/dropdown';
import { Subscription, firstValueFrom, map } from 'rxjs';
import { LinkService } from '../../services/link/link.service';
import { CollaboratorService } from '../../services/collaborator/collaborator.service';
import { TemplateService } from '../../services/template/template.service';
import { TagService } from '../../services/tag/tag.service';
import { Serializer } from '@angular/compiler';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { AccountService } from 'src/app/features/accounts/services/accounts/account.service';
import { StorageService } from 'src/app/features/accounts/services/authentication/storage.service';
import { AuthenticationService } from 'src/app/features/accounts/services/authentication/authentication.service';
import { RequestService } from '../../services/request/request.service';
@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule,
    InputTextareaModule, ChipsModule, TableModule, TagModule,
    RatingModule, ButtonModule, CommonModule, FileUploadModule,
    DropdownModule, ToastModule, RouterLink],
  providers: [ProjectService, MessageService]
})

export class ProjectEditComponent implements OnInit {
  media!: Media[];
  projectId: string | null = null;
  project!: Project;
  title!: string;
  description!: string;
  tags: Tag[] | undefined;
  colaborators: Collaborator[] | undefined;
  tagnames: string[] | undefined;
  collaboratornames: string[] | undefined;
  links: Link[] = [];
  templates!: Template[];
  templateNames: string[] = [];
  selectedTemplateName: string | undefined;
  selectedTemplate: Template | null = null;
  deleteLinkList: Link[] = [];
  deletedMediaList:Media[] =[];
  addedMediaList:FormData[]=[];

  role_on_project: string = '';
  username: string = '';
  isLoggedIn: boolean = false;

  wsProjectsSubscription: Subscription = new Subscription()
  wsCollaboratorsProjectSubscription: Subscription = new Subscription()
  wsCollaboratorsSubscription: Subscription = new Subscription()
  wsTagsProjectSubscription: Subscription = new Subscription()
  wsTagsSubscription: Subscription = new Subscription()
  wsLinksProjectSubscription: Subscription = new Subscription()
  wsMediaProjectSubscription: Subscription = new Subscription()

  projectsWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/projects",
    deserializer: msg => String(msg.data)
  })
  collaboratorsProjectWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/collaborators/project",
    deserializer: msg => String(msg.data)
  })
  collaboratorsWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/collaborators",
    deserializer: msg => String(msg.data)
  })
  tagsProjectWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/tags/project",
    deserializer: msg => String(msg.data)
  })
  tagsWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/tags",
    deserializer: msg => String(msg.data)
  })
  linksProjectWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/link/project",
    deserializer: msg => String(msg.data)
  })
  mediaProjectWebSocket: WebSocketSubject<any> = webSocket({
    url: "ws://localhost:8080/topic/media/project",
    deserializer: msg => String(msg.data)
  })

  constructor(private route: ActivatedRoute,
    private projectService: ProjectService,
    private messageService: MessageService,
    private mediaService: MediaService,
    private linkService: LinkService, 
    private collaboratorService: CollaboratorService, 
    private templateService: TemplateService,
    private tagService: TagService, 
    private accountService: AccountService, 
    private storageService: StorageService,
    private authenticationService: AuthenticationService,
    private requestService: RequestService,
    private readonly router: Router
    ) {}

  async ngOnInit() {
    await this.initializeFields()

    this.wsProjectsSubscription = this.projectsWebSocket.subscribe(
      async msg => {
        const words = msg.split(" ")
        if(words[1] == this.projectId) {
          switch (words[0]) {
            case "edited" : {
              if(this.projectId){
                const newProject = await this.getProjectById(this.projectId)
                this.title = newProject.title
                this.description = newProject.description}
              return
            }
            case "deleted" : {
              this.router.navigate(['/'])
              return
            }
          }
        }
      }
    )

    this.wsCollaboratorsProjectSubscription = this.collaboratorsProjectWebSocket.subscribe(
      async msg => {
        if(msg == "all" || msg == this.projectId) {
          if(this.projectId){
            const newCollaborators = await this.getCollaboratorsByProjectId(this.projectId)
            this.colaborators = newCollaborators
            this.collaboratornames = newCollaborators.map(x => x.name)
          }
        }
      }
     )

     this.wsTagsProjectSubscription = this.tagsProjectWebSocket.subscribe(
      async msg => {
        if(msg == "all" || msg == this.projectId) {
          if(this.projectId){
            const newTags  = await this.getTagsByProjectId(this.projectId)
            this.tags = newTags
            this.tagnames = newTags.map(x => x.name);
          }
        }
      }
     )

     this.wsMediaProjectSubscription = this.mediaProjectWebSocket.subscribe(
      async msg => {
        if(msg == "all" || msg == this.projectId) {
          if(this.projectId){
          const newMedia = await this.getDocumentsByProjectId(this.projectId)
          this.media = newMedia
        }
        } 
      }
     )

     this.wsLinksProjectSubscription = this.linksProjectWebSocket.subscribe(
      async msg => {
        if(msg == "all" || msg == this.projectId) {
          if(this.projectId){
            const newLinks = await this.getLinksByProjectId(this.projectId)
            this.links = newLinks
          }
        }
      }
     )

     

     //should define here the collaborators and tags websocket such that it updates autocomplete
     //as in project-add components. The autocomplete is done on dev, we do it after we merge this with dev
     
     
    
     this.isLoggedIn = this.storageService.isLoggedIn();
     if(this.isLoggedIn) {

       this.username = this.storageService.getUser();
       try {
         const role = await this.authenticationService.getRole(this.username).toPromise();
         if(role && role != this.storageService.getRole()) {
           this.storageService.saveRole(role);
         }

         if(this.storageService.getRole() === "ROLE_ADMIN") {
           this.role_on_project = "ADMIN";
           return;
         }

         if(this.projectId) { 
          this.accountService.getRoleOnProject(this.username, this.projectId).subscribe({
           next: (role: string) => {
             this.role_on_project = role;
           },
           error: (err) => {
             console.error('Error fetching the role of the user from the database', err);
           },
         });
        }
       }
       catch (error) {
         console.error('Error fetching role, waiting took too long', error);
       }
     }

  }

  async initializeFields() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.templates = await this.getAllTemplates()
    this.templateNames = await this.getAllTemplateNames()
    if (this.projectId) {
      this.linkService.getLinksByProjectId(this.projectId).subscribe((response: Link[]) => {
        this.links = response
      });
      this.mediaService.getDocumentsByProjectId(this.projectId).subscribe((response: Media[]) => {
        this.media = response;
      });
      this.projectService.getProjectById(this.projectId).subscribe((response: Project) => {
        this.project = response;
        this.title = this.project.title;
        this.description = this.project.description;
        this.selectedTemplate = this.project.template;
        this.selectedTemplateName = this.project.template?.templateName;
        console.log(this.selectedTemplateName)
      });
      this.tagService.getTagsByProjectId(this.projectId).subscribe((response: Tag[]) => {
        this.tags = response;
        this.tagnames = this.tags.map(x => x.name);
      });
      this.collaboratorService.getCollaboratorsByProjectId(this.projectId).subscribe((response: Collaborator[]) => {
        this.colaborators = response;
        this.collaboratornames = this.colaborators.map(x => x.name)
      });
    } else {
      console.error('Project ID is null');
    }
  }

  async getProjectById(id: string): Promise<Project> {
    return firstValueFrom(this.projectService.getProjectById(id))
  }

  async getCollaboratorsByProjectId(id: string): Promise<Collaborator[]> {
    return firstValueFrom(this.collaboratorService.getCollaboratorsByProjectId(id))
  }

  async getTagsByProjectId(id: string): Promise<Tag[]> {
    return firstValueFrom(this.tagService.getTagsByProjectId(id))
  }

  async getLinksByProjectId(id: string): Promise<Link[]> {
    return firstValueFrom(this.linkService.getLinksByProjectId(id))
  }

  async getDocumentsByProjectId(id: string): Promise<Media[]> {
    return firstValueFrom(this.mediaService.getDocumentsByProjectId(id))
  }

  async uploadFile(event: FileUploadEvent) {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    this.addedMediaList.push(formData);
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'Media added! The media will be uploaded when the edit will be saved!'});
    let newMedia:Media = {
      mediaId:'',
      name:file.name,
      path:file.name,
      project:this.project,
      requestMediaProjects:[]
    }
    this.media.push(newMedia)
  }

  async getAllTemplates(): Promise<Template[]> {
    return firstValueFrom(this.templateService.getTemplates())
  }

  async getAllTemplateNames(): Promise<string[]> {
    return firstValueFrom(this.templateService.getTemplates()
    .pipe(
      map(x => x.map(y => y.templateName))
    ))
  }

  async saveProject(): Promise<void> {

    if(this.projectId == null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Project id is null, cannot be saved' });
      return;
    }

    if (this.isAnyLinkFieldEmpty()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'All link fields must be filled out' });
      return;
    }

    try {
      const tmb: MediaFileContent = {
        a: '',
        b: ''
      }

      const foundTemplate = this.templates.find(x => x.templateName === this.selectedTemplateName);
      this.selectedTemplate = foundTemplate !== undefined ? foundTemplate : null;

      const prj: Project = {
        projectId: "",
        title: this.title,
        description: this.description,
        archived: false,
        template: this.selectedTemplate,
        media: this.media,
        projectsToAccounts: [],
        projectsToCollaborators: [],
        tagsToProjects: [],
        links: this.links,
        requests: [],
        collaboratorNames: [],
        tagNames: [],
        tags: [],
        tmb: tmb
      };

      if(this.role_on_project == "ADMIN" || this.role_on_project == "EDITOR" || this.role_on_project == "PM") {

      const createdProject = await firstValueFrom(this.projectService.editProject(this.projectId, prj));
      console.log('Project edited successfully', createdProject);

      for (const link of this.links) {
        if(link.linkId == '') {
          await firstValueFrom(this.linkService.addLinkToProject(link, createdProject.projectId))
          console.log('Links added successfully in project', createdProject);
        } else {
          console.log(link)
          await firstValueFrom(this.linkService.editLinkOfProject(link))
          console.log('Links updated successfully in project', createdProject);
        }
      }

      for (const link of this.deleteLinkList) {
        await firstValueFrom(this.linkService.deleteLinkById(link.linkId));
        console.log('Link deleted successfully', link);
      }
      this.deleteLinkList = []
      for (const media of this.addedMediaList) {
        await firstValueFrom(this.mediaService.addDocumentToProject(this.project.projectId, media));
        console.log('Media added successfully', media);
      }
      this.addedMediaList = []
      for (const media of this.deletedMediaList) {
          if(media.mediaId!='')
          {const res = await firstValueFrom(this.mediaService.deleteMedia(this.projectId, media.mediaId).pipe(map(x => x as String)));
          console.log('Media deleted successfully', media);
          }
      }
      this.deletedMediaList = []
      this.router.navigate(['/project-detail/', this.projectId]) }

      else {
        const req: Request = {
          requestId: "", 
          newTitle: this.title,
          newDescription: this.description,
          isCounterOffer: false,
          project: this.project
        }

        const createdRequest = await firstValueFrom(this.requestService.createRequest(req))

        for(const link of this.links) {
          if(link.linkId == '') {
            const addedLink = await firstValueFrom(this.linkService.addAddedLinkToRequest(createdRequest.requestId, link))
            console.log(addedLink) 
          } else {
            const removedLink = await firstValueFrom(this.linkService.addRemovedLinkToRequest(createdRequest.requestId, link.linkId))
            console.log("removed: " + removedLink)
            const addedLink = await firstValueFrom(this.linkService.addAddedLinkToRequest(createdRequest.requestId, link))
            console.log("added: " + addedLink)
          }
        }

        for(const link of this.deleteLinkList) {
          const removedLink = await firstValueFrom(this.linkService.addRemovedLinkToRequest(createdRequest.requestId, link.linkId))
          console.log("removed: " + removedLink)
        }

        for(const media of this.deletedMediaList) {
          const removedMedia = await firstValueFrom(this.mediaService.addRemovedMediaToRequest(createdRequest.requestId, media.mediaId))
          console.log("deleted: " + removedMedia)
        }

        for(const media of this.addedMediaList) {
          const addedMedia = await firstValueFrom(this.mediaService.addAddedMediaToRequest(createdRequest.requestId, media))
          console.log("added: " + addedMedia)
        }
      }
      

    } catch (error) {
      console.error('Error saving project,media or links', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save project or links' });
    }
  }

  cancel(): void {
    console.log('Operation cancelled');
  }

  isAnyLinkFieldEmpty(): boolean {
    return this.links.some(link => link.name == '' || link.url == '');
  }
  addLink() {
    const link: Link = { linkId: '', name: '', url: '', requestLinkProjects: [] };
    this.links.push(link);
  }

  removeLink(index: number): void {
    this.deleteLinkList.push(this.links[index])
    this.links.splice(index, 1);
  }

  removeMedia(index: number): void {
    this.deletedMediaList.push(this.media[index])
    this.addedMediaList = this.addedMediaList.filter(x=>x.get('name')!=this.media[index].path);
    console.log(this.media[index].path);
    this.media.splice(index, 1);
  }

  removeTemplate(): void {
    this.selectedTemplateName = ''
    this.selectedTemplate = null;}

  downloadFile(media: MediaFileContent) {
    console.log(media);
    const mimeType = 'application/octet-stream'
    const byteArray = new Uint8Array(atob(media.b).split('').map(char => char.charCodeAt(0)));
    const file = new Blob([byteArray], {type: mimeType});
    const fileUrl = URL.createObjectURL(file);
    const fileName = media.a;
    let link = document.createElement("a");
    link.download = fileName;
    link.href = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  }
  downloadDocument(mediaId: string){
    let mediaFile : MediaFileContent = {
      a:"",
      b:"",
    };
    console.log(mediaId);
    this.mediaService.getDocumentContent(mediaId).subscribe({
      next: (data: MediaFileContent) => {
        mediaFile = data;
        this.downloadFile(mediaFile);
      },
      error: (err:any) => {
        console.error('Error fetching media files', err);
      }
    })
  }
}
