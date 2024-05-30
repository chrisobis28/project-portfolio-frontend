import { Component } from '@angular/core';
import { AuthService } from '../../services/session/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
//   styleUrls: ['register.component.css']
})
export class RegisterComponent {
  username: string = '';
  name: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  register() {
    this.authService.register(this.username, this.name, this.password).subscribe(response => {
      console.log('Registration successful', response);
      // Optionally, redirect to login or another page
    }, error => {
      console.error('Registration failed', error);
    });
  }
}
