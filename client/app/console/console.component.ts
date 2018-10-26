import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, SimpleChanges, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';

import { WebSocketService } from '../services/websocket.service';
import { SocketMessage } from '../models/websocket';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: [
    './console.component.css'
  ]
})
export class ConsoleComponent implements OnInit, OnChanges {

  private consoleFeed: Observable<SocketMessage>;
  private terminal: Terminal;

  @ViewChild('terminal')
  private terminalElement: ElementRef;
  @Input()
  public pid: Number;
  private width: Number = 0;

  constructor(private webSocketService: WebSocketService) {
    this.terminal = new Terminal({
      cursorBlink: true,
      scrollback: 60,
      rows: 30
    });

    this.terminal.addDisposableListener('key', this.termKeyPressed.bind(this));
  }

  termKeyPressed(key) {
    this.webSocketService.send('term-data', key);
  }

  ngOnInit() {
    this.consoleFeed = this.webSocketService.getEventFeed('term-data');
    this.consoleFeed.subscribe((msg: SocketMessage) => {
      this.terminal.write(msg.data);
    })
    this.terminal.open(this.terminalElement.nativeElement);
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateTermSize());
  }

  ngOnDestroy() {
    this.webSocketService.send('lever-server');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.firstChange)
      return;
    this.terminal.reset();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.updateTermSize();
  }

  updateTermSize() {
    fit(this.terminal)
    let windowWidth = parseInt(window.getComputedStyle(document.body).width);
    let windowScrollWidth = document.body.scrollWidth;
    let overflow = windowScrollWidth - windowWidth;
    let termWidth = parseInt(window.getComputedStyle(this.terminalElement.nativeElement.parentElement).width);
    let newSize = termWidth - overflow;
    if (newSize !== this.width) {
      this.width = termWidth - overflow;
      setTimeout(() => {
        fit(this.terminal);
        this.webSocketService.send('term-resize', {
          cols: this.terminal.cols,
          rows: this.terminal.rows
        });
      });
    }
  }
}
