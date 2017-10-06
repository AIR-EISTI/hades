import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { ServerInfo } from "./server";
import { ViewChild, ElementRef,PipeTransform, Pipe, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { ServerService } from './server.service';
import { SocketServerService } from './socket.service';
/*import { HeroService } from './hero.service';*/






@Component({
  selector: 'serveur-console',
  templateUrl: './templates/serveurConsole.component.html',
  /*directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],*/
  styleUrls: [ './static/css/serveurConsole.component.css' ]
})

export class ServerConsoleComponent implements OnInit, AfterViewChecked{
  serveur:ServerInfo;
  pid:string;
  scroll: boolean = true;
  cmd:string = "";

  @ViewChild('console') consoleEl: ElementRef;

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private location: Location
  ) {
  }

  //initialisation de la class
  ngOnInit(): void {
    //on recupère les infos du serveur passé en paramètre
    this.route.params
    .switchMap((params: Params) => {
      this.pid = params['pid'];
      this.serverService.socketService.socket.emit('change-room', params['pid'])
      return this.serverService.getServer(params['pid'])
    })
    .subscribe(
      (serveur: ServerInfo) => {
        console.log(serveur);
        this.serveur = serveur;
      }
    );
    this.serverService.socketService.getSocket().subscribe((message: any) => {
      if(message.action === 'console'){
        this.scroll = this.consoleEl.nativeElement.scrollTop == this.consoleEl.nativeElement.scrollHeight - this.consoleEl.nativeElement.getBoundingClientRect().height;
        this.serveur.stdout.push(message.data);
        this.serveur.stdout = this.serveur.stdout.slice(-100);
      }
      if(message.action === 'update-status'){
        this.serveur.status = message.data.status;
        this.serveur.exitCode = message.data.exitCode;
      }
    });
  }

  arret():void{
    if(this.serveur.status === 'RUNNING') {
      this.serverService.killServer(this.pid);
    }
  }

  envoi():void{
    this.serverService.cmdServer(this.pid,this.cmd);
    this.cmd = "";
  }

  scrollIfNeeded(): void{
    if(this.scroll && this.consoleEl){
      this.consoleEl.nativeElement.scrollTop = this.consoleEl.nativeElement.scrollHeight;
    }
  }

  ngAfterViewChecked():void{
    this.scrollIfNeeded();
  }

  keyDownFunction(event:any) {
  if(event.keyCode == 13) {
    this.envoi()
    
  }
}
}
