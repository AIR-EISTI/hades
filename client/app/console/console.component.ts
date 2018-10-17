import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { WebSocketService } from '../services/websocket.service';
import { SocketMessage } from '../models/WebSocket';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  private consoleFeed: Observable<SocketMessage>;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.consoleFeed = this.webSocketService.getEventFeed('term-data')
    this.consoleFeed.subscribe((msg: SocketMessage) => {
      console.log(msg)
    })
  }

}
