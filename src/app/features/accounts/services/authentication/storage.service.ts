import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const COOKIE_DATE = 'auth-date';
const ROLE = 'auth-role';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(COOKIE_DATE);
    window.sessionStorage.removeItem(ROLE);
  }

  public saveUser(username: string): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, username);
  }

  public saveDate(date: string): void {
    window.sessionStorage.removeItem(COOKIE_DATE);
    window.sessionStorage.setItem(COOKIE_DATE, date);
  }

  public saveRole(role: string): void {
    window.sessionStorage.removeItem(ROLE);
    window.sessionStorage.setItem(ROLE, role);
  }

  public getUser(): string {
    const username = window.sessionStorage.getItem(USER_KEY);
    if (username) {
      return username;
    }
    return '';
  }

  public getDate(): string | null {
    const expirationDate = window.sessionStorage.getItem(COOKIE_DATE);
    if (expirationDate) {
      return expirationDate;
    }
    return null;
  }

  public getRole(): string | null {
    const role = window.sessionStorage.getItem(ROLE);
    if (role) {
      return role;
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const username = window.sessionStorage.getItem(USER_KEY);
    if (username && !this.dateExpired()) {
      return true;
    }
    this.clean();
    return false;
  }

  public parseDate(date: string): Date {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const parts = date.split(" ");
    const month = months.indexOf(parts[1]);
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[5], 10);
    const timeParts = parts[3].split(":");
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const second = parseInt(timeParts[2], 10);

    return new Date(year, month, day, hour, minute, second);
  }

  public dateExpired(): boolean {
    const cookieDate = this.getDate();

    if(cookieDate) {

      const parsedDate = this.parseDate(cookieDate);

      return parsedDate.getTime() < new Date().getTime();
    }
    return false;
  }
}
