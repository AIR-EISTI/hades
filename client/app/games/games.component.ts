import { Component, OnInit } from '@angular/core';
import { GameList } from '../models/game';
import { GameService } from '../services/game.service';
import { WebSocketService } from '../services/websocket.service';


@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  games : GameList;

  constructor(public gameService: GameService, public webSocketService: WebSocketService) { }

  ngOnInit() {
    this.getGames()
    this.webSocketService.getEventFeed('game-loaded').subscribe(
      msg => this.games[msg.data.name] = msg.data
    )
    this.webSocketService.getEventFeed('game-deleted').subscribe(
      msg => delete this.games[msg.data]
    )
  }


  getGames(): void {
    this.gameService.getGames().subscribe(
      games => this.games = games,
      error => console.log(error)
    )
  }

}
