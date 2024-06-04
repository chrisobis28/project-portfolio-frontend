import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        
    ],
    exports: [
        
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
        MessagesModule,
        RouterModule,
        ReactiveFormsModule
    ]
})
export class AccountsModule { }
