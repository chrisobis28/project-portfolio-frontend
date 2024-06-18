import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Collaborator } from '../../models/project-models';
import { CollaboratorTransfer } from '../../models/project-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  private readonly HOST ='http://localhost:8080'
  private readonly API_URL = this.HOST+'/collaborator/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getCollaboratorsByProjectId(id: string): Observable<CollaboratorTransfer[]> {
    return this.httpClient.get<CollaboratorTransfer[]>(this.API_URL + `public/${id}`);
  }

  getAllCollaborators(): Observable<Collaborator[]> {
    return this.httpClient.get<Collaborator[]>(this.API_URL + 'public/');
  }

  addCollaboratorToProject(collaborator: Collaborator, projectId: string): Observable<Collaborator> {
    const body = "role1"
    return this.httpClient.post<Collaborator>(this.API_URL + `${projectId}` + "/" + `${collaborator.collaboratorId}`, body);
  }
  deleteCollaboratorFromProject(projectId: string, collaboratorId: string): Observable<String> {
    return this.httpClient.delete<String>(this.API_URL + `${projectId}` + "/" + `${collaboratorId}`,{ responseType: 'text' as 'json'});
  }

  createAndAddCollaboratorToProject(collaborator: CollaboratorTransfer, projectId: string): Observable<CollaboratorTransfer> {
    return this.httpClient.post<CollaboratorTransfer>(this.API_URL + `${projectId}`, collaborator);
  }

}
