import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games/games.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { ServerComponent } from './server/server.component';

const routes: Routes = [
<<<<<<< HEAD
  {path: "games", component: GamesComponent},
  {path: "games/:name", component: GameDetailComponent},
  {path: "console", component: ConsoleComponent}
=======
  {path: 'games', component: GamesComponent},
  {path: 'game/:name', component: GameDetailComponent},
  {path: 'servers/:pid', component: ServerComponent}
>>>>>>> Add per game console and some api fixes
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
