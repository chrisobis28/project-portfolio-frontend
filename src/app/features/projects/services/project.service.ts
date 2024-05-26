import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import {Collaborator, Link, MediaFile, Project, Tag} from '..//models/project-models';

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
    return this.httpClient.get<MediaFile[]>(`${this.API_URL}media/${projectId}`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.httpClient.get<Project>(this.API_URL+"project/" + `${id}`);
  }
  getLinksByProjectId(id: number): Observable<Link[]> {
    return this.httpClient.get<Link[]>(this.API_URL+"link/" + `${id}`);
  }
  getTagsByProjectId(id: number): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(this.API_URL+"tag/" + `${id}`);
  }
  getCollaboratorsByProjectId(id: number): Observable<Collaborator[]> {
    return this.httpClient.get<Collaborator[]>(this.API_URL+"collaborator/" + `${id}`);
  }

  createProject(body: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.API_URL, body);
  }

  editProject(id: number, body: Project): Observable<Project> {
    return this.httpClient.put<Project>(this.API_URL + `/${id}`, body);
  }

  deleteProject(id: number): Observable<Object> {
    return this.httpClient.delete<Object>(this.API_URL + `/${id}`);
  }

}
