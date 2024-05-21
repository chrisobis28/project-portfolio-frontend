import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../../interface/Classes';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = 'http://localhost:8080/project/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getAllTodolist(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.API_URL);
  }

  getTodolistById(id: number): Observable<Project> {
    return this.httpClient.get<Project>(this.API_URL + `?${id}`);
  }

  createTodolist(body: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.API_URL, body);
  }

  updateTodolist(id: number, body: Project): Observable<Project> {
    return this.httpClient.put<Project>(this.API_URL + `/${id}`, body);
  }

  deleteTodolist(id: number): Observable<Object> {
    return this.httpClient.delete<Object>(this.API_URL + `/${id}`);
  }


}