import {Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {CardModule} from 'primeng/card';
import {SplitterModule} from 'primeng/splitter';
import {CommonModule} from '@angular/common';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {CarouselModule} from 'primeng/carousel';
import {ChipModule} from 'primeng/chip';
import {Collaborator, Link, Media, MediaFile, MediaFileContent, Project, Tag} from "../../models/project-models";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {DividerModule} from 'primeng/divider';
import {ProjectService} from "../../services/project/project.service";
import {LinkService} from "../../services/link/link.service";
import {MediaService} from "../../services/media/media.service";
import {CollaboratorService} from "../../services/collaborator/collaborator.service";
import {TagService} from "../../services/tag/tag.service";
import {DialogModule} from "primeng/dialog";
import { Router } from '@angular/router'
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [DividerModule, ChipModule, AccordionModule, BadgeModule, AvatarModule, CardModule, SplitterModule, CommonModule, TagModule, ButtonModule, CarouselModule, DialogModule, RouterLink],
  templateUrl: './project-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  images: MediaFile[] = [];
  documents: Media[] = [];
  bibTeX: MediaFile | undefined = {
    a: '',
    b: '',
    c: ''
  };
  projectId: string = "";
  visible: boolean = false;
  projectDescription: string[] = [];
  project: Project = {
    projectId: '',
    title: '',
    description: '',
    archived: false,
    media: [],
    projectsToAccounts: [],
    projectsToCollaborators: [],
    tagsToProjects: [],
    links: [],
    requests: [],
    collaboratorNames: [],
    tagNames: [],
    tags: [],
    tmb: { a: '', b: '' },
    template: null
  };
  responsiveOptions = [
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
  collaborators: Collaborator[] = [];
  links: Link[] = [];
  tags: Tag[] = [];
  isMobile: boolean;
  constructor(private readonly router:Router, readonly projectService: ProjectService,private readonly tagService: TagService, private readonly linkService: LinkService,private readonly mediaService: MediaService,private readonly collaboratorService: CollaboratorService,private route: ActivatedRoute) {
    this.isMobile = window.innerWidth <= 767;
  }

  getCollaboratorNames(): string {
    return this.collaborators.map(obj => obj.name).join(', ');
  }

   ngOnInit() {
     this.route.params.subscribe(params => {
       this.projectId = (params['id']);
       this.projectService.getProjectById(params['id']).subscribe((responseProject: Project) => {
         this.project = responseProject;
         this.projectDescription = this.project.description.split(/\r?\n|\r|\n/g);
       });
       this.linkService.getLinksByProjectId(params['id']).subscribe((responseLinks: Link[]) => {
         this.links = responseLinks;
       });
       this.collaboratorService.getCollaboratorsByProjectId(params['id']).subscribe((responseCollaborators: Collaborator[]) => {
         this.collaborators = responseCollaborators;
       });
       this.tagService.getTagsByProjectId(params['id']).subscribe((responseTags: Tag[]) => {
         this.tags = responseTags;
       });
     });
     this.mediaService.getMediasContentByProjectId(this.projectId).subscribe({
        next: (data: MediaFile[]) => {
          this.images = data.filter(media => media.a && (media.a.endsWith(".jpg") || media.a.endsWith(".png")));
          this.bibTeX = data.find(media => media.a && media.a.endsWith(".bib"));
        },
        error: (err: any) => {
          console.error('Error fetching media files', err);
        }
      })
      this.mediaService.getDocumentsByProjectId(this.projectId).subscribe({
          next: (data: Media[]) => {
            this.documents = data.filter(media => media.path && !(
              media.path.endsWith(".jpg") ||
              media.path.endsWith(".png")
            ));
          },
          error: (err: any) => {
            console.error('Error fetching media files', err);
          }
        }
      );
    }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 767;
  }

  getImageSrc(media: MediaFile): string {
    return `data:${media.a};base64,${media.b}`;
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

  isAbsoluteUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  convertBibtex(): string | undefined {
    if (this.bibTeX == undefined) {
      return undefined;
    }
    const decodedStr = atob(this.bibTeX.b);
    const utf8Str = decodeURIComponent(escape(decodedStr));
    const lines = utf8Str.split('\n');
    let maxIndex = 0;
    const parts = lines.map(line => {
      const index = line.indexOf('=');
      if (index > maxIndex) {
        maxIndex = index;
      }
      return {line, index};
    });
    const formattedLines = parts.map(part => {
      if (part.index === -1) {
        return part.line;
      }
      const padding = ' '.repeat(maxIndex - part.index);
      return part.line.replace('=', `${padding} =`);
    });
    const formattedBibtex = formattedLines.map(line => {
      return line.replace(/\{(.*?)\}/g, '"$1"');
    });
    return formattedBibtex.join('\n');
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
  showDeleteDialog() {
    this.visible = true;
  }
  deleteProject(projectId:string){
    this.projectService.deleteProject(projectId).subscribe(response => {});
    this.router.navigateByUrl('');
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
}
