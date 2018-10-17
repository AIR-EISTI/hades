import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Terminal } from 'xterm';

import { WebSocketService } from '../services/websocket.service';
import { SocketMessage } from '../models/WebSocket';


@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: [
    './console.component.css'
  ]
})
export class ConsoleComponent implements OnInit {

  private consoleFeed: Observable<SocketMessage>;
  private terminal: Terminal;

  @ViewChild('terminal')
  private terminalElement: ElementRef;
  @Input()
  public pid: Number;

  constructor(private webSocketService: WebSocketService) {
    this.terminal = new Terminal({
      cursorBlink: true,
      scrollback: 60,
      rows: 80
    })

    this.terminal.addDisposableListener('key', this.termKeyPressed.bind(this))
  }

  termKeyPressed(key) {
    this.webSocketService.send('term-data', key)
  }

  ngOnInit() {
    console.log(this.webSocketService)
    this.webSocketService.send('enter-server', this.pid)
    this.consoleFeed = this.webSocketService.getEventFeed('term-data')
    this.consoleFeed.subscribe((msg: SocketMessage) => {
      this.terminal.write(msg.data)
    })
    this.terminal.open(this.terminalElement.nativeElement)
  }

  ngOnDestroy() {
    this.webSocketService.send('lever-server')
  }
}
