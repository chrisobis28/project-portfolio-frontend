import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Link, Request, RequestLinkProject} from "../../models/project-models";
import { NONE_TYPE } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private readonly API_URL = 'http://localhost:8080/link/'
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

  addRemovedLinkToRequest(requestId: string, linkId: string, projectId: string): Observable<Link> {
    return this.httpClient.put<Link>(this.API_URL + "request/remove/" + `${requestId}` + "/" + `${linkId}` + "/" + `${projectId}`, null)
  }

  addAddedLinkToRequest(requestId: string, link: Link, projectId: string): Observable<Link> {
    return this.httpClient.put<Link>(this.API_URL + "request/add/" + `${requestId}` + "/" + `${projectId}`, link)
  }

  getChangedLinksForRequest(requestId: string, projectId: string): Observable<RequestLinkProject[]> {
    return this.httpClient.get<RequestLinkProject[]>(this.API_URL + "request/" + `${requestId}` + "/" + `${projectId}`)
  }
}
