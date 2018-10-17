import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games/games.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { ConsoleComponent } from './console/console.component';

const routes: Routes = [
  {path: "games", component: GamesComponent},
  {path: "games/:name", component: GameDetailComponent},
  {path: "console", component: ConsoleComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
