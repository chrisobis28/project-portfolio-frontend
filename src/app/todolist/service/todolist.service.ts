import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { Todolist } from '../interface/todolist';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  private readonly API_URL = 'http://localhost:8080/project/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getAllTodolist(): Observable<Todolist[]> {
    return this.httpClient.get<Todolist[]>(this.API_URL);
  }

  getTodolistById(id: number): Observable<Todolist> {
    return this.httpClient.get<Todolist>(this.API_URL + `?${id}`);
  }

  createTodolist(body: Todolist): Observable<Todolist> {
    return this.httpClient.post<Todolist>(this.API_URL, body);
  }

  updateTodolist(id: number, body: Todolist): Observable<Todolist> {
    return this.httpClient.put<Todolist>(this.API_URL + `/${id}`, body);
  }

  deleteTodolist(id: number): Observable<Object> {
    return this.httpClient.delete<Object>(this.API_URL + `/${id}`);
  }


}