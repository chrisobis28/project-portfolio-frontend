import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {MediaFileContent, Media, MediaFile} from "../../models/project-models";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly API_URL = 'http://localhost:8080/media/'
  constructor(private readonly httpClient: HttpClient) { }
  getMediasContentByProjectId(projectId: string): Observable<MediaFile[]> {
    return this.httpClient.get<MediaFile[]>(this.API_URL + "images/" + `${projectId}`);
  }
  getDocumentsByProjectId(projectId: string): Observable<Media[]> {
    return this.httpClient.get<Media[]>(this.API_URL + "file/" + `${projectId}`);
  }
  getDocumentContent(mediaId: string): Observable<MediaFileContent> {
    return this.httpClient.get<MediaFileContent>(this.API_URL + "file/content/" + `${mediaId}`);
  }
}
