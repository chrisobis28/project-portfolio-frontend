import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        let authReq = req.clone({
            withCredentials: true
        });
        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error.status === 401) {
                    this.router.navigate(['/login']);
                }
                return throwError(error);
            })
        );
    }
}

export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];