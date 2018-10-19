import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) {

  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>('/api/games');
  }

  getGame(gameName): Observable<Game> {
    return this.http.get<Game>(`/api/games/${gameName}`);
  }
}
