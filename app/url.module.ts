import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './game.component';
import { ServerConsoleComponent } from './serverConsole.component';

const routes: Routes = [
  { path: 'game/:name',  component:GameComponent },
  { path: 'server/:pid',  component:ServerConsoleComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
