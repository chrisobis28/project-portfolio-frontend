import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/authentication';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  register(username: string, name: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/register`;
    const body = { username, name, password };
    return this.http.post(url, body);
  }

  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.http.post(url, { username, password }, { responseType: 'text' })
      .pipe(
        tap((token: string) => {
          this.cookieService.setCookie('token', token, 1);
          this.cookieService.setCookie('username', username, 1);
        })
      );
  }

  setToken(token: string) {
    this.cookieService.setCookie('token', token, 1);
  }

  getToken(): string | null {
    return this.cookieService.getCookie('token');
  }

  logout() {
    this.cookieService.deleteCookie('token');
    this.cookieService.deleteCookie('username');
  }
}
