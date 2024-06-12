import { Component , OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { Collaborator, Link, Media, MediaFileContent, Project, Tag, Template } from '../../models/project-models';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from '../../services/project/project.service';
import {FileUpload, FileUploadEvent, FileUploadHandlerEvent, FileUploadModule} from 'primeng/fileupload';
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
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {DataViewModule} from "primeng/dataview";
@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule,
    InputTextareaModule, ChipsModule, TableModule, TagModule,
    RatingModule, ButtonModule, CommonModule, FileUploadModule,
    DropdownModule, ToastModule, RouterLink, AutoCompleteModule, DataViewModule],
  providers: [ProjectService, MessageService]
})

export class ProjectEditComponent implements OnInit {
  mediaFiles!: Media[];
  projectId: string | null = null;
  project!: Project;
  title!: string;
  description!: string;

  platformCollaborators: Collaborator[] = [];
  selectedCollaborators: Collaborator[] = []
  selectedCollaboratorNames: string[] = []
  filteredCollaborators: Collaborator[] = []
  addCollaborators: Collaborator[] = []
  removeCollaborators: Collaborator[] = []

  platformTags: Tag[] = [];
  selectedTags: Tag[] = []
  selectedTagNames: string[] = []
  filteredTags: Tag[] = [];
  addTags:Tag[] =[]
  removeTags:Tag[] =[]
  links: Link[] = [];
  templates!: Template[];
  templateNames: string[] = [];
  selectedTemplateName: string | undefined;
  selectedTemplate: Template | null = null;
  deleteLinkList: Link[] = [];
  deletedMediaList: Media[] = [];
  addedMediaList: FormData[] = [];

  media!: Media[];
  tags: Tag[] | undefined;
  colaborators: Collaborator[] | undefined;
  tagnames: string[] | undefined;
  collaboratornames: string[] | undefined;

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
     private projectService: ProjectService, private messageService: MessageService,private mediaService: MediaService,
     private linkService: LinkService, private collaboratorService: CollaboratorService, private templateService: TemplateService,
     private tagService: TagService,
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





  }

  async initializeFields() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.templates = await this.getAllTemplates()
    this.templateNames = await this.getAllTemplateNames()
    this.platformTags = await this.getAllTags();
    this.platformCollaborators = await this.getAllCollaborators()

    if (this.projectId) {
      this.linkService.getLinksByProjectId(this.projectId).subscribe((response: Link[]) => {
        this.links = response
      });
      this.mediaService.getDocumentsByProjectId(this.projectId).subscribe((response: Media[]) => {
        this.mediaFiles = response;
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
        this.selectedTags = response;
        this.selectedTagNames = this.selectedTags.map(x => x.name)
      });
      this.collaboratorService.getCollaboratorsByProjectId(this.projectId).subscribe((response: Collaborator[]) => {
        this.selectedCollaborators = response
        this.selectedCollaboratorNames = this.selectedCollaborators.map(x => x.name)
      });
    } else {
      console.error('Project ID is null');
    }
  }
  async getAllTags(): Promise<Tag[]> {
    return firstValueFrom(this.tagService.getAllTags());
  }
  getAllCollaborators(): Promise<Collaborator[]> {
    return firstValueFrom(this.collaboratorService.getAllCollaborators())
  }

  async getProjectById(id: string): Promise<Project> {
    return firstValueFrom(this.projectService.getProjectById(id))
  }
  getNamesForCollaborators(collaborators: Collaborator[]): string[] {
    return collaborators.map(x => x.name)
  }

  async getCollaboratorsByProjectId(id: string): Promise<Collaborator[]> {
    return firstValueFrom(this.collaboratorService.getCollaboratorsByProjectId(id))
  }
  filterCollaborators(event: any) {
    const query = (event as AutoCompleteCompleteEvent).query
    this.filteredCollaborators = this.platformCollaborators.filter(collaborator => collaborator.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }
  getNamesForTags(tags: Tag[]): string[] {
    return tags.map(x => x.name)
  }
  filterTags(event: any) {
    const query = (event as AutoCompleteCompleteEvent).query
    this.filteredTags = this.platformTags.filter(tag => tag.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
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
        thumbnail: tmb
      };

      this.removeTags = this.selectedTags.filter(x=>!this.selectedTagNames.includes(x.name));
      this.addTags = this.platformTags.filter(x=>this.selectedTagNames.includes(x.name) && !this.selectedTags.flatMap(x=>x.name).includes(x.name));

      this.removeCollaborators = this.selectedCollaborators.filter(x=>!this.selectedCollaboratorNames.includes(x.name));
      this.addCollaborators = this.platformCollaborators.filter(x=>this.selectedCollaboratorNames.includes(x.name) && !this.selectedCollaborators.flatMap(x=>x.name).includes(x.name));

      const createdProject = await firstValueFrom(this.projectService.editProject(this.projectId, prj));
      console.log('Project edited successfully', createdProject);

      for (const collaborator of this.removeCollaborators) {
        await firstValueFrom(this.collaboratorService.deleteCollaboratorFromProject(collaborator,this.projectId))
      }
      for (const collaborator of this.addCollaborators) {
        await firstValueFrom(this.collaboratorService.addCollaboratorToProject(collaborator,this.projectId))
      }
      for (const tag of this.removeTags) {
        await firstValueFrom(this.tagService.removeTagFromProject(tag,this.projectId))
      }
      for (const tag of this.addTags) {
        await firstValueFrom(this.tagService.addTagToProject(tag,this.projectId));
      }


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
          {const res = await firstValueFrom(this.mediaService.deleteMedia(media.mediaId).pipe(map(x => x as String)));
          console.log('Media deleted successfully', media);
          }
      }
      this.deletedMediaList = []
      this.router.navigate(['/project-detail/', this.projectId])


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

  downloadDocument(mediaId: string) {
    let mediaFile: MediaFileContent = {
      a: "",
      b: "",
    };
    console.log(mediaId);
    this.mediaService.getDocumentContent(mediaId).subscribe({
      next: (data: MediaFileContent) => {
        mediaFile = data;
        this.downloadFile(mediaFile);
      },
      error: (err: any) => {
        console.error('Error fetching media files', err);
      }
    })
  }

  async uploadFile(event: FileUploadHandlerEvent, form: FileUpload) {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);
    //formData.append('name', file.name);
    this.addedMediaList.push(formData);
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Media added! The media will be uploaded when the edit will be saved!'
    });
    let newMedia: Media = {
      mediaId: '',
      name: file.name,
      path: file.name,
      project: this.project,
      requestMediaProjects: []
    }
    this.mediaFiles.push(newMedia)
    form.clear()
  }

}
