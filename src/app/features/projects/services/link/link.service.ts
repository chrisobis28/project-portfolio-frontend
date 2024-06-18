import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Link} from "../../models/project-models";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private readonly API_URL = environment.apiUrl + '/link/';
  constructor(private readonly httpClient: HttpClient) { }

  getLinksByProjectId(id: string): Observable<Link[]> {
    return this.httpClient.get<Link[]>(this.API_URL + `public/${id}`);
  }

  addLinkToProject(link: Link, projectId: string): Observable<Link> {
    return this.httpClient.post<Link>(this.API_URL+`${projectId}`, link)
  }

  deleteLinkById(id: string): Observable<Object> {
    return this.httpClient.delete<Object>(this.API_URL + `${id}`)
  }

  editLinkOfProject(link: Link): Observable<Link> {
    return this.httpClient.put<Link>(this.API_URL, link)
  }
}
