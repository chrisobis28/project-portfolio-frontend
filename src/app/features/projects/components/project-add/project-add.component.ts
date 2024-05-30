import { Component , OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormControl, FormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { Collaborator, Link, Media, Project, Tag, Template } from '../../models/project-models';
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

  media!: Media[];
  project!: Project;
  title: string = '';
  description: string = '';
  tags: Tag[] = [];
  selectedTags: string[] = []
  colaborators: Collaborator[] = []
  tagnames: string[] = [];
  collaboratornames: string[] = []
  selectedCollaborators: string[] = []
  links: Link[] = [{ linkId: '', name: '', url: '', requestLinkProjects: [] }];
  templates!: Template[];
  templateNames: string[] = [];
  selectedTemplate: string | undefined;
  filteredTags: Tag[] = [];
  filteredCollaborators: Collaborator[] = []
  titleInput = new FormControl('', [Validators.required]);
  descriptionInput = new FormControl('', [Validators.required]);
  

  invalidTitle: boolean = false
  invalidDescription: boolean = false
  invalidMedia: boolean = false
  
  constructor(
     private projectService: ProjectService, private messageService: MessageService) {}

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
      if(this.title.length == 0)
        this.titleInput.setErrors({ invalid: true });
      if(this.description.length == 0)
        this.descriptionInput.setErrors({ invalid: true });
      if(this.media.length == 0)
        this.invalidMedia = true

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

      for (const link of this.links) {
        await firstValueFrom(this.projectService.addLinkToProject(link, createdProject.projectId))
        console.log('Links updated successfully in project', createdProject);
      }

      const finalCollaborators = this.colaborators.filter(x => this.selectedCollaborators.includes(x.name))
      for(const collaborator of finalCollaborators) {
        console.log(this.colaborators)
        await firstValueFrom(this.projectService.addCollaboratorToProject(collaborator, createdProject.projectId))
      }

      const finalTags = this.tags.filter(x => this.selectedTags.includes(x.name))

      for(const tag of finalTags) {
        await firstValueFrom(this.projectService.addTagToProject(tag, createdProject.projectId))
      }

      this.selectedTags = []

    } catch (error) {
      console.error('Error saving project or links', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save project or links' });
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
  //&& this.media.length > 0
}

getInvalidTitle(): boolean {
  return this.invalidTitle
}

}



