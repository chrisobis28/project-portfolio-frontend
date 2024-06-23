import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Template, TemplateAddition } from '../../models/project-models';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private readonly API_URL = 'http://localhost:8080/template';

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getTemplates(): Observable<Template[]> {
    return this.httpClient.get<Template[]>(this.API_URL);
  }

  createTemplate(body: Template): Observable<Template> {
    return this.httpClient.post<Template>(this.API_URL, body);
  }

  addTemplateAddition(name: string, body: TemplateAddition): Observable<TemplateAddition> {
    return this.httpClient.post<TemplateAddition>(this.API_URL + `/${name}`, body)
  }
}
