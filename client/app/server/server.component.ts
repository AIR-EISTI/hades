import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {

  private pid: Number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.pid = Number(this.route.snapshot.paramMap.get('pid'));
  }

}
