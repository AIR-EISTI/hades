import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { GameService } from './game.service';
import { PipeTransform, Pipe } from '@angular/core';
import { Game,ServeurLauncher }        from './game';
/*import { HeroService } from './hero.service';*/






@Component({
  selector: 'my-hero-detail',
  templateUrl: './templates/game.component.html',
  /*directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],*/
  styleUrls: [ './static/css/game.component.css' ]
})
export class GameComponent implements OnInit {
  game:Game;
  keys:string[];
  com:string;
  vars:string[] = [];
  res:any;
  name:string;



  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  //initialisation de la class
  ngOnInit(): void {
    //on recupère la config du jeu passé en paramètre
    this.route.params
      .switchMap((params: Params) => this.gameService.getGame(params['name']))
      .subscribe(
        (game:Game) =>
        {
          console.log(game);
          this.game = game;
          this.keys = Object.keys(this.game['vars']);
          this.com = this.game['command'].join(" ");//on concatene tous les arguments de la commande pour l'afficher
          this.name = this.game.name;
        }
      );


  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  //envoi du formulaire
  envoi():void
  {
    let serveur:ServeurLauncher;
    let rep:any;

    serveur = new ServeurLauncher();
    serveur.game = this.name;
    serveur.vars = new Object()
    serveur.nickname = this.game.name;

    for(let varr of this.game.vars)
    {
      serveur.vars[varr.name] = varr.default;
    }

    this.gameService.createServer(serveur).then(
      res =>
      {
        this.res = res[0];
      }
    );
  }
}
