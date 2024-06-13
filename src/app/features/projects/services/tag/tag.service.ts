import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../../models/project-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private readonly API_URL = 'http://localhost:8080/tag/';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getTagsByProjectId(id: string): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(this.API_URL + `public/${id}`);
  }

  getAllTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(this.API_URL + 'public/');
  }

  addTagToProject(tag: Tag, projectId: string): Observable<Tag> {
    return this.httpClient.post<Tag>(this.API_URL+ `${projectId}` + "/" + `${tag.tagId}`, "")
  }

  addTagToRequest(requestId: string, tagId: string, isRemove: boolean): Observable<Tag> {
    return this.httpClient.post<Tag>(this.API_URL + "request/" + `${requestId}` + "/" + `${tagId}`, isRemove)
  }
}
