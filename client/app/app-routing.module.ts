import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games/games.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { ServerComponent } from './server/server.component';
import { GraphComponent } from './graph/graph.component';

const routes: Routes = [
  {path: 'games', component: GamesComponent},
  {path: 'games/:name', component: GameDetailComponent},
  {path: 'servers/:pid', component: ServerComponent},
  {path: 'graph', component: GraphComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
