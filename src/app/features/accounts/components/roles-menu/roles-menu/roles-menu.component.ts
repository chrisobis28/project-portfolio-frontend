import { Component, ElementRef } from '@angular/core';
import { StorageService } from '../../../services/authentication/storage.service';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Account, AccountTransfer, ProjectTransfer } from '../../../models/accounts-models';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/accounts/account.service';
import { Observable, debounceTime, filter, firstValueFrom, fromEvent } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { Project, ProjectsToAccounts } from 'src/app/features/projects/models/project-models';

@Component({
  selector: 'app-roles-menu',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule, FloatLabelModule, FormsModule, CheckboxModule, DropdownModule],
  templateUrl: './roles-menu.component.html',
  styleUrl: './roles-menu.component.css'
})

export class RolesMenuComponent {

  constructor(private storageService: StorageService,
    private readonly router: Router,
    private accountService: AccountService
  ) { }

  username: string = '';
  accounts: AccountTransfer[] = [];
  filteredAccounts: AccountTransfer[] = [];
  selectedProject: ProjectTransfer[] = [];
  replace: string[] = [];
  // projectsUsername: string[] = [];
  isPM: boolean[] = [];
  isPMfilter: boolean = false;
  search: string = '';

  async ngOnInit(): Promise<void> {
    if(!this.storageService.isLoggedIn() || this.storageService.getRole() != "ROLE_ADMIN") {
      this.router.navigateByUrl('');
      return;
    }

    this.username = this.storageService.getUser();
    this.accountService.getAccounts().subscribe({
      next: (data: AccountTransfer[]) => {
        this.accounts = data.filter(x => x.username != this.username);
        this.isPM = new Array(this.accounts.length).fill(false);
        this.accounts.forEach(async x => {
          x.projects = await this.getProjects(x.username);
          x.projects.push({ projectId: 'null', name: 'None of the above', roleInProject: "nothing" });
        });
      },
      error: err => {
        console.error('Error fetching media files', err);
      }
    })
  }

  async getProjects(username: string): Promise<ProjectTransfer[]> {
    return firstValueFrom(this.accountService.getProjects(username));
  }

  retrieveProjectNames(account: AccountTransfer): string[] {
    return account.projects.map(x => x.name);
  }
}
