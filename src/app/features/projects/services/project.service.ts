import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Collaborator, Link, MediaFile, Project, Tag} from '../models/project-models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = 'http://localhost:8080/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  getAllProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.API_URL+"/project");
  }
  getProjectMedia(projectId: string): Observable<MediaFile[]> {
    return this.httpClient.get<MediaFile[]>(this.API_URL+"media/"+`${projectId}`);
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
  createProject(body: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.API_URL, body);
  }
}
