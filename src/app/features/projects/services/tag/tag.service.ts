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

  getColorCode(color: string): string {
    switch(color) {
      case "red":
        return "rgba(255, 93, 70, 0.45)"
      case "green":
        return "rgba(10, 118, 77, 0.45)"
      case "blue":
        return "rgba(10, 118, 255, 0.45)"
      case "yellow":
        return "rgba(255, 255, 0, 0.45)"
      case "orange":
        return "rgba(255, 190, 61, 0.45)"
      case "purple":
        return "rgba(106, 0, 255, 0.45)"
      case "black":
        return "rgba(0, 0, 0, 0.45)"
      default:
        return "rgba(111, 118, 133, 0.45)"
    }
  }


  addTagToRequest(requestId: string, tagId: string, isRemove: boolean): Observable<Tag> {
    return this.httpClient.post<Tag>(this.API_URL + "request/" + `${requestId}` + "/" + `${tagId}`, isRemove)
  }
}
