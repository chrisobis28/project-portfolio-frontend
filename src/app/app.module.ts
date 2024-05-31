import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Import this if animations are used
import { ProjectsModule } from './features/projects/projects.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ProjectsModule, HttpClientModule
    ], providers: [provideHttpClient(withInterceptorsFromDi()), AuthGuard] })
export class AppModule { }

