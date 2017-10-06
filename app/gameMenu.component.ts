import { Component, OnInit } from '@angular/core';
import { Game } from './game'
import { GameService } from './game.service';


@Component({
  selector: 'my-games',
  template: `
    <ul *ngFor="let game of games">
      <a  [routerLink]="['/game', game.name]" >
        {{game.name}}
      </a>      
    </ul>
    <section *ngIf="selectedGame">
        <h2>{{selectedGame.name}}</h2>
    </section>
  `
})
export class GamesMenuComponent implements OnInit {
  games: Game[];
  selectedGame:Game;
  constructor(private gameService: GameService) {};

  getGames(): void {
    this.gameService
      .getGames()
      .then(games => this.games = games);
  }

  ngOnInit(): void {
    this.getGames();
  }

  onSelect(game: Game): void {
    this.selectedGame = game;
  }
}
