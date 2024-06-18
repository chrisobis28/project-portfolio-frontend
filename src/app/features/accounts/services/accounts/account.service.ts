import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { AccountTransfer, ProjectTransfer, Account } from '../../models/accounts-models';

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
    return this.httpClient.put<Observable<Account>>(API_URL, body, httpOptions);
  }

  editRoleOfAccount(accountTransfer: AccountTransfer): Observable<void> {
    const body = {
      username: accountTransfer.username,
      isPM: accountTransfer.pm,
      isAdmin: accountTransfer.admin
  };
    return this.httpClient.put<void>(API_URL + '/editRole', body, httpOptions);
  }

  getAccount(username: string): Observable<Account> {
    const url = API_URL + `/public/${username}`;
    return this.httpClient.get<Account>(url, httpOptions);
  }

  deleteAccount(username: string): Observable<void> {
    const url = API_URL + `/${username}`;
    return this.httpClient.post<void>(url, httpOptions);
  }

  addRoleOnProject(username: string, projectId: string, roleInProject: string): Observable<void> {
    const url = API_URL + `/${username}/${projectId}`;
    const body = { role: roleInProject };
    return this.httpClient.post<void>(url, body, httpOptions);
  }

  deleteRoleOnProject(username: string, projectId: string): Observable<void> {
    const url = API_URL + `/${username}/${projectId}`;
    return this.httpClient.delete<void>(url, httpOptionsGet);
  }

  updateRoleOnProject(username: string, projectId: string, roleInProject: string): Observable<void> {
    const url = API_URL + `/${username}/${projectId}`;
    return this.httpClient.put<void>(url, '"' + roleInProject + '"', httpOptions);
  }

  getRoleOnProject(username: string, projectId: string): Observable<string> {
    const url = API_URL + `/public/role/${username}/${projectId}`;
    return this.httpClient.get<string>(url, httpOptionsGet);
  }

  getAccounts(): Observable<AccountTransfer[]> {
    return this.httpClient.get<AccountTransfer[]>(API_URL, httpOptions);
  }

  getProjects(username: string): Observable<ProjectTransfer[]> {
    const url = API_URL + `/role/${username}`;
    return this.httpClient.get<ProjectTransfer[]>(url, httpOptions);
  }

}