import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from '../models/project-models';


@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly API_URL = 'http://localhost:8080/media/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getMediaByProjectId(id: string): Observable<Media[]> {
    return this.httpClient.get<Media[]>(this.API_URL + `?${id}`);
  }

  addMediaToProject(id: number, body: Media): Observable<Media> {
    return this.httpClient.post<Media>(this.API_URL + `/${id}`, body);
  }

  deleteMedia(id: string): Observable<Media> {
    return this.httpClient.delete<Media>(this.API_URL + `/${id}`);
  }

}