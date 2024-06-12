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
  createTag(tag: Tag): Observable<Tag> {
    return this.httpClient.post<Tag>(this.API_URL+ 'create', tag)
  }
  addTagToProject(tag: Tag, projectId: string): Observable<Tag> {
    return this.httpClient.post<Tag>(this.API_URL+ `${projectId}` + "/" + `${tag.tagId}`, "")
  }
  removeTagFromProject(tag: Tag,projectId:string): Observable<String> {
    return this.httpClient.delete<string>(this.API_URL+ `${projectId}` + "/" + `${tag.tagId}`)
  }

}
