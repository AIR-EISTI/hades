import { Component, OnInit } from '@angular/core';
import { Server } from './server';
import { ServerService } from './server.service';


@Component({
  selector: 'my-servers',
  template: `
    <ul>
      <li *ngFor="let server of servers"  class="{{server.status | lowercase}}">
        <a [routerLink]="['/server', server.pid]">{{server.name}}#{{server.pid}}</a>
      </li>
    </ul>
  `
})
export class ServersComponent implements OnInit {
  servers: Server[];

  constructor(private serverService : ServerService) { };

  setServer(): void{
    this.serverService
      .getServers()
      .then(servers => this.servers = servers);
  }

  ngOnInit(): void {
    this.setServer();
    this.serverService.socketService.getSocket().subscribe((message: any) => {
      if(message.action === 'list'){
        this.servers = message.data;
      }
    });
  }
}
