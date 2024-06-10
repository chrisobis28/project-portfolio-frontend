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
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'app-roles-menu',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule, FloatLabelModule, FormsModule, CheckboxModule],
  //MULTISELECT
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
  // selectedProjectId: number[] = [];
  // projectsUsername: string[] = [];
  isPM: boolean = false;
  search: string = '';

  ngOnInit(): void {
    if(!this.storageService.isLoggedIn() || this.storageService.getRole() != "ROLE_ADMIN") {
      this.router.navigateByUrl('');
      return;
    }
    this.username = this.storageService.getUser();
    this.accountService.getAccounts().subscribe({
      next: data => {
        this.accounts = data;
        this.filteredAccounts = this.accounts;
      },
      error: err => {
        console.error('Error fetching media files', err);
      }
    })
  }

  async getProjects(username: string): Promise<string[]> {
    return firstValueFrom(this.accountService.getProjects(username));
  }

  // getProjectsDirect(account: Account): Observable<string[]> {
  //   this.projectsUsername = this.accountService.getProjects(account.username);
  // }

}
