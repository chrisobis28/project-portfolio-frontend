import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../features/accounts/services/authentication/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const isLoggedIn = this.storageService.isLoggedIn();
    if (!isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
