import { HttpClient, HttpContext, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Project } from "../classes";
import { Observable, catchError, filter, map, timeout } from "rxjs";

@Injectable({
    providedIn: 'root',
})



export class ProjectControllerService {

    constructor(private http: HttpClient) {

    }

    rootUrl: string = "http://localhost:8080"
    getAllProjectsEndpoint: string = "/project/"

    getAllProjectsUsingGet() {
        
        return this.http.get<Project[]>(this.rootUrl + this.getAllProjectsEndpoint)
    }
}