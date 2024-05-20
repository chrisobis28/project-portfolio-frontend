import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Todolist } from '../interface/todolist';
import { TodolistService } from '../service/todolist.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  data: Todolist[] = [];
  constructor(private readonly todolistService: TodolistService) {}

  ngOnInit(): void {
      this.todolistService.getAllTodolist().subscribe((response: Todolist[]) => {
        this.data = response;
        console.log(response, 'res');
      })
    }

 }
