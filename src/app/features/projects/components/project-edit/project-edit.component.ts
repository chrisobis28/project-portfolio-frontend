import { Component , OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import {
  Collaborator,
  CollaboratorTransfer,
  EditMedia,
  Link,
  Media,
  MediaFileContent,
  Project,
  Tag,
  Template
} from '../../models/project-models';
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
import {DialogModule} from "primeng/dialog";
import { ColorPickerModule } from 'primeng/colorpicker';
@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule,
    InputTextareaModule, ChipsModule, TableModule, TagModule,
    RatingModule, ButtonModule, CommonModule, FileUploadModule,
    DropdownModule, ToastModule, RouterLink, AutoCompleteModule, DataViewModule, DialogModule, ReactiveFormsModule, ColorPickerModule],
  providers: [ProjectService, MessageService]
})

export class ProjectEditComponent implements OnInit {
  projectId: string | null = null;
  project!: Project;
  title!: string;
  description!: string;
  newTagName: string = "";
  newTagColor: string = "";
  addTagVisible: boolean = false;
  deleteDialogVisible = false;
  platformCollaborators: Collaborator[] = [];
  projectCollaborators: CollaboratorTransfer[] = []
  editIndex: number | null = null;
  selectedCollaboratorNames: string[] = []
  filteredCollaborators: Collaborator[] = []
  removeCollaborators: string[] = []
  selectedCollaborators: CollaboratorTransfer[] = [];
  initialTags: Tag[] = [];

  addCollaboratorVisible: boolean = false;
  newCollaboratorName: string = '';
  newCollaboratorRole: string = '';
  collaboratorNameInput = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z ]{1,50}$')
  ]);
  collaboratorRoleInput = new FormControl('', Validators.required);

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

  editMediaList: EditMedia[] = []

  tags: Tag[] | undefined;
  tagnames: string[] | undefined;
  collaboratornames: string[] | undefined;
  collaborators: Collaborator[] = [];
  tagColorInput = new FormControl('', [Validators.required]);
  tagNameInput = new FormControl('', [Validators.required]);
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

  ngOnDestroy(): void {
    if (this.wsTagsSubscription)
      this.wsTagsSubscription.unsubscribe()
    if (this.wsCollaboratorsSubscription)
      this.wsCollaboratorsSubscription.unsubscribe()
  }

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
            this.selectedTags = newTags;
            this.selectedTagNames = newTags.map(x => x.name);
          }
        }
      }
     )

     this.wsMediaProjectSubscription = this.mediaProjectWebSocket.subscribe(
      async msg => {
        if(msg == "all" || msg == this.projectId) {
          if(this.projectId){
            this.editMediaList=[]
          const newMedia = await this.getDocumentsByProjectId(this.projectId)
            for (const mediaObject of newMedia) {
            {
              const editMedia:EditMedia = {
                media:mediaObject,
                mediaFileContent:null,
                file:null,
                delete:false
              }
              this.editMediaList.push(editMedia)
            }
        }
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

     this.wsCollaboratorsSubscription = this.collaboratorsWebSocket.subscribe(
      async msg => {
        const words = msg.split(" ")
        const newCollaborators = await this.getAllCollaborators()
        this.collaborators = newCollaborators
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
    this.collaborators = await this.getAllCollaborators()
    this.platformCollaborators = await this.getAllCollaborators()

    if (this.projectId) {
      this.linkService.getLinksByProjectId(this.projectId).subscribe((response: Link[]) => {
        this.links = response
      });
      this.mediaService.getDocumentsByProjectId(this.projectId).subscribe((response: Media[]) => {
        for (const mediaObject of response) {
          {
            const editMedia:EditMedia = {
              media:mediaObject,
              mediaFileContent:null,
              file:null,
              delete:false
            }
            this.editMediaList.push(editMedia)
          }
        }
      });
      this.projectService.getProjectById(this.projectId).subscribe((response: Project) => {
        this.project = response;
        this.title = this.project.title;
        this.description = this.project.description;
        this.selectedTemplate = this.project.template;
        this.selectedTemplateName = this.project.template?.templateName;
      });
      this.tagService.getTagsByProjectId(this.projectId).subscribe((response: Tag[]) => {
        this.tags = response;
        this.initialTags = response
        this.tagnames = this.tags.map(x => x.name);
        this.selectedTags = this.tags;
        this.selectedTagNames = this.tagnames;
      });
      this.collaboratorService.getCollaboratorsByProjectId(this.projectId).subscribe((response: CollaboratorTransfer[]) => {
        this.projectCollaborators = response
        this.selectedCollaboratorNames = this.projectCollaborators.map(x => x.name)
        this.selectedCollaborators = [...this.projectCollaborators];
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

  async getCollaboratorsByProjectId(id: string): Promise<CollaboratorTransfer[]> {
    return firstValueFrom(this.collaboratorService.getCollaboratorsByProjectId(id))
  }

  filterCollaborators(event: any) {
    const query = (event as AutoCompleteCompleteEvent).query.toLowerCase();
    this.filteredCollaborators = this.collaborators
      .filter(collaborator => collaborator.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
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
      const thumbnail: MediaFileContent = {
        filePath: '',
        fileContent: '',
        fileName:''
      }

      const foundTemplate = this.templates.find(x => x.templateName === this.selectedTemplateName);
      this.selectedTemplate = foundTemplate !== undefined ? foundTemplate : null;

      const prj: Project = {
        projectId: "",
        title: this.title,
        description: this.description,
        archived: false,
        template: this.selectedTemplate,
        media: [],
        projectsToAccounts: [],
        projectsToCollaborators: [],
        tagsToProjects: [],
        links: this.links,
        requests: [],
        collaboratorNames: [],
        tagNames: [],
        tags: [],
        thumbnail: thumbnail
      };

      this.removeTags = this.initialTags.filter(tag => !this.selectedTags.map(t => t.name).includes(tag.name));
      this.addTags = this.selectedTags.filter(tag => !this.initialTags.map(t => t.name).includes(tag.name));
    
      // this.removeTags = this.selectedTags.filter(x=>!this.selectedTagNames.includes(x.name));
      // this.removeTags = this.tags.filter(x=>!this.selectedTags.includes(x));
      // this.addTags = this.platformTags.filter(x=>this.selectedTagNames.includes(x.name) && !this.selectedTags.flatMap(x=>x.name).includes(x.name));

      // this.removeCollaborators = this.projectCollaborators.filter(x=>!this.selectedCollaboratorNames.includes(x.name)).map(x => x.collaboratorId);
      // this.addCollaborators = this.platformCollaborators.filter(x=>this.selectedCollaboratorNames.includes(x.name) && !this.projectCollaborators.flatMap(x=>x.name).includes(x.name));

      const createdProject = await firstValueFrom(this.projectService.editProject(this.projectId, prj));

      for (const collaborator of this.removeCollaborators) {
        await firstValueFrom(this.collaboratorService.deleteCollaboratorFromProject(this.projectId, collaborator))
      }
      for (const collaborator of this.selectedCollaborators) {
        await firstValueFrom(this.collaboratorService.createAndAddCollaboratorToProject(collaborator,this.projectId))
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
        } else {
          await firstValueFrom(this.linkService.editLinkOfProject(link))
        }
      }

      for (const link of this.deleteLinkList) {
        await firstValueFrom(this.linkService.deleteLinkById(link.linkId));
      }
      this.deleteLinkList = []
      for (const editMedia of this.editMediaList) {
          if(editMedia.delete && editMedia.media != null && editMedia.media.mediaId!='')
          {
            await firstValueFrom(this.mediaService.deleteMedia(this.projectId,editMedia.media.mediaId).pipe(map(x => x as String)));
          }
          else if(!editMedia.delete && editMedia.media != null && editMedia.file!=null && editMedia.media.mediaId=='')
          {
            const formData = new FormData();
            formData.append('file', editMedia.file);
            formData.append('name', editMedia.media.name);
            await firstValueFrom(this.mediaService.addDocumentToProject(this.project.projectId, formData));
          }
          else if(editMedia.media != null && editMedia.media.mediaId!='')
        {
          await firstValueFrom(this.mediaService.editMedia(editMedia.media));
        }
      }
      this.editMediaList = []
      await this.router.navigate(['/project-detail/', this.projectId])

    } catch (error) {
      console.error('Error saving project,media or links', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save project or links' });
    }
  }

  cancel(): void {
    this.router.navigateByUrl("http://localhost:4200/project-detail/" + this.projectId);
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
     this.editMediaList[index].delete=true
   }

  removeTemplate(): void {
    this.selectedTemplateName = ''
    this.selectedTemplate = null;}

  downloadFile(media: MediaFileContent) {
   this.mediaService.downloadFile(media);
  }

  downloadDocument(mediaId: string) {
    let mediaFile: MediaFileContent = {
      fileName: "",
      filePath: "",
      fileContent:""
    };
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
    const newEditMedia:EditMedia={
      media:newMedia,
      mediaFileContent:null,
      file:file,
      delete:false
    }
    this.editMediaList.push(newEditMedia);
    form.clear()
  }
  showAddTagDialog() {
    this.addTagVisible = true;
  }
  async saveNewTag(): Promise<void> {
    if (this.newTagName.length == 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'The Tag Name cannot be empty'});
      return;
    }
    if (this.newTagColor.length == 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'The Tag Color cannot be empty'});
      return;
    }
    try {
      const newTag:Tag = {
        tagId: "",
        color: "",
        name: "",
        requestTagProjects: [],
        tagsToProjects: []
      }

      newTag.name = this.newTagName;
      newTag.color = this.newTagColor;
      await firstValueFrom(this.tagService.createTag(newTag));
      this.addTagVisible=false
      this.messageService.add({ severity: 'success', summary: 'Success', detail:"The tag was successfully added" });
    }
    catch (error) {
      console.error('Error saving the new tag', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: (error as Error).message });
    }
  }

  showAddCollaboratorDialog() {
    this.addCollaboratorVisible = true;
  }

  onCollaboratorSelect(event: any) {
    const selectedCollaborator = event.value;
    this.newCollaboratorName = selectedCollaborator.name;
    this.collaboratorNameInput.setValue(selectedCollaborator.name);
  }

  editCollaborator(collaborator: CollaboratorTransfer, index: number) {
    this.newCollaboratorName = collaborator.name;
    this.newCollaboratorRole = collaborator.role;
    this.editIndex = index;
    this.showAddCollaboratorDialog();
  }

  removeCollaborator(index: number) {
    const collaborator = this.selectedCollaborators[index];
    if (collaborator.collaboratorId) {
      this.removeCollaborators.push(collaborator.collaboratorId);
      collaborator.collaboratorId = '';
    }
    this.selectedCollaborators.splice(index, 1);
  }

  saveNewCollaborator() {
    if (this.collaboratorNameInput.invalid || this.collaboratorRoleInput.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid collaborator name or role' });
      return;
    }

    const isDuplicate = this.selectedCollaborators.some((collaborator, index) => 
      collaborator.name.toLowerCase() === this.newCollaboratorName.toLowerCase() && index !== this.editIndex
    );

    if (isDuplicate) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'A collaborator with the same name already exists' });
      return;
    }
    if (this.editIndex !== null) {
      const collaborator = this.selectedCollaborators[this.editIndex];
      if (collaborator && collaborator.collaboratorId) {
        this.removeCollaborators.push(collaborator.collaboratorId);
      }
      collaborator.name = this.newCollaboratorName;
      collaborator.role = this.newCollaboratorRole;
    } else {
      const newCollaborator: CollaboratorTransfer = {
        collaboratorId: '',
        name: this.newCollaboratorName,
        role: this.newCollaboratorRole
      };
      this.selectedCollaborators.push(newCollaborator);
    }

    this.newCollaboratorName = '';
    this.newCollaboratorRole = '';
    this.editIndex = null;
    this.addCollaboratorVisible = false;
  }

  cancelAddCollaborator() {
    this.addCollaboratorVisible = false;
    this.newCollaboratorName = '';
    this.newCollaboratorRole = '';
    this.collaboratorNameInput.reset();
    this.collaboratorRoleInput.reset();
    this.editIndex = null;
  }

  isDarkColor(color: string): boolean {
    return this.tagService.isDarkColor(color);
  }

  showDeleteDialog(): void {
    this.deleteDialogVisible = true;
  }
}
