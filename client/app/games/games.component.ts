import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { GameService } from '../services/game.service';



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
    this.gameService.getGames().subscribe(
      games => this.games = games,
      error => console.log(error)
    )
  }

}
