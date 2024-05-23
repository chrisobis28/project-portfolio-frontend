import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodolistModule } from './todolist/projects.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestComponent } from './components/requests/request.component';
import { RequestService } from './services/request.service';
@NgModule({
  declarations: [
    AppComponent,
    RequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    TodolistModule,
    DropdownModule,
    BrowserAnimationsModule
  ],
  providers: [RequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }