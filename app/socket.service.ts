import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import * as io from "socket.io-client";

@Injectable()
export class SocketService{
  private name: string;
  private url: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

  socket: SocketIOClient.Socket;

  constructor(name: string){
    this.name = name;
    let socketURL =   this.url + '/' + this.name;
    this.socket = io.connect(socketURL);
    this.socket.on('connect', () => {
      console.log(`Connected to "${this.name}"`);
    });
    this.socket.on('disconnect', () => {
      console.log(`Disconnected from "${this.name}"`);
    });
    this.socket.on('error', (error: string) => {
      console.log(`Socket error, "${this.url}/${this.name}" : ${error}`);
    });
  }
}

@Injectable()
export class SocketServerService extends SocketService{
  constructor(){
    super('servers');
  }

  getSocket(): Observable<any>{
    return Observable.create((observer: any) => {
      this.socket.on('list', (data: any) => observer.next({action: 'list', data: data}));
      this.socket.on('console', (data: any) => observer.next({action: 'console', data: data}));
      this.socket.on('update-status', (data: any) => observer.next({action: 'update-status', data: data}));
    })
  }
}
