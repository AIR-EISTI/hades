import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements OnInit, ControlValueAccessor {

  @Input() label: String;
  private focus = false;
  private _value: String;
  private propagateChange = (_: any) => {};

  constructor() { }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this.propagateChange(this._value);
  }

  ngOnInit() {
    this.focus = false;
  }

  toggleFocus() {
    this.focus = !this.focus;
  }

  writeValue(value: string) {
    this._value = value;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

}
