import {Component, OnInit} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA} from '@angular/core';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {CarouselModule} from 'primeng/carousel';
import { ProjectService } from '../../services/project-detail.service';
import { ChipModule } from 'primeng/chip';
import {OrderListModule} from 'primeng/orderlist';
import {Collaborator, Link, Media, MediaFile, Project, Tag} from "../../models/project-models";
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [ChipModule,AccordionModule, BadgeModule, AvatarModule, CardModule, SplitterModule, CommonModule,TagModule,ButtonModule,CarouselModule,OrderListModule],
  templateUrl: './project-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit{
  imageFiles: MediaFile[] = [];
  otherFiles: MediaFile[] = [];
  projectId: string = "";
  project: Project = {
    projectId: '',
    title: '',
    description: '',
    bibtex: '',
    archived: false,
    media: [],
    projectsToAccounts: [],
    projectsToCollaborators: [],
    tagsToProjects: [],
    links: [],
    requests: []
  };
  collaborators: Collaborator[] = [];
  links: Link[] = [];
  tags: Tag[] =[];

  constructor(private readonly projectService: ProjectService,private route: ActivatedRoute) { }
  getCollaboratorNames(): string {
    return this.collaborators.map(obj => obj.name).join(', ');
  }
  getBibTex(): string {
    return "@Article { MHCOLHHASD24,\n" +
      "  author       = \"Mody, Prerak P. and Huiskes, Merle  and Chaves de Plaza, Nicolas and Onderwater, Alice and Lamsma, Rense and\n" +
      "                  Hildebrandt, Klaus and Hoekstra, Nienke and Astreinidou, Eleftheria and Staring, Marius and Dankers, Frank\",\n" +
      "  title        = \"\tLarge-scale dose evaluation of deep learning organ contours in head-and-neck radiotherapy by leveraging\n" +
      "                  existing plans\",\n" +
      "  journal      = \"Physics and Imaging in Radiation Oncology\",\n" +
      "  year         = \"2024\",\n" +
      "  doi          = \"https://doi.org/10.1016/j.phro.2024.100572\",\n" +
      "  url          = \"http://graphics.tudelft.nl/Publications-new/2024/MHCOLHHASD24\"\n" +
      "}";
  }
  responsiveOptions: any[] | undefined;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = (params['id']);
      this.projectService.getProjectById(params['id']).subscribe(responseProject => {
        this.project = responseProject;
      });
      this.projectService.getLinksByProjectId(params['id']).subscribe(responseLinks => {
        this.links = responseLinks;
      });
      this.projectService.getCollaboratorsByProjectId(params['id']).subscribe(responseCollaborators => {
        this.collaborators = responseCollaborators;
      });
      this.projectService.getTagsByProjectId(params['id']).subscribe(responseTags => {
        this.tags = responseTags;
      });
    });
    this.projectService.getProjectMedia(this.projectId).subscribe({
      next: (data: MediaFile[]) => {
        this.imageFiles = data.filter(media => {
          return media.a && (media.a.endsWith(".jpg") || media.a.endsWith(".png"));
        });
        this.otherFiles = data.filter(media => {
          return media.a && !(media.a.endsWith(".jpg") || media.a.endsWith(".png"));
        });
      },
      error: (err) => {
        console.error('Error fetching media files', err);
      }
    });

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  getImageSrc(media: MediaFile): string {
    return `data:${media.a};base64,${media.b}`;
  }
  private mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'html': 'text/html',
  };

  getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return this.mimeTypes[extension] || 'application/octet-stream';
  }
  downloadFile(media: MediaFile) {
    const mimeType = this.getMimeType(media.a)
    const byteArray = new Uint8Array(atob(media.b).split('').map(char => char.charCodeAt(0)));
    const file = new Blob([byteArray], { type: mimeType });
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
  isAbsoluteUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }
  protected readonly document = document;
}
