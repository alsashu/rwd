import { Component, OnInit, Output, EventEmitter, Input, TemplateRef, NgZone, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.css']
})
export class TopPanelComponent implements OnInit {
  @Input()
  left: number = 0;

  @Input()
  top: number = 0;

  @Output()
  mouseOver = new EventEmitter<boolean>();

  @Input()
  data: any = {};

  @Input()
  template: TemplateRef<any>;

  @Input()
  isVisible: boolean = true;

  public isMouseOver = false;
  public isPined = false;

  constructor(
    public ngZone: NgZone,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  public ngOnInit() {
  }

  public setIsMouseOver(value) {
    this.isMouseOver = value;
    this.mouseOver.emit(this.isMouseOver);    
    this.calcIsVisible();
  }

  public setIsPined(value) {
    this.isPined = value;
    this.calcIsVisible();
  }

  public setMoving(value) {
    this.isMoving = value;
    this.calcIsVisible();
  }

  public calcIsVisible() {
    this.isVisible = this.isPined || this.isMouseOver || this.isMouseDown;
  }

  public getIsVisible() {
    return this.isVisible;
  }

  public isMouseDown = false;
  public isMoving = false;
  public mouseDownX = 0;
  public mouseDownY = 0;
  public mouseDownLeft = 0;
  public mouseDownTop = 0;

  public onMouseDown(event) {
    this.isMouseDown = true;
    this.setMoving(false);
    this.mouseDownX = event.clientX;
    this.mouseDownY = event.clientY;
    this.mouseDownLeft = this.left;
    this.mouseDownTop = this.top;
    this.addListeners();
    event.preventDefault();
    event.stopPropagation();    
  }

  private mouseMoveListener;
  private mouseUpListener;

  private addListeners() {
    this.mouseMoveListener = this.onMouseMove.bind(this);
    window.addEventListener("mousemove", this.mouseMoveListener);
    this.mouseUpListener = this.onMouseUp.bind(this);
    window.addEventListener("mouseup", this.mouseUpListener);
  }
  
  private removeListeners() {
    if (this.mouseMoveListener) { 
      window.removeEventListener("mousemove", this.mouseMoveListener); 
      this.mouseMoveListener = null;
    }
    if (this.mouseUpListener) { 
      window.removeEventListener("mouseup", this.mouseUpListener); 
      this.mouseUpListener = null;
    }
  }

  public onMouseMove(event) {
    if (this.isMouseDown) {
      this.isMoving = true;
      this.left = this.mouseDownLeft + event.clientX - this.mouseDownX;
      this.top = this.mouseDownTop + event.clientY - this.mouseDownY;
      event.preventDefault();
      event.stopPropagation();
      this.changeDetectorRef.detectChanges();
    }
  }

  public onMouseUp(event) {
    if (this.isMouseDown) {
      if (!this.isMoving) {
        this.setIsPined(!this.isPined);
      }
      this.isMouseDown = false;
      this.setMoving(false);
      event.preventDefault();
      this.removeListeners();
    } 
  }
}
