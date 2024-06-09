import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectsModule } from './features/projects/projects.module';
import { authInterceptorProviders } from './core/auth.interceptor';
@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ProjectsModule,
    HttpClientModule], 
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        authInterceptorProviders
      ]})
export class AppModule { }

