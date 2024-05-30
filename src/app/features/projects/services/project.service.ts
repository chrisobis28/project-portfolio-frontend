import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import {Collaborator, Link, Media, Project, Tag, Template} from '..//models/project-models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = 'http://localhost:8080/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  imageFiles: Media[] = [];
  otherFiles: Media[] = [];
  projectId: string = "";

  collaborators: Collaborator[] = [];
  links: Link[] = [];
  tags: Tag[] =[];
  
  getProjectMedia(projectId: string): Observable<Media[]> {
    return this.httpClient.get<Media[]>(`${this.API_URL}media/${projectId}`);
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

  addLinkToProject(link: Link, projectId: string): Observable<Link> {
    return this.httpClient.post<Link>(this.API_URL+"link/"+`${projectId}`, link)
  }

  getTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(this.API_URL+"tag/")
  }

  editProject(id: string, body: Project): Observable<Project> {
    return this.httpClient.put<Project>(this.API_URL + `/${id}`, body);
  }

  deleteProject(id: string): Observable<Object> {
    return this.httpClient.delete<Object>(this.API_URL + `/${id}`);
  }

  getAllCollaborators(): Observable<Collaborator[]> {
    return this.httpClient.get<Collaborator[]>(this.API_URL + 'collaborator/')
  }

  addCollaboratorToProject(collaborator: Collaborator, projectId: string): Observable<Collaborator> {
    const body = "role1"
    console.log(collaborator)
    return this.httpClient.post<Collaborator>(`${this.API_URL}collaborator/${projectId}/${collaborator.collaboratorId}`, body);
  }

  addTagToProject(tag: Tag, projectId: string): Observable<Tag> {
    return this.httpClient.post<Tag>(this.API_URL + "tag/" + `${projectId}` + "/" + `${tag.tagId}`, "")
  }

}