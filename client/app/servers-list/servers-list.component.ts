import { Component, OnInit } from '@angular/core';
import { Server } from '../models/server';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-servers-list',
  templateUrl: './servers-list.component.html',
  styleUrls: ['./servers-list.component.css']
})
export class ServersListComponent implements OnInit {

  private servers: Server[];

  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.serverService.getServersList().subscribe(
      servers => this.servers = servers,
      error => console.log(error)
    )
  }

}
