import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    let serverObs: Observable<ServerInfo> = this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      this.pid = Number(params.get('pid'));
      return this.serverService.getServerInfo(this.pid)
    }))

    serverObs.subscribe(
      server => this.server = server,
      error => console.log(error)
    )

    this.webSocketService.getEventFeed('server-status').subscribe(
      message => this.server = message.data
    )
  }

}
