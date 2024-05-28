import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Collaborator, Link, Media, MediaFile, Project, Tag} from '../models/project-models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = 'http://localhost:8080'
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    })
  };
  constructor(private readonly httpClient: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.API_URL + "/project", this.httpOptions);
  }

  getMediasContentByProjectId(projectId: string): Observable<MediaFile[]> {
    return this.httpClient.get<MediaFile[]>(this.API_URL + "/media/images/" + `${projectId}`, this.httpOptions);
  }
  getDocumentsByProjectId(projectId: string): Observable<Media[]> {
    return this.httpClient.get<Media[]>(this.API_URL + "/media/file/" + `${projectId}`, this.httpOptions);
  }
  getDocumentContent(mediaId: string): Observable<MediaFile> {
    return this.httpClient.get<MediaFile>(this.API_URL + "/media/file/content/" + `${mediaId}`, this.httpOptions);
  }

  getProjectById(id: string): Observable<Project> {
    return this.httpClient.get<Project>(this.API_URL + "/project/" + `${id}`, this.httpOptions);
  }

  getLinksByProjectId(id: string): Observable<Link[]> {
    return this.httpClient.get<Link[]>(this.API_URL + "/link/" + `${id}`, this.httpOptions);
  }

  getTagsByProjectId(id: string): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(this.API_URL + "/tag/" + `${id}`, this.httpOptions);
  }

  getCollaboratorsByProjectId(id: string): Observable<Collaborator[]> {
    return this.httpClient.get<Collaborator[]>(this.API_URL + "/collaborator/" + `${id}`, this.httpOptions);
  }

  createProject(body: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.API_URL, body, this.httpOptions);
  }
}
