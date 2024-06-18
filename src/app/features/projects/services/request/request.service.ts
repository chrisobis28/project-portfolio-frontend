import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from '../../models/project-models';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private readonly API_URL = 'http://localhost:8080/request/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  createRequest(body: Request): Observable<Request> {
    return this.httpClient.put<Request>(this.API_URL, body);
  }

  getRequestsForProject(projectId: string): Observable<Request[]> {
    return this.httpClient.get<Request[]>(this.API_URL + "project/" + `${projectId}`)
  }

  getRequestById(requestId: string, projectId: string): Observable<Request> {
    return this.httpClient.get<Request>(this.API_URL + `${requestId}` + "/" + `${projectId}`)
  }

  acceptRequest(requestId: string, projectId: string): Observable<Object> {
    console.log(this.API_URL + "public/" + `${projectId}` + "/" + `${requestId}`)
    return this.httpClient.post<Object>(this.API_URL + "public/" + `${projectId}` + "/" + `${requestId}`, {})
  }

  rejectRequest(requestId: string): Observable<void> {
    return this.httpClient.delete<void>(this.API_URL + `${requestId}`)
  }
}
