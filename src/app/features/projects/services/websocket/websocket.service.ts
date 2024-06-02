import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocket = new WebSocket("");
  private observers: Observer<string>[] = [];

  public connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      this.observers.forEach(observer => observer.next(event.data));
    };

    this.socket.onerror = (error) => {
      this.observers.forEach(observer => observer.error(error));
    };

    this.socket.onclose = () => {
      this.observers.forEach(observer => observer.complete());
    };
  }

  public onMessage(): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      this.observers.push(observer);
      return () => {
        this.observers = this.observers.filter(obs => obs !== observer);
      };
    });
  }

  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
