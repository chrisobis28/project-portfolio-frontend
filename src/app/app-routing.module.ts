import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './features/projects/components/project-list/projects.component';
import { ProjectAddComponent } from './features/projects/components/project-add/project-add.component';
import {ProjectDetailComponent} from "./features/projects/components/project-detail/project-detail.component";
import { ProjectCardComponent } from './features/projects/components/project-card/project-card.component';
import { ProjectEditComponent } from './features/projects/components/project-edit/project-edit.component';
import { RegisterComponent } from './features/projects/components/register/register.component';
import { LoginComponent } from './features/projects/components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'add-project', component: ProjectAddComponent , canActivate: [AuthGuard] },
  { path: 'project-card', component: ProjectCardComponent},
  { path: 'project-detail/:id', component: ProjectDetailComponent },
  { path: 'project/edit/:id', component: ProjectEditComponent , canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/projects', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
