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
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COOKIE_DATE);
    localStorage.removeItem(ROLE);
  }

  public saveUser(username: string): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, username);
  }

  public saveDate(date: string): void {
    localStorage.removeItem(COOKIE_DATE);
    localStorage.setItem(COOKIE_DATE, date);
  }

  public saveRole(role: string): void {
    localStorage.removeItem(ROLE);
    localStorage.setItem(ROLE, role);
  }

  public getUser(): string {
    const username = localStorage.getItem(USER_KEY);
    if (username) {
      return username;
    }
    return '';
  }

  public getDate(): string | null {
    const expirationDate = localStorage.getItem(COOKIE_DATE);
    if (expirationDate) {
      return expirationDate;
    }
    return null;
  }

  public getRole(): string | null {
    const role = localStorage.getItem(ROLE);
    if (role) {
      return role;
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const username = localStorage.getItem(USER_KEY);
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
