import { Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit, ViewChildren, QueryList, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GraphComponent } from '../graph/graph.component';
import { ServerInfo } from '../models/server';
import { ServerService } from '../services/server.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  private pid: Number;
  private server: ServerInfo;
  @ViewChildren(GraphComponent) private graphs: QueryList<GraphComponent>;

  private subs: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private serverService: ServerService,
              private webSocketService: WebSocketService) { }

  ngOnInit() {
    const serverObs: Observable<ServerInfo> = this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      this.pid = Number(params.get('pid'));
      console.log('Server changed', this.pid);
      return this.serverService.getServerInfo(this.pid);
    }));

    this.subs.push(serverObs.subscribe(
      server => {
        this.server = server;
        this.updateGraphData();
      },
      error => console.log(error)
    ));

    this.subs.push(this.webSocketService.getEventFeed('server-status').subscribe(message => {
      if (this.pid === message.data.pid) {
        this.server = message.data;
      }
    }));

    this.subs.push(this.webSocketService.getEventFeed('game-stats').subscribe(msg => {
      this.server.statsHist.unshift(msg.data);
      this.server.statsHist.splice(61, 1);
      this.updateGraphData();
    }));
  }

  ngAfterViewInit() {
    this.graphs.changes.subscribe(() => setTimeout(this.updateGraphData.bind(this), 0));
  }

  ngAfterContentInit() {
    this.webSocketService.send('enter-server', this.pid);
  }

  updateGraphData() {
    this.graphs.map(child => child.updateData(this.server.statsHist));
  }

  updateGraphScale() {
    this.graphs.map(child => child.createXScale());
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    setTimeout(() => {
      this.updateGraphScale();
      this.updateGraphData();
    });
  }

  stopServer() {
    this.serverService.stopServer(this.pid).subscribe();
  }

  restartServer() {
    this.serverService.restartServer(this.pid).subscribe(result => {
      this.router.navigate(['/servers', result.pid]);
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.webSocketService.send('lever-server');
  }

  undefineServer() {
    this.serverService.undefineServer(this.pid).subscribe(
      () => {},
      error => {
        if (error.status === 201) {
          this.router.navigate(['/']);
        } else {
          console.log(error);
        }
      }
    );
  }

}
