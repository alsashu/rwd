import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.css']
})
export class ToolTipComponent implements OnInit {

  isVisible = false;
  coord = { x: 50, y: 50 };
  html = "Hello";

  constructor() { }

  ngOnInit() {
  }

  show(event, html, cb = null) {
    if (!this.isVisible) {
      this.coord = { x: event.clientX + 20, y: event.clientY + 10};
      this.html = html;
      if (cb) { html = cb(); }
      this.isVisible = true;
    }
  }

  hide() {
    this.isVisible = false;
  }
}
