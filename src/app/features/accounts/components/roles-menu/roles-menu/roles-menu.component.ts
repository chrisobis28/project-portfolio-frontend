import { Component, ElementRef, HostListener } from '@angular/core';
import { StorageService } from '../../../services/authentication/storage.service';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AccountTransfer, ProjectTransfer } from '../../../models/accounts-models';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/accounts/account.service';
import { Observable, debounceTime, filter, firstValueFrom, fromEvent } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { Project, ProjectsToAccounts } from 'src/app/features/projects/models/project-models';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-roles-menu',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule, FloatLabelModule, FormsModule, CheckboxModule, DropdownModule, ToastModule],
  providers: [MessageService],
  templateUrl: './roles-menu.component.html',
  styleUrl: './roles-menu.component.css'
})

export class RolesMenuComponent {

  constructor(private storageService: StorageService,
    private readonly router: Router,
    private accountService: AccountService,
    private messageService: MessageService
  ) { }

  username: string = '';
  accounts: AccountTransfer[] = [];
  selectedProject: ProjectTransfer[] = [];
  replace: string[] = [];
  innerWidth: number = 0;
  initialRole: string[] = [];
  searchIsPM: boolean = false;
  searchUsername: string = '';
  previousSearchLength: number = 0;
  isPM: boolean[] = [];

  async ngOnInit(): Promise<void> {
    if(!this.storageService.isLoggedIn() || this.storageService.getRole() != "ROLE_ADMIN") {
      this.router.navigateByUrl('');
      return;
    }
    this.onResize();
    this.innerWidth = window.innerWidth;
    this.previousSearchLength = 0;
    this.username = this.storageService.getUser();
    this.accountService.getAccounts().subscribe({
      next: (data: AccountTransfer[]) => {
        this.accounts = data.filter(x => x.username != this.username);
        this.accounts.forEach(async x => {
          x.projects = await this.getProjects(x.username);
          x.projects.push({ projectId: 'null', name: 'None of the above', roleInProject: "nothing" });
          this.isPM.push(x.pm);
          this.initialRole.push('');
        });
      },
      error: err => {
        console.error('Error fetching media files', err);
      }
    })
  }

  @HostListener('window:resize', ['$even'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  async getProjects(username: string): Promise<ProjectTransfer[]> {
    return firstValueFrom(this.accountService.getProjects(username));
  }

  retrieveProjectNames(account: AccountTransfer): string[] {
    return account.projects.map(x => x.name);
  }

  onApply(i: number, accountTransfer: AccountTransfer): void {
    if(this.isPM[i] != accountTransfer.pm) {
      accountTransfer.pm = this.isPM[i];
      this.accountService.editRoleOfAccount(accountTransfer).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role changed successfully.' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not change PM.' });
        }
      });
    }
    if(this.selectedProject[i] != null && 
      this.initialRole[i] != this.selectedProject[i].roleInProject) {
      if(this.checkRole(this.selectedProject[i].roleInProject)) {
        this.accountService.updateRoleOnProject(accountTransfer.username, 
          this.selectedProject[i].projectId, 
          this.selectedProject[i].roleInProject).subscribe({
          next: () => {
            this.initialRole[i] = this.selectedProject[i].roleInProject;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project role successfully changed.' });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not change role on project.'});
            this.selectedProject[i].roleInProject = this.initialRole[i];
          }
        });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not change role on project.\n' 
          + 'Remember that you have to exclusively pick from: CONTENT_CREATOR, PM and EDITOR.' });
      }
    }
  }

  criteriaIsMet(account: AccountTransfer): boolean {
    if(this.searchIsPM)
      return account.pm == true && account.username.toLocaleLowerCase().includes(this.searchUsername);
    else
      return account.username.toLocaleLowerCase().includes(this.searchUsername);
  }

  onRoleChangeDropdown(i: number, initialRole: string) {
    this.initialRole[i] = initialRole;
  }

  isConditionMet(i: number, account: AccountTransfer): boolean {
    if(this.selectedProject[i] != null)
      return this.isPM[i] != account.pm || this.initialRole[i] != this.selectedProject[i].roleInProject;
    else 
    return this.isPM[i] != account.pm;
  }

  checkRole(role: string): boolean {
    return role == 'CONTENT_CREATOR' || role == 'PM' || role == 'EDITOR';
  }
}
