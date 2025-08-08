import { DiagramComponent } from "./diagram.component";
import { IInputEvent } from "../../services/events/input-event.service";

export class DiagramEventController {
  protected static instanceCntr = 0;
  private t0 = new Date();

  private mouseDownListener: any;
  private mouseUpListener: any;
  private mouseMoveListener: any;
  private dragOverListener: any;
  private dropListener: any;
  private scrollListener: any;
  private wheelListener: any;

  constructor(public diagramComponent: DiagramComponent) {}

  public onInit() {
    this.addListeners();
  }

  public onDestroy() {
    this.removeListeners();
  }

  private emitInputEvent(inputEvent: IInputEvent) {
    if (!["mouseMove", "keyDown", "wheel"].includes(inputEvent.simpleType)) {
      const t1 = new Date();
      const timeDiff = t1.valueOf() - this.t0.valueOf();
      if (timeDiff > 1500) {
        this.t0 = t1;
      }
      console.log(">> IE", timeDiff, "ms", inputEvent);
      if (["mouseUp"].includes(inputEvent.simpleType)) {
        this.t0 = t1;
      }
    }
    this.diagramComponent.diagramController.diagramService.inputEventService.emitInputEvent(inputEvent);
  }

  private addListeners() {
    if (this.diagramComponent.svgRef && !this.mouseDownListener) {
      // console.log(">> addListeners instanceId", this.instanceId);
      this.diagramComponent.ngZone.runOutsideAngular(() => {
        const nativeElement = this.diagramComponent.svgRef.nativeElement;
        this.mouseDownListener = this.mouseDownEvent.bind(this);
        nativeElement.addEventListener("mousedown", this.mouseDownListener);
        this.dragOverListener = this.dragOverEvent.bind(this);
        nativeElement.addEventListener("dragover", this.dragOverListener);
        this.dropListener = this.dropEvent.bind(this);
        nativeElement.addEventListener("drop", this.dropListener);
        this.scrollListener = this.scrollEvent.bind(this);
        nativeElement.addEventListener("scroll", this.scrollListener);
        this.wheelListener = this.wheelEvent.bind(this);
        nativeElement.addEventListener("wheel", this.wheelListener);
      });
    }
  }

  private removeListeners() {
    const nativeElement = this.diagramComponent.svgRef.nativeElement;
    if (this.mouseDownListener) {
      nativeElement.removeEventListener("mousedown", this.mouseDownListener, true);
    }
    if (this.dragOverListener) {
      nativeElement.removeEventListener("dragover", this.dragOverListener, true);
    }
    if (this.dropListener) {
      nativeElement.removeEventListener("drop", this.dropListener, true);
    }
    if (this.scrollListener) {
      nativeElement.removeEventListener("scroll", this.scrollListener, true);
    }
    if (this.wheelListener) {
      nativeElement.removeEventListener("wheel", this.wheelListener, true);
    }
  }

  private addMoveListeners() {
    if (this.diagramComponent.svgRef && (!this.mouseMoveListener || !this.mouseUpListener)) {
      this.diagramComponent.ngZone.runOutsideAngular(() => {
        const nativeElement = this.diagramComponent.svgRef.nativeElement;
        if (!this.mouseMoveListener) {
          this.mouseMoveListener = this.mouseMoveEvent.bind(this);
          nativeElement.addEventListener("mousemove", this.mouseMoveListener);
        }
        if (!this.mouseUpListener) {
          this.mouseUpListener = this.mouseUpEvent.bind(this);
          window.addEventListener("mouseup", this.mouseUpListener);
        }
      });
    }
  }

  private removeMoveListeners() {
    const nativeElement = this.diagramComponent.svgRef.nativeElement;
    if (this.mouseMoveListener) {
      nativeElement.removeEventListener("mousemove", this.mouseMoveListener, true);
      this.mouseMoveListener = null;
    }
    if (this.mouseUpListener) {
      window.removeEventListener("mouseup", this.mouseUpListener);
      this.mouseUpListener = null;
    }
  }

  public refresh() {
    this.detectChanges();
  }

  public detectChanges() {
    this.diagramComponent.changeDetectorRef.detectChanges();
  }

  private mouseDownEvent(event: any) {
    this.onContainerMouseDown(event);
    //    this.detectChanges();
    event.preventDefault();
    event.stopPropagation();
    this.addMoveListeners();
    return false;
  }

  private mouseMoveEvent(event: any) {
    this.onContainerMouseMove(event);
    event.preventDefault();
    //    event.stopPropagation();//
    return false;
  }

  private mouseUpEvent(event: any) {
    this.onContainerMouseUp(event);

    // TODO DR test 01/12/20 => eviter refresh sur scroll
    this.detectChanges();

    event.preventDefault();
    //    event.stopPropagation();//

    // TODO TEST DR
    this.removeMoveListeners();

    return false;
  }

  private dragOverEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  private dropEvent(event: any) {
    this.onContainerDrop(event);
    this.detectChanges();
    event.preventDefault();
    return false;
  }

  private scrollEvent(event: any) {
    // if (this.el.nativeElement.clientWidth > 0) {
    //   this.previewService.onPreviewChange(event, this);
    // }
  }

  private wheelEvent(event: any) {
    this.onContainerWheel(event);
  }

  public focus() {
    this.diagramComponent.focus();
  }

  public onPrimitiveSvgObjectMouseDown(event: any, svgObject: any, parentSvgObject: any) {
    this.focus();
    this.emitInputEvent({
      type: "onPrimitiveSvgObjectMouseDown",
      simpleType: "mouseDown",
      event,
      params: { primitiveSvgObject: svgObject, svgObject: parentSvgObject },
    });
    this.addMoveListeners();
  }

  // TODO del
  public onPrimitiveSvgObjectRightClick(event: any, svgObject: any) {
    this.focus();
    //    this.handleEvent({ type: "onPrimitiveSvgObjectRightClick", simpleType : "mouseDown", event: event, params: { svgObject: svgObject }});
  }

  public onGroupSvgObjectMouseDown(event: any, svgObject: any) {
    this.focus();
    if (svgObject && svgObject.type === "library-object") {
      this.emitInputEvent({ type: "onGroupSvgObjectMouseDown", simpleType: "mouseDown", event, params: { svgObject } });
      this.addMoveListeners();
    }
  }

  public onGroupSvgObjectMouseUp(event: any, svgObject: any) {
    if (svgObject && svgObject.type === "library-object") {
      this.emitInputEvent({ type: "onGroupSvgObjectMouseUp", simpleType: "mouseUp", event, params: { svgObject } });
    }
  }

  // TODO del
  public onGroupSvgObjectRightClick(event: any, svgObject: any) {
    this.focus();
    //    this.handleEvent({ type: "onGroupSvgObjectRightClick", event: event, params: { svgObject: svgObject }});
  }

  public onContainerMouseDown(event: any) {
    this.focus();
    this.emitInputEvent({ type: "onContainerMouseDown", simpleType: "mouseDown", event, params: {} });
    this.addMoveListeners();
  }

  public onContainerMouseMove(event: any) {
    this.emitInputEvent({ type: "onContainerMouseMove", simpleType: "mouseMove", event, params: {} });
  }

  public onContainerMouseUp(event: any) {
    this.emitInputEvent({ type: "onContainerMouseUp", simpleType: "mouseUp", event, params: {} });
  }

  public onContainerDrop(event: any) {
    this.focus();
    this.emitInputEvent({ type: "onContainerDrop", simpleType: "drop", event, params: {} });
  }

  public onContainerWheel(event: any) {
    this.emitInputEvent({ type: "onContainerWheel", simpleType: "wheel", event, params: {} });
  }

  public onHandleMouseDown(event: any, svgObject: any, parentSvgObject: any) {
    this.focus();
    this.emitInputEvent({
      type: "onHandleMouseDown",
      simpleType: "mouseDown",
      event,
      params: { svgObject: parentSvgObject, handleSvgObject: svgObject },
    });
    this.addMoveListeners();
  }

  public onKeyDown(event: KeyboardEvent) {
    if (this.diagramComponent.hasFocus()) {
      this.emitInputEvent({ type: "onKeyDown", simpleType: "keyDown", event, params: {} });
    }
  }
}
