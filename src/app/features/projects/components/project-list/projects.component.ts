import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project-models';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  data: Project[] = [];
  constructor(private readonly projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
      // this.projectService.getAllProjects().subscribe((response: Project[]) => {
      //   this.data = response;
      //   console.log(response, 'res');
      // })
    }

  navigateToAddProjects(): void {
    this.router.navigate(['/add-project']);
  }

 }
