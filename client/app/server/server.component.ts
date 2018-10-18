import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ServerInfo } from '../models/server';
import { ServerService } from '../services/server.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {

  private pid: Number;
  private server: ServerInfo;

  constructor(private route: ActivatedRoute,
              private serverService: ServerService,
              private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.pid = Number(this.route.snapshot.paramMap.get('pid'));
    this.serverService.getServerInfo(this.pid).subscribe(
      serverInfo => this.server = serverInfo,
      error => console.log(error)
    )
    this.webSocketService.getEventFeed('server-status').subscribe(
      message => this.server = message.data
    )
  }

}
