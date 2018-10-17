import { Component, OnInit } from '@angular/core';
import { Game } from '../game';
import { GameService } from '../game.service';
import { TestServiceService } from '../test-service.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  games : Game[];

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.getGames()
  }

  
  getGames(): void {
    this.gameService
      .getGames()
      .then(games => this.games = games);
  }
  
}
