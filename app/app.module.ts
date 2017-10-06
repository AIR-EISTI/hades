import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { GamesMenuComponent } from './gameMenu.component';
import { GameService } from './game.service';

import { GameComponent } from './game.component';
import { ServerConsoleComponent } from './serverConsole.component';

import { HashLocationStrategy,Location,LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './url.module';

import { ServersComponent } from './server.component';
import { ServerService } from './server.service';

import { SocketServerService } from './socket.service';
import { FormsModule }   from '@angular/forms';


@NgModule({
  imports:      [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    GamesMenuComponent,
    GameComponent,
    ServersComponent,
    ServerConsoleComponent
  ],
  providers: [
    GameService,
    [{ provide: LocationStrategy, useClass:HashLocationStrategy}],
    ServerService,
    SocketServerService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
