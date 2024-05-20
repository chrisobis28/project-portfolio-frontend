import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Model } from './home.model';
import { Project } from '../../classes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, forkJoin, map, of, switchMap, takeUntil, tap, timeout } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectionStrategy } from '@angular/core';
import { ProjectControllerService } from '../../services/projects-controller.service';
import { unsubscribe } from 'diagnostics_channel';
import { NONE_TYPE } from '@angular/compiler';
import { time } from 'console';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy { 
  title = 'project-portfolio';
  model: Model = new Model()
  projects: Project[]= []
  subscription: Subscription = Subscription.EMPTY
  projects$ : Observable<Project[]> = new Observable<Project[]>()
  found: boolean = true
  private destroy$ = new Subject<void>(); 

  constructor(private projectsController: ProjectControllerService) {
      this.model = new Model()
  }

  ngOnInit(): void {
    console.log("init called")
    this.projectsController.getAllProjectsUsingGet()
    .pipe(
      takeUntil(this.destroy$), // Unsubscribe on component destruction
    ).subscribe(data => {this.projects = data})

    console.log(this.projects)
    //this.model.initialize(this.projects$)

    console.log("init ended")
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete(); 
    console.log("unsubscribed")
  }


// loadProjects(): void {
//   console.log("refresh called")
//   this.projectsController.getAllProjectsUsingGet()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (projects) => {
//           this.model.initialize(projects);    
//         },
//         error: (error) => console.error(error),
//         complete: () => {
//         }
//       });

// }

}

 






