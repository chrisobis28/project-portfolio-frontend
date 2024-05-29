import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Link} from "../../models/project-models";

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private readonly API_URL = 'http://localhost:8080/link/'
  constructor(private readonly httpClient: HttpClient) { }

  getLinksByProjectId(id: string): Observable<Link[]> {
    return this.httpClient.get<Link[]>(this.API_URL + `${id}`);
  }
}
