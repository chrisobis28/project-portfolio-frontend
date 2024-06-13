import { Component } from '@angular/core';
import { StorageService } from '../../../services/authentication/storage.service';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Account } from '../../../models/accounts-models';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/accounts/account.service';
import { Observable, filter, firstValueFrom } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { Project } from 'src/app/features/projects/models/project-models';

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
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  currentProjects: string[] = ['asdasd'];
  selectedProject: string[] = [];
  // projectsUsername: string[] = [];
  isPM: boolean = false;
  search: string = '';

  async ngOnInit(): Promise<void> {
    if(!this.storageService.isLoggedIn() || this.storageService.getRole() != "ROLE_ADMIN") {
      this.router.navigateByUrl('');
      return;
    }
    this.username = this.storageService.getUser();
    this.accountService.getAccounts().subscribe({
      next: (data: Account[]) => {
        this.accounts = data.filter(x => x.username != this.username);
        // this.accounts.forEach(async x => {
        //   const projects = await this.getProjects(x.username);
        //   x.project = projects.map(project => ({ id: project.projectId, title: project.title }));
        // });
      },
      error: err => {
        console.error('Error fetching media files', err);
      }
    })
  }

  async getProjects(username: string): Promise<Project[]> {
    return firstValueFrom(this.accountService.getProjects(username));
  }

  retrieveProjects(account: Account): string[] {
    return account.project.map(x => x.id);
  }
}
