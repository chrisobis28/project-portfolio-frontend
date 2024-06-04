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
import {FileUploadEvent, FileUploadModule} from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import{ MediaService} from "../../services/media/media.service";
import { DropdownModule } from 'primeng/dropdown';
import { firstValueFrom, map } from 'rxjs';
import { LinkService } from '../../services/link/link.service';
import { CollaboratorService } from '../../services/collaborator/collaborator.service';
import { TemplateService } from '../../services/template/template.service';
import { TagService } from '../../services/tag/tag.service';
import { Serializer } from '@angular/compiler';
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

  constructor(private route: ActivatedRoute,
     private projectService: ProjectService, private messageService: MessageService,private mediaService: MediaService,
     private linkService: LinkService, private collaboratorService: CollaboratorService, private templateService: TemplateService,
     private tagService: TagService,
     private readonly router: Router
    ) {}

  async ngOnInit() {
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
