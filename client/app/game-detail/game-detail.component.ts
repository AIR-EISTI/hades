import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../game';
import { GameService } from '../game.service';


@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  game : Game;
  gameName : string;

  constructor(private route: ActivatedRoute,public gameService: GameService) { 
  }

  ngOnInit() {
    this.getGame()

  }

  
  getGame(): void {
    this.gameName = this.route.snapshot.paramMap.get('name');
    this.gameService.getOneGame(this.gameName).subscribe(
      game => this.game = game,
      error => console.log(error)
    )
  }

}
