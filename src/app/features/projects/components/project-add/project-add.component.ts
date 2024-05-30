import { Component , OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormControl, FormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { Collaborator, Link, Media, MediaFileContent, Project, Tag, Template } from '../../models/project-models';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from '../../services/project.service';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { firstValueFrom, map } from 'rxjs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { ReactiveFormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import {FileUploadEvent} from 'primeng/fileupload';
import { MediaService } from '../../services/media/media.service';



@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css'],
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule,
     InputTextareaModule, ChipsModule, TableModule, TagModule,
      RatingModule, ButtonModule, CommonModule, FileUploadModule,
      DropdownModule, ToastModule, AutoCompleteModule, ChipModule, ReactiveFormsModule, DataViewModule],
  providers: [ProjectService, MessageService]

})
export class ProjectAddComponent implements OnInit{

  media: Media[] = [];
  project!: Project;
  title: string = '';
  description: string = '';
  tags: Tag[] = [];
  selectedTags: string[] = []
  colaborators: Collaborator[] = []
  tagnames: string[] = [];
  collaboratornames: string[] = []
  selectedCollaborators: string[] = []
  links: Link[] = [];
  templates!: Template[];
  templateNames: string[] = [];
  selectedTemplate: string | undefined;
  filteredTags: Tag[] = [];
  filteredCollaborators: Collaborator[] = []
  titleInput = new FormControl('', [Validators.required]);
  descriptionInput = new FormControl('', [Validators.required]);
  addedMediaList:FormData[]=[];
  deletedMediaList:Media[] =[];
  

  invalidTitle: boolean = false
  invalidDescription: boolean = false
  invalidMedia: boolean = false
  
  constructor(
     private projectService: ProjectService, private messageService: MessageService,
    private mediaService: MediaService
    ) {}

  async ngOnInit() {
    this.tags = await this.getAllTags();
    this.tagnames = this.tags.map(x => x.name)
    this.filteredTags = this.tags
    this.templates = await this.getAllTemplates()
    this.templateNames = await this.getAllTemplateNames()
    this.colaborators = await this.getAllCollaborators()
    console.log('Templates:', this.templates);
    console.log('Template Names:', this.templateNames);
    this.selectedTags = []
    this.selectedCollaborators = []
    this.titleInput.setValue("")
    this.descriptionInput.setValue("")
    

  }

  async getAllTemplates(): Promise<Template[]> {
    return firstValueFrom(this.projectService.getTemplates())
  }

  async getAllTemplateNames(): Promise<string[]> {
    return firstValueFrom(this.projectService.getTemplates()
    .pipe(
      map(x => x.map(y => y.templateName))
    ))
    
  }

  filterTags(event: any) {
    const query = (event as AutoCompleteCompleteEvent).query
    this.filteredTags = this.tags.filter(tag => tag.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }

  filterCollaborators(event: any) {
    const query = (event as AutoCompleteCompleteEvent).query
    this.filteredCollaborators = this.colaborators.filter(collaborator => collaborator.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }

  onTagSelect(event: any) {
    const tag = event;
    if (!this.tagnames.includes(tag)) {
      this.tagnames.push(tag);
    }
  }

  onUpload(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  async saveProject(): Promise<void> {

    if (this.isAnyLinkFieldEmpty()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'All link fields must be filled out' });
      return;
    }


    if(!this.isTitleDescriptionAndMediaValid()) {
      if(this.title.length == 0){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Title can not be empty' });
        return;
      }
      if(this.description.length == 0){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Description can not be empty' });
        return;
      }
      if(this.media.length == 0){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Media can not be empty' });
        return
      }
      for (const link of this.links) {
        if(link.name.length < 1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Links can not have an empty title' });
          return
        }
        if(link.url.length < 1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Links can not have an empty url' });
          return
        }
      }

      return;
    }
    try {
      this.titleInput.setErrors({ invalid: false });
      this.descriptionInput.setErrors({ invalid: false });
      const project: Project = {
        projectId: "",
        title: this.title,
        description: this.description,
        bibtex: '',
        archived: false,
        media: [],
        projectsToAccounts: [],
        projectsToCollaborators: [],
        tagsToProjects: [],
        links: [],
        requests: []
      };
  
      const createdProject = await firstValueFrom(this.projectService.createProject(project));
      console.log('Project created successfully', createdProject);

      this.title = ""
      this.description = ""

      for (const link of this.links) {
        await firstValueFrom(this.projectService.addLinkToProject(link, createdProject.projectId))
        console.log('Links updated successfully in project', createdProject);
      }
      this.links = []

      const finalCollaborators = this.colaborators.filter(x => this.selectedCollaborators.includes(x.name))
      for(const collaborator of finalCollaborators) {
        console.log(this.colaborators)
        await firstValueFrom(this.projectService.addCollaboratorToProject(collaborator, createdProject.projectId))
      }

      this.selectedCollaborators = []

      const finalTags = this.tags.filter(x => this.selectedTags.includes(x.name))

      for(const tag of finalTags) {
        await firstValueFrom(this.projectService.addTagToProject(tag, createdProject.projectId))
      }

      this.selectedTags = []

      for (const media of this.addedMediaList) {
        await firstValueFrom(this.mediaService.addDocumentToProject(createdProject.projectId, media));
        console.log('Media added successfully', media);
      }
      
      this.addedMediaList = []


    } catch (error) {
      console.error('Error saving project or links', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: (error as Error).message });
    }
  }

  async getAllTags(): Promise<Tag[]> {
    return firstValueFrom(this.projectService.getTags());
  }

  cancel(): void {
    console.log('Operation cancelled');
    this.selectedTags = []
  }

  isAnyLinkFieldEmpty(): boolean {
    return this.links.some(link => link.name == '' || link.url == '');
  }

  addLink() {
    const link: Link = { linkId: '', name: '', url: '', requestLinkProjects: [] };
    this.links.push(link);
  }

  removeLink(linkToRemove: Link): void {
    let index = this.links.findIndex(obj => obj === linkToRemove);

    if (index !== -1) {
    this.links.splice(index, 1);
  }
}

  titleValidator(control: AbstractControl): ValidationErrors | null {
    if(this.invalidTitle)
      return null
    else return { customError: true };
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
        return "rgba(0, 0, 0, 0.45)"
      default:
        return "rgba(111, 118, 133, 0.45)"
    }
}

getNamesForTags(tags: Tag[]): string[] {
  return tags.map(x => x.name)
}

getNamesForCollaborators(collaborators: Collaborator[]): string[] {
  return collaborators.map(x => x.name)
}

getAllCollaborators(): Promise<Collaborator[]> {
  return firstValueFrom(this.projectService.getAllCollaborators())
}

isTitleDescriptionAndMediaValid(): boolean{
  return this.title.length > 0 && this.description.length > 0 
  && this.media.length > 0
}

getInvalidTitle(): boolean {
  return this.invalidTitle
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

removeMedia(index: number): void {
  this.deletedMediaList.push(this.media[index])
  this.addedMediaList = this.addedMediaList.filter(x=>x.get('name')!=this.media[index].path);
  console.log(this.media[index].path);
  this.media.splice(index, 1);
}






}



