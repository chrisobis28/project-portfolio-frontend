import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { LoginUserRequest, RegisterUserRequest } from '../../models/accounts-models';

const AUTH_API = 'http://localhost:8080/authentication';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private readonly httpClient: HttpClient) { }

  register(registerUserRequest: RegisterUserRequest): Observable<any> {
    const url = AUTH_API + '/register';
    return this.httpClient.post(url, registerUserRequest, { responseType: 'text' });
  }

  login(loginUserRequest: LoginUserRequest): Observable<any> {
    const url = AUTH_API + '/login';
    return this.httpClient.post(url, loginUserRequest, { responseType: 'text' });
  }


  logout(): Observable<any> {
    const url = AUTH_API + '/logout';
    
    return this.httpClient.post(url, {}, { responseType: 'text' });
  }

}