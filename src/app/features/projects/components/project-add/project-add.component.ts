import { Component , OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
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


@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css'],
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule,
     InputTextareaModule, ChipsModule, TableModule, TagModule,
      RatingModule, ButtonModule, CommonModule, FileUploadModule,
      DropdownModule, ToastModule],
  providers: [ProjectService, MessageService]

})
export class ProjectAddComponent implements OnInit{

  media!: Media[];
  projectId: string | null = null;
  project!: Project;
  title!: string;
  description!: string;
  tags: Tag[] | undefined;
  colaborators: Collaborator[] | undefined;
  tagnames: string[] | undefined;
  collaboratornames: string[] | undefined;
  links!: Link[];
  templates!: Template[];
  templateNames: string[] = [];
  selectedTemplate: string | undefined;
  
  constructor(
     private projectService: ProjectService, private messageService: MessageService) {}

  async ngOnInit() {

    this.templates = await this.getAllTemplates()
    this.templateNames = await this.getAllTemplateNames()
    console.log('Templates:', this.templates);
    console.log('Template Names:', this.templateNames);
    // this.projectService.getTemplates().subscribe((response: Template[]) => {
    //   this.templates = response;
    //   this.templateNames = this.templates.map(x => x.templateName)
    //   console.log('Templates:', this.templates);
    //   console.log('Template Names:', this.templateNames);
    // })
    // if (this.projectId) {
    //   this.projectService.getLinksByProjectId(this.projectId).subscribe((response: Link[]) => {
    //     this.links = response
    //   });
    //   this.projectService.getProjectMedia(this.projectId).subscribe((response: Media[]) => {
    //     this.media = response;
    //   });
    //   this.projectService.getProjectById(this.projectId).subscribe((response: Project) => {
    //     this.project = response;
    //     this.title = this.project.title;
    //     this.description = this.project.description;
    //   });
    //   this.projectService.getTagsByProjectId(this.projectId).subscribe((response: Tag[]) => {
    //     this.tags = response;
    //     this.tagnames = this.tags.map(x => x.name);
    //   });
    //   this.projectService.getCollaboratorsByProjectId(this.projectId).subscribe((response: Collaborator[]) => {
    //     this.colaborators = response;
    //     this.collaboratornames = this.colaborators.map(x => x.name)
    //   });
    // } else {
    //   console.error('Project ID is null');
    // }
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

  

  onUpload(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  saveProject(): void {
    
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

    this.projectService.createProject(project).subscribe(response => {
      console.log('Project created successfully', response);
    });
    
  }

  cancel(): void {
    console.log('Operation cancelled');
  }

}


