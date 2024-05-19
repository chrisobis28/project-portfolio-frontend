import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Model } from './home.model';
import { Project } from '../../classes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, forkJoin, timeout } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectionStrategy } from '@angular/core';
import { ProjectControllerService } from '../../services/projects-controller.service';
import { unsubscribe } from 'diagnostics_channel';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})


export class HomeComponent implements OnInit { 
  title = 'project-portfolio';
  model: Model
  projects: Project[] = []
  subscription: Subscription = Subscription.EMPTY

  constructor(private projectsController: ProjectControllerService, private changeDetector: ChangeDetectorRef) {
      this.model = new Model()
  }

  ngOnInit(): void {

    
    if(!this.subscription.closed) {
      this.subscription.unsubscribe()
      console.log("unsubscribed")
    }
    console.log("a")
    this.refresh()

}

ngOnDestroy(): void {
  if (!this.subscription.closed) {
    this.subscription.unsubscribe();
  }
}


refresh(): void {


   this.subscription = this.projectsController.getAllProjectsUsingGet().subscribe({
    next: (v) => {
      console.log(v)
      this.model.initialize(v)
    },
    error: (e) => console.error(e),
    complete: () => {console.info('complete'); 
                    this.changeDetector.detectChanges()
    }
}
  )

  
}

}

 






