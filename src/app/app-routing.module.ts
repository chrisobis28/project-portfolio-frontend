import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './features/projects/components/project-list/projects.component';
import { ProjectAddComponent } from './features/projects/components/project-add/project-add.component';

const routes: Routes = [
  { path: 'projects', component: ProjectsComponent },
  { path: 'add-project', component: ProjectAddComponent },
  { path: '', redirectTo: '/projects', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }