import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SocketMessage } from '../models/WebSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private webSocket: WebSocket;
  private eventFeed: Observable<SocketMessage>;

  constructor() {
    let protocol = location.protocol === 'https' ? 'wss' : 'ws';
    let port = location.port ? `:${location.port}` : ''
    let webSocketUrl = `${protocol}://${location.hostname}${port}/ws`
    this.webSocket = new WebSocket(webSocketUrl)
    this.eventFeed = this.createEventFeed()
  }

  private createEventFeed():Observable<SocketMessage> {
    return Observable.create((observer: Observer<SocketMessage>) => {
      this.webSocket.addEventListener('message', (event) => {
        observer.next(JSON.parse(event.data))
      })
    })
  }

  public getEventFeed(eventName: String):Observable<SocketMessage> {
    return this.eventFeed.pipe(filter(msg => msg.event === eventName))
  }
}
