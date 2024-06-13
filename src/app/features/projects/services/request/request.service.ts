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
    return this.httpClient.post<Request>(this.API_URL, body);
  }
}
