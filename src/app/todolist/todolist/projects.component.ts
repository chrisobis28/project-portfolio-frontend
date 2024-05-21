import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Todolist } from '../interface/Classes';
import { TodolistService } from '../service/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  data: Todolist[] = [];
  constructor(private readonly todolistService: TodolistService) {}

  ngOnInit(): void {
      this.todolistService.getAllTodolist().subscribe((response: Todolist[]) => {
        this.data = response;
        console.log(response, 'res');
      })
    }

 }
