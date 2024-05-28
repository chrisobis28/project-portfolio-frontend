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
import {OrderListModule} from 'primeng/orderlist';
import {Collaborator, Link, Media, MediaFile, Project, Tag} from "../../models/project-models";
import {ActivatedRoute} from '@angular/router';
import { DividerModule } from 'primeng/divider';
import {ProjectService} from "../../services/project/project.service";

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [DividerModule,ChipModule, AccordionModule, BadgeModule, AvatarModule, CardModule, SplitterModule, CommonModule, TagModule, ButtonModule, CarouselModule, OrderListModule],
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
  projectDescription: string[] = [];
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
    requests: [],
    collaboratorNames: [],
    tagNames: [],
    tags: [],
  };
  collaborators: Collaborator[] = [];
  links: Link[] = [];
  tags: Tag[] = [];
  isMobile: boolean;
  responsiveOptions: any[] | undefined;
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
    'bib': 'application/x-bibtex'
  };

  constructor(private readonly projectService: ProjectService, private route: ActivatedRoute) {
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
        this.projectDescription = this.project.description.split('\\n')
      });
      this.projectService.getLinksByProjectId(params['id']).subscribe((responseLinks: Link[]) => {
        this.links = responseLinks;
      });
      this.projectService.getCollaboratorsByProjectId(params['id']).subscribe((responseCollaborators: Collaborator[]) => {
        this.collaborators = responseCollaborators;
      });
      this.projectService.getTagsByProjectId(params['id']).subscribe((responseTags: Tag[]) => {
        this.tags = responseTags;
      });
    });
    this.projectService.getMediasContentByProjectId(this.projectId).subscribe({
      next: (data: MediaFile[]) => {
        this.images = data.filter(media => media.a && (media.a.endsWith(".jpg") || media.a.endsWith(".png")));
        this.bibTeX = data.find(media => media.a && media.a.endsWith(".bib"));
      },
      error: (err:any) => {
        console.error('Error fetching media files', err);
      }
    })
    this.projectService.getDocumentsByProjectId(this.projectId).subscribe({
      next: (data: Media[]) => {
        this.documents = data.filter(media => media.path && !(
          media.path.endsWith(".jpg") ||
          media.path.endsWith(".png")
        ));
      },
      error: (err:any) => {
        console.error('Error fetching media files', err);
      }
    }
    );


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
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 767;
  }

  getImageSrc(media: MediaFile): string {
    return `data:${media.a};base64,${media.b}`;
  }

  getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return this.mimeTypes[extension] || 'application/octet-stream';
  }

  downloadFile(media: MediaFile) {
    const mimeType = this.getMimeType(media.a)
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
  async downloadDocument(mediaId: string){
    let mediaFile : MediaFile = {
      a:"",
      b:"",
      c:""
    };
    this.projectService.getDocumentContent(mediaId).subscribe({
      next: (data: MediaFile) => {
       mediaFile = data;
      },
      error: (err:any) => {
        console.error('Error fetching media files', err);
      }
    })
    this.downloadFile(mediaFile);
  }

}
