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
  private buffer: SocketMessage[] = [];

  constructor() {
    let protocol = location.protocol === 'https' ? 'wss' : 'ws';
    let port = location.port ? `:${location.port}` : ''
    let webSocketUrl = `${protocol}://${location.hostname}${port}/ws`
    this.webSocket = new WebSocket(webSocketUrl)
    this.webSocket.addEventListener('open', this.onOpen.bind(this))
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

  public send(event: String, data: any = null) {
    let msg: SocketMessage = {event, data}
    console.log('send')
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify(msg))
    } else {
      this.buffer.push(msg)
    }
  }

  private onOpen() {
    console.log('open')
    for (let msg of this.buffer) {
      this.webSocket.send(JSON.stringify(msg))
    }
  }
}
