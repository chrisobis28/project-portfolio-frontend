import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Request } from '../../models/project-models';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService{

  private readonly API_URL = 'http://localhost:8080/request/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getRequests(): Observable<Request[]> {
    return this.httpClient.get<Request[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );;
  }

  getRequestsForUser(username: string): Observable<Request[]> {
    const url = `${this.API_URL}user/${username}`;
    return this.httpClient.get<Request[]>(url).pipe(
      catchError(this.handleError)
    );;
  }

  getRequestsForProject(projectId: number): Observable<Request[]> {
    const url = `${this.API_URL}project/${projectId}`;
    return this.httpClient.get<Request[]>(url).pipe(
      catchError(this.handleError)
    );;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}