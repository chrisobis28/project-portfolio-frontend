import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from '../../interface/Classes';

@Injectable({
  providedIn: 'root'
})
export class RequestService{

  private readonly API_URL = 'http://localhost:8080/request/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getRequests(): Observable<Request[]> {
    return this.httpClient.get<Request[]>(this.API_URL);
  }

  getRequestsForUser(username: string): Observable<Request[]> {
    const url = `${this.API_URL}/${username}`;
    return this.httpClient.get<Request[]>(url);
  }

  getRequestsForProject(projectId: number): Observable<Request[]> {
    const url = `${this.API_URL}/${projectId}`;
    return this.httpClient.get<Request[]>(url);
  }
}