import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Game,ServeurLauncher } from './game';


@Injectable()
export class GameService {
  private gamesUrl = 'api/games'
  private serverUrl = 'api/servers';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { };

  //recupère tous les jeux en json
  getGames() : Promise<Game[]>{
    return this.http.get(this.gamesUrl)
      .toPromise()
      .then(response => response.json() as Game[]);
  }

  //recupère un jeu selon son nom
  getGame(name: string): Promise<Game> {
    const url = `${this.gamesUrl}/${name}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Game)
      .catch(this.handleError);
  }

  //pour afficher une erreur
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  //envoi une requete pour creer un serveur
  createServer(serveur: ServeurLauncher): Promise<any> {
    console.log( JSON.stringify({serveur:serveur}.serveur));
    return this.http
      .post(this.serverUrl, JSON.stringify({serveur:serveur}.serveur), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
}
