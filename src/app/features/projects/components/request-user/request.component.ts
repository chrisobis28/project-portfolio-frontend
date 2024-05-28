import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Request } from '../../models/project-models';
import { RequestService } from '../../services/request-service/request.service'

interface UserRequest {
  label: string;
  value: Request;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  userRequests: UserRequest[] = [];
  selectedRequest: UserRequest | null = null;
  username: string = 'paul_anton';

  constructor(private readonly requestService: RequestService) {}

  ngOnInit(): void {
    this.requestService.getRequestsForUser(this.username).subscribe({
      next: (response: Request[]) => {
        this.userRequests = response.map(req => ({
          label: req.newTitle,
          value: req
        }));
      },
      error: (error) => {
        console.error('Error fetching user requests:', error);
      }
    });
  }
}
