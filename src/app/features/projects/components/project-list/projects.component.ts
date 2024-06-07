import { Component, OnInit } from '@angular/core';
import {MediaFileContent, Media, Project} from '../../models/project-models';
import { Tag } from '../../models/project-models';
import { ProjectService } from '../../services/project/project.service';
import { DataView } from 'primeng/dataview';
import { CollaboratorService } from '../../services/collaborator/collaborator.service';
import { firstValueFrom, map } from 'rxjs';
import { TagService } from '../../services/tag/tag.service';
import {MediaService} from "../../services/media/media.service";
import { StorageService } from 'src/app/features/accounts/services/authentication/storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/features/accounts/services/authentication/authentication.service';
import { Nullable } from 'primeng/ts-helpers';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProjectsComponent implements OnInit {
  data: Project[] = [];
  filteredData: Project[] = [];
  layout: DataView["layout"] = "list";
  projectName: string = '';
  projectCollaborator: string = ''
  tagNames: string[] = []
  selectedTagNames: string[] = []
  isLoggedIn: boolean = false;
  username: string = '';
  role: Nullable<string> = '';

  constructor(
    private readonly projectService: ProjectService,
    private readonly collaboratorService: CollaboratorService,
    private tagService: TagService,
    private mediaService: MediaService,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {

    if(this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.username = this.storageService.getUser();
      try {
        const role = await this.authenticationService.getRole(this.username).toPromise();
        if (role) {
          this.storageService.saveRole(role);
          this.role = role;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role is undefined.' });
        }
      } catch (error) {
        console.error('Error fetching role:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not get role.' });
      }
    }

      this.projectService.getAllProjects().subscribe((response: Project[]) => {
        this.data = response;
        this.data.forEach(async x => x.collaboratorNames = await this.getCollaboratorsForId(x.projectId))
        this.data.forEach(async x => x.tagNames = await this.getTagNamesForId(x.projectId))
        this.data.forEach(async x => x.tags = await this.getTagsForId(x.projectId))
        this.data.forEach(async x =>x.media = await this.getMediaForId(x.projectId))
        this.data.forEach(async (x) => {
          x.media = await this.getMediaForId(x.projectId);
          if (x.media && x.media.length > 0) {
            x.tmb = await this.getImageForId(x.media[0].mediaId);
          }
        });
        this.filteredData = this.data
      })
        this.tagNames = await this.getAllTagNames();
    }


  async getCollaboratorsForId(id: string): Promise<string[]> {
    return firstValueFrom(this.collaboratorService.getCollaboratorsByProjectId(id).pipe(
      map(data => data.map(x => x.name))
    ))
  }
  async getImageForId(id: string): Promise<MediaFileContent> {
    return firstValueFrom(this.mediaService.getDocumentContent(id).pipe())
  }
  async getMediaForId(id: string): Promise<Media[]> {
    return firstValueFrom(this.mediaService.getDocumentsByProjectId(id).pipe())
  }

   async getTagsForId(id: string): Promise<Tag[]> {
     return firstValueFrom(this.tagService.getTagsByProjectId(id))
   }

   async getTagNamesForId(id: string): Promise<string[]> {
     return firstValueFrom(this.tagService.getTagsByProjectId(id)
     .pipe(
       map(data => data.map(x => x.name))
     ))
   }

   async getAllTagNames(): Promise<string[]> {
     return firstValueFrom(this.tagService.getAllTags().pipe(
       map(x => x.map(x => x.name))
     ))
   }

  onTitleFilterChange(event: Event): void {
    this.projectName = (event.target as HTMLInputElement).value
    this.filterProjects()
  }

  filterByTitle(dataToFilter: Project[]): Project[] {
    return dataToFilter.filter(x => x.title.toLocaleLowerCase().includes(this.projectName.toLocaleLowerCase()))
  }


  onCollaboratorFilterChange(event: Event): void {
    this.projectCollaborator = (event.target as HTMLInputElement).value
    this.filterProjects()
  }

  filterByCollaborator(dataToFilter: Project[]): Project[] {
    return dataToFilter.filter(project =>
      project.collaboratorNames.some(collaborator =>
        collaborator.toLocaleLowerCase().includes(this.projectCollaborator.toLocaleLowerCase())
      )
    );
  }

  onTagSelectedFilterChanged(): void {
    this.filterProjects()
  }

  filterByTags(dataToFilter: Project[]) {
    return dataToFilter.filter(project => this.selectedTagNames.every(name => project.tagNames.includes(name)))
  }


  filterProjects(): void {
    this.filteredData = this.filterByTitle(this.data)
    this.filteredData = this.filterByCollaborator(this.filteredData)
    this.filteredData = this.filterByTags(this.filteredData)
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
     getImageSrc(project:Project): string {
       if(project.tmb == undefined)
         return 'https://as2.ftcdn.net/v2/jpg/01/25/64/11/1000_F_125641180_KxdtmpD15Ar5h8jXXrE5vQLcusX8z809.jpg'
      return `data:${project.tmb.a};base64,${project.tmb.b}`;
    }



    logout() {
      this.confirmationService.confirm({
        message: "Are you sure you want to log out of the account " + this.storageService.getUser() + "?",
        accept: () => {
          this.authenticationService.logout().subscribe({
            next: () => {
              this.isLoggedIn = false;
              this.storageService.clean();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully.' });
              return;
            },
            error: err => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not be logged out.' });
            }
          })
        }
      })
    }
  }
