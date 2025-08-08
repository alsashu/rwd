import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-top-button',
  templateUrl: './top-button.component.html',
  styleUrls: ['./top-button.component.css']
})
export class TopButtonComponent implements OnInit {
  @Input()
  left: number = 100;

  @Input()
  top: number = 10;

  @Output()
  mouseOver = new EventEmitter<boolean>();

  public isMouseOver = false;

  constructor() { }

  ngOnInit() {
  }

  public setIsMouseOver(value) {
    this.isMouseOver = value;
    this.mouseOver.emit(this.isMouseOver);    
  }
}
