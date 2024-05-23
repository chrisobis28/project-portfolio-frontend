import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Request } from '../../interface/Classes';
import { RequestService } from '../service/request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  data: Request[] = [];
  constructor(private readonly requestService: RequestService) {}

  ngOnInit(): void {
    this.requestService.getRequests().subscribe((response: Request[]) => {
      this.data = response;
      console.log(response, 'res');
    })
  }
}