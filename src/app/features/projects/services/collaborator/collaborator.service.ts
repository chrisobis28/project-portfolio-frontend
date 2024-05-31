import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Collaborator } from '../../models/project-models';
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
    return this.httpClient.get<Collaborator[]>(this.API_URL + `${id}`);
  }

  getAllCollaborators(): Observable<Collaborator[]> {
    return this.httpClient.get<Collaborator[]>(this.API_URL)
  }

  addCollaboratorToProject(collaborator: Collaborator, projectId: string): Observable<Collaborator> {
    const body = "role1"
    return this.httpClient.post<Collaborator>(this.API_URL + `${projectId}` + "/" + `${collaborator.collaboratorId}`, body);
  }

}
