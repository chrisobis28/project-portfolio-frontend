import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './components/project-list/projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectAddComponent } from './components/project-add/project-add.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectAddComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ProjectAddComponent,
    ProjectsComponent
  ]
})
export class ProjectsModule { }