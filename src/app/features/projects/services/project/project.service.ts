import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Collaborator, Link, Media, Project, Tag, Template} from '../../models/project-models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = 'http://localhost:8080/';

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getAllProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.API_URL);
  }
  
  getDocumentsByProjectId(projectId: string): Observable<Media[]> {
    return this.httpClient.get<Media[]>(this.API_URL+"media/file/" + `${projectId}`);
  }

  getProjectById(id: string): Observable<Project> {
    return this.httpClient.get<Project>(this.API_URL+"project/" + `${id}`);
  }
  getLinksByProjectId(id: string): Observable<Link[]> {
    return this.httpClient.get<Link[]>(this.API_URL+"link/" + `${id}`);
  }
  getTagsByProjectId(id: string): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(this.API_URL+"tag/" + `${id}`);
  }
  getCollaboratorsByProjectId(id: string): Observable<Collaborator[]> {
    return this.httpClient.get<Collaborator[]>(this.API_URL+"collaborator/" + `${id}`);
  }
  getTemplates(): Observable<Template[]> {
    return this.httpClient.get<Template[]>(this.API_URL + "template");
  }

  createProject(body: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.API_URL+"project/", body);
  }

  editProject(id: String, body: Project): Observable<Project> {
    return this.httpClient.put<Project>(this.API_URL + "project/" + `${id}`, body);
  }

  deleteProject(id: String): Observable<String> {
    return this.httpClient.delete<String>(this.API_URL + "project/" + `${id}`);
  }

  addLinkToProject(link: Link, projectId: string): Observable<Link> {
    return this.httpClient.post<Link>(this.API_URL+"link/"+`${projectId}`, link)
  }

  getTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(this.API_URL+"tag/")
  }

  deleteLinkById(id: string): Observable<Object> {
    return this.httpClient.delete<Object>(this.API_URL + "link/" + `${id}`)
  }

  editLinkOfProject(link: Link): Observable<Link> {
    return this.httpClient.put<Link>(this.API_URL + "link/", link)
  }

}
