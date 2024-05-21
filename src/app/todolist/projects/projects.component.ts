import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../interface/Classes';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  data: Project[] = [];
  constructor(private readonly projectService: ProjectService) {}

  ngOnInit(): void {
      this.projectService.getAllTodolist().subscribe((response: Project[]) => {
        this.data = response;
        console.log(response, 'res');
      })
    }

 }
