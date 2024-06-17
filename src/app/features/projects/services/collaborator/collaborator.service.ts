import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Collaborator, RequestCollaboratorsProjects } from '../../models/project-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  private readonly API_URL = 'http://localhost:8080/collaborator/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getCollaboratorsByProjectId(id: string): Observable<Collaborator[]> {
    return this.httpClient.get<Collaborator[]>(this.API_URL + `public/${id}`);
  }

  getAllCollaborators(): Observable<Collaborator[]> {
    return this.httpClient.get<Collaborator[]>(this.API_URL + 'public/');
  }

  addCollaboratorToProject(collaborator: Collaborator, projectId: string): Observable<Collaborator> {
    const body = "role1"
    return this.httpClient.post<Collaborator>(this.API_URL + `${projectId}` + "/" + `${collaborator.collaboratorId}`, body);
  }
  deleteCollaboratorFromProject(collaborator: Collaborator, projectId: string): Observable<String> {
    return this.httpClient.delete<String>(this.API_URL + `${projectId}` + "/" + `${collaborator.collaboratorId}`,{ responseType: 'text' as 'json'});
  }

  addCollaboratorToRequest(requestId: string, collaboratorId: string, isRemove: boolean): Observable<Collaborator> {
    return this.httpClient.post<Collaborator>(this.API_URL + "request/" + `${requestId}` + "/" + `${collaboratorId}`, isRemove)
  }

  getChangesCollaboratorsForRequest(requestId: string): Observable<RequestCollaboratorsProjects[]> {
    return this.httpClient.get<RequestCollaboratorsProjects[]>(this.API_URL + "request/" + `${requestId}`)
  }

}
