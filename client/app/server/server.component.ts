import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

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
              private router: Router,
              private serverService: ServerService,
              private webSocketService: WebSocketService) { }

  ngOnInit() {
    let serverObs: Observable<ServerInfo> = this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      this.pid = Number(params.get('pid'));
      console.log('Server changed', this.pid)
      return this.serverService.getServerInfo(this.pid)
    }))

    serverObs.subscribe(
      server => this.server = server,
      error => console.log(error)
    )

    this.webSocketService.getEventFeed('server-status').subscribe(
      message => {
        if (this.pid === message.data.pid)
          this.server = message.data
      }
    )
  }

  stopServer () {
    this.serverService.stopServer(this.pid).subscribe()
  }

  restartServer () {
    this.serverService.restartServer(this.pid).subscribe(
      result => {
        this.router.navigate(['/servers', result.pid])
      }
    )
  }

  undefineServer () {
    this.serverService.undefineServer(this.pid).subscribe(
      () => {},
      error => {
        if (error.status === 201)
          this.router.navigate(['/'])
        else
          console.log(error)
      }
    )
  }

}
