import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './todolist/projects/projects.component';
import { RequestComponent } from './components/requests/request.component';

const routes: Routes = [
  {
   title: 'Home',
   path: '',
   component: RequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }