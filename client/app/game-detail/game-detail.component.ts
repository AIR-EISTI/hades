import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 
  }

  ngOnInit() {
  }

  getGame(): void {
    const game = +this.route.snapshot.paramMap.get('id');
  }

}
