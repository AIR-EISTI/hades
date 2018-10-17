import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GamesComponent } from './games/games.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { ConsoleComponent } from './console/console.component';
<<<<<<< HEAD
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component'
=======
import { ServerComponent } from './server/server.component'
>>>>>>> Add per game console and some api fixes

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    GameDetailComponent,
    ConsoleComponent,
<<<<<<< HEAD
    InputComponent,
    ButtonComponent,
=======
    ServerComponent,
>>>>>>> Add per game console and some api fixes
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
