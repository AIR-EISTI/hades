import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { 

  }

  
  getGames() : Promise<Game[]>{
    return this.http.get("http://localhost:4200/api/games/")
      .toPromise()
      .then(response => response as Game[]);
  }
}
