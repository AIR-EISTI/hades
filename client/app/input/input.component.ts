import { Component, OnInit,Input } from '@angular/core';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  focus:boolean;
  @Input() label: String;
  @Input() default_value: String;


  constructor() { }

  ngOnInit() {
    this.focus = false;
  }

  setFocus()
  {
    this.focus = true
  }

  undoFocus()
  {
    this.focus = false
  }

}
