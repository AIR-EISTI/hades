import { Injectable } from '@angular/core';
import {Headers,Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
//import 'rxjs/symbol/observable';

import { Server,ServerInfo } from './server';
import { SocketServerService } from './socket.service';

@Injectable()
export class ServerService {
  private serversUrl = 'api/servers';
  private killUrl = 'api/servers'  ;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, public socketService : SocketServerService) { };


  getServers() : Promise<Server[]>{
    return this.http.get(this.serversUrl)
      .toPromise()
      .then(response => response.json() as Server[]);
  }

  getServer(pid: string): Promise<ServerInfo> {
    const url = `${this.serversUrl}/${pid}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as ServerInfo)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  killServer(pid:string)
  {
    const url = `${this.killUrl}/${pid}`;
    console.log('delete:'+url);
    this.http.delete(url).toPromise().then(response => console.log(response));
  }

  cmdServer(pid:string,cmd:string)
  {
       const url = `${this.serversUrl}/${pid}/stdin`;
       this.http.post(url,JSON.stringify({command:cmd}), {headers: this.headers}).toPromise().then(response => console.log(response));

  }
}
