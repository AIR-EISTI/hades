import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GameList, Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) {

  }

  getGames(): Observable<GameList> {
    return this.http.get<GameList>('/api/games');
  }

  getGame(gameName): Observable<Game> {
    return this.http.get<Game>(`/api/games/${gameName}`);
  }
}
