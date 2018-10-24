import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Game } from '../models/game';
import { ServerForm } from '../models/server';
import { GameService } from '../services/game.service';
import { ServerService } from '../services/server.service';


@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  game : Game;
  gameName : string;
  value: string;
  private form: ServerForm = new ServerForm();

  constructor(private route: ActivatedRoute, public router: Router, public gameService: GameService, public serverService: ServerService) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => {
        this.gameName = params.get('name')
        return this.gameService.getGame(this.gameName)
      })).subscribe(
        game => {
          this.game = game
          this.form.vars = {}
          this.form.nickname = `Serveur ${this.game.name}`
          this.form.game = this.game.name
          for (let variable of this.game.vars) {
            this.form.vars[variable.name] = variable.default
          }
        },
        error => console.log(error)
      )
  }

  createGame() {
    this.serverService.createServer(this.form).subscribe(
      result => this.router.navigate(['/servers', result.pid])
    )
  }

}
