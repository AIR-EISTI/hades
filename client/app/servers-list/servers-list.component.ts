import { Component, OnInit } from '@angular/core';
import { ServerList } from '../models/server';
import { ServerService } from '../services/server.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-servers-list',
  templateUrl: './servers-list.component.html',
  styleUrls: ['./servers-list.component.css']
})
export class ServersListComponent implements OnInit {

  private servers: ServerList;

  constructor(private serverService: ServerService,
              private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.serverService.getServersList().subscribe(
      servers => this.servers = servers,
      error => console.log(error)
    )

    this.webSocketService.getEventFeed('server-status').subscribe(
      msg => this.servers[msg.data.pid] = msg.data
    )
  }

}
