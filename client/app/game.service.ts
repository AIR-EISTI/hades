import { HttpClient } from '@angular/common/http';
import { Observable , of} from 'rxjs'
import { Injectable } from '@angular/core';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { 

  }

  
  getGames() : Observable<Game[]>{
    return this.http.get<Game[]>("http://localhost:4200/api/games/");
  }
}
