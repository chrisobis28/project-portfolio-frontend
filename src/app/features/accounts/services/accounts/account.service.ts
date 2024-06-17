import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Account, Project } from 'src/app/features/projects/models/project-models';

const API_URL = 'http://localhost:8080/account';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

const httpOptionsGet = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'text' as 'json'
  };

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private readonly httpClient: HttpClient) { }

  editAccount(username: string, name: string, password: string, role: string) {
    const body = {
        username: username,
        name: name,
        password: password,
        role: role
    };
    return this.httpClient.put<Observable<any>>(API_URL, body, httpOptions);
  }

  getAccount(username: string): Observable<Account> {
    const url = API_URL + `/public/${username}`;
    return this.httpClient.get<Account>(url, httpOptions);
  }

  deleteAccount(username: string): Observable<any> {
    const url = API_URL + `/${username}`;
    return this.httpClient.post<Observable<any>>(url, httpOptions);
  }

  addRoleOnProject(username: string, projectId: string, roleInProject: string): Observable<any> {
    const url = API_URL + `/${username}/${projectId}`;
    const body = { roleInProject };
    return this.httpClient.post<Observable<any>>(url, body, httpOptions);
  }

  deleteRoleOnProject(username: string, projectId: string): Observable<any> {
    const url = API_URL + `/${username}/${projectId}`;
    return this.httpClient.delete<Observable<any>>(url, httpOptionsGet);
  }

  updateRoleOnProject(username: string, projectId: string, roleInProject: string): Observable<any> {
    const url = API_URL + `/${username}/${projectId}`;
    const body = { roleInProject };
    return this.httpClient.put<Observable<any>>(url, body, httpOptions);
  }

  getRoleOnProject(username: string, projectId: string): Observable<string> {
    const url = API_URL + `/public/role/${username}/${projectId}`;
    return this.httpClient.get<string>(url, httpOptionsGet);
  }

  getProjectsManagedByAccount(username: string): Observable<Project[]> {
    return this.httpClient.get<Project[]>(API_URL + "/public/managed/" + `${username}`)
  }

}