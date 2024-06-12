import { Injectable } from '@angular/core';
import {Observable, map} from "rxjs";
import {MediaFileContent, Media, Link} from "../../models/project-models";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly API_URL = 'http://localhost:8080/media/'
  constructor(private readonly httpClient: HttpClient) { }
  getMediasContentByProjectId(projectId: string): Observable<MediaFileContent[]> {
    return this.httpClient.get<MediaFileContent[]>(this.API_URL + "public/images/" + `${projectId}`);
  }
  getDocumentsByProjectId(projectId: string): Observable<Media[]> {
    return this.httpClient.get<Media[]>(this.API_URL + "public/file/" + `${projectId}`);
  }
  getDocumentContent(mediaId: string): Observable<MediaFileContent> {
    return this.httpClient.get<MediaFileContent>(this.API_URL + "public/file/content/" + `${mediaId}`);
  }
  addDocumentToProject(projectId:string,document:FormData){
    return this.httpClient.post<Media>(this.API_URL + `${projectId}`, document)
  }
  deleteMedia(projectId:string,mediaId:string): Observable<string> {
    return this.httpClient.delete<string>(this.API_URL +`${projectId}`+'/'+`${mediaId}`, { responseType: 'text' as 'json'});
  }
  downloadFile(media: MediaFileContent) {
    const mimeType = 'application/octet-stream'
    const byteArray = new Uint8Array(atob(media.fileContent).split('').map(char => char.charCodeAt(0)));
    const file = new Blob([byteArray], {type: mimeType});
    const fileUrl = URL.createObjectURL(file);
    let link = document.createElement("a");
    link.download = media.filePath;
    link.href = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  }
}
