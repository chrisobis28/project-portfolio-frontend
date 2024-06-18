import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Project } from 'src/app/features/projects/models/project-models';
import { AccountTransfer, ProjectTransfer } from '../../models/accounts-models';

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

  editRoleOfAccount(accountTransfer: AccountTransfer): Observable<any> {
    const body = {
      username: accountTransfer.username,
      isPM: accountTransfer.pm,
      isAdmin: accountTransfer.admin
  };
    return this.httpClient.put<Observable<any>>(API_URL + '/editRole', body, httpOptions);
  }

  getAccount(username: string): Observable<any> {
    const url = API_URL + `/public/${username}`;
    return this.httpClient.get<Observable<any>>(url, httpOptions);
  }

  deleteAccount(username: string): Observable<any> {
    const url = API_URL + `/${username}`;
    return this.httpClient.post<Observable<any>>(url, httpOptions);
  }

  addRoleOnProject(username: string, projectId: string, roleInProject: string): Observable<any> {
    const url = API_URL + `/${username}/${projectId}`;
    const body = { role: roleInProject };
    return this.httpClient.post<Observable<any>>(url, body, httpOptions);
  }

  deleteRoleOnProject(username: string, projectId: string): Observable<any> {
    const url = API_URL + `/${username}/${projectId}`;
    return this.httpClient.delete<Observable<any>>(url, httpOptionsGet);
  }

  updateRoleOnProject(username: string, projectId: string, roleInProject: string): Observable<any> {
    const url = API_URL + `/${username}/${projectId}`;
    return this.httpClient.put<Observable<any>>(url, '"' + roleInProject + '"', httpOptions);
  }

  getRoleOnProject(username: string, projectId: string): Observable<string> {
    const url = API_URL + `/public/role/${username}/${projectId}`;
    return this.httpClient.get<string>(url, httpOptionsGet);
  }

  getAccounts(): Observable<any> {
    return this.httpClient.get<Observable<any>>(API_URL, httpOptions);
  }

  getProjects(username: string): Observable<ProjectTransfer[]> {
    const url = API_URL + `/role/${username}`;
    return this.httpClient.get<ProjectTransfer[]>(url, httpOptions);
  }

}