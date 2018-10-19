import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Game } from '../models/game';
import { GameService } from '../services/game.service';


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
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => {
        this.gameName = params.get('name')
        return this.gameService.getOneGame(this.gameName)
      })).subscribe(
        game => this.game = game,
        error => console.log(error)
      )
  }

}
