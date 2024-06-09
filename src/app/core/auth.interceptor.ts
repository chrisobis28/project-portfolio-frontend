import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../features/accounts/services/authentication/authentication.service";
import { StorageService } from "../features/accounts/services/authentication/storage.service";

import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private storageService: StorageService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        let authReq = req.clone({
            withCredentials: true
        });
        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error.status === 401) {
                    this.router.navigate(['/login']);
                } else if (error.status === 403) {
                    this.authenticationService.getRole(this.storageService.getUser()).subscribe(
                        role => {
                          this.storageService.saveRole(role);
                          this.router.navigate(['']);
                        },
                        error => {
                          console.error('Error refreshing role:', error);
                        }
                      );
                }
                return throwError(error);
            })
        );
    }
}

export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];