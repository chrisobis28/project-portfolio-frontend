import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import { RequestComponent } from './requests/request.component';



@NgModule({
  declarations: [
    ProjectsComponent,
    RequestComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TodolistModule { }
