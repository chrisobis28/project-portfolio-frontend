import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './components/project-list/projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectAddComponent } from './components/project-add/project-add.component';
import { ProjectCardComponent } from "./components/project-card/project-card.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
    declarations: [
        ProjectsComponent,
        ProjectCardComponent
    ],
    exports: [
        ProjectsComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CardModule,
        ButtonModule,
        DividerModule,
        DataViewModule, 
        TagModule,
        DropdownModule,
        FloatLabelModule,
        BrowserModule,
        BrowserAnimationsModule,
        InputTextModule, 
        ChipsModule,
        ChipModule,
        MultiSelectModule,
        RouterModule
    ]
})
export class ProjectsModule { }
