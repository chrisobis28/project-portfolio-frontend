import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { StorageService } from '../../services/authentication/storage.service';
import { NgIf } from '@angular/common';
import { LoginUserRequest, RegisterUserRequest } from '../../models/accounts-models';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-login-menu',
  standalone: true,
  imports: [InputTextModule, 
    FormsModule, 
    NgIf, 
    ReactiveFormsModule, 
    ToastModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule],
  templateUrl: './login-menu.component.html',
  styleUrl: './login-menu.component.css',
  providers: [MessageService, ConfirmationService]
})

export class LoginMenuComponent implements OnInit {

  loginUserRequest: LoginUserRequest = {
    username: null,
    password: null
  }
  registerUserRequest: RegisterUserRequest = {
    username: null,
    password: null,
    name: null
  }

  usernameL = new FormControl('', [
    Validators.required, 
    Validators.pattern('^[a-zA-Z0-9]{5,20}$')]);
  passwordL = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/)
  ]);

  usernameR = new FormControl('', [
    Validators.required, 
    Validators.pattern('^[a-zA-Z0-9]{5,20}$')]);
  passwordR = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/)
  ]);
  nameR = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z_]{1,50}$')
  ]);

  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});

  isLoggedIn = false;
  isSignUpFailed = false;
  isLogInFailed = false;
  errorMessage = '';

  isUsernameFocusedLogin = false;
  isPasswordFocusedLogin = false;
  isUsernameFocusedRegister = false;
  isPasswordFocusedRegister = false;
  isNameFocusedRegister = false;

  messages1: Message[] = [];

  constructor(private fb: FormBuilder, 
    private storageService: StorageService, 
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    if(this.storageService.dateExpired()) {
      this.storageService.clean();
      this.isLoggedIn = false;
    }
    else if(this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
    this.loginForm = this.fb.group({
      username: this.usernameL,
      password: this.passwordL
    });
    this.registerForm = this.fb.group({
      username: this.usernameR,
      password: this.passwordR,
      name: this.nameR
    });
  }

  login() {
    this.authenticationService.login(this.loginUserRequest).subscribe({
      next: date => {

        if(date && this.loginUserRequest.username) {
          this.storageService.saveDate(date);
          this.storageService.saveUser(this.loginUserRequest.username);
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong when logging in.' });
          return;
        }

        this.isLoggedIn = true;
        this.isLogInFailed = false;
        this.loginForm.reset();
        
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Log in successfully completed.' });
        return;
      },
      error: err => {
        if(err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username or password are incorrect.' });
          return;
        }
        else if(err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Already logged in.' });
          return;
        }
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  register() {

    this.authenticationService.register(this.registerUserRequest).subscribe({
      next: () => {
        this.registerForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successfully completed.' });
        return;
      },
      error: (err) => {
        if(err.status === 409) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username already exists.' });
          return;
        }
        else if(err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Credentials are not correctly chosen.' });
          return;
        }
      }
    })
  }

  logout() {
    this.confirmationService.confirm({
      message: "Are you sure you want to log out of the account " + this.storageService.getUser() + "?",
      accept: () => {
        this.authenticationService.logout().subscribe({
          next: () => {
            this.isLoggedIn = false;
            this.storageService.clean();
            this.loginForm.reset();
    
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully.' });
          },
          error: err => {
            alert(err.errorMessage);
            this.loginForm.reset();
          }
        })
      }
    })
  }
}
