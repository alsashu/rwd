import { IInputEvent } from "../../services/events/input-event.service";
import { SvgDiagramComponent } from "./svg-diagram.component";

export interface IEventListenerData {
  eventName: string;
  element: any;
  listener: any;
}

/**
 * Event controller of the svg diagram component
 */
export class SvgDiagramEventController {
  private mouseDownListener: any;
  private mouseUpListener: any;
  private mouseMoveListener: any;
  private dragOverListener: any;
  private dropListener: any;
  private scrollListener: any;
  private wheelListener: any;

  private eventListenerDataList: IEventListenerData[] = [];

  private t0 = new Date();

  constructor(public svgDiagramComponent: SvgDiagramComponent) {}

  public onDestroy() {
    this.removeListeners();
  }

  public initEventListeners() {
    this.removeListeners();
    this.addListeners();
  }

  private getNativeElement() {
    return this.svgDiagramComponent.getSvgContainerElement();
  }

  private emitInputEvent(inputEvent: IInputEvent) {
    if (!["mouseMove", "keyDown", "wheel"].includes(inputEvent.simpleType)) {
      const t1 = new Date();
      const timeDiff = t1.valueOf() - this.t0.valueOf();
      if (timeDiff > 1500) {
        this.t0 = t1;
      }
      // console.log(">> IE", timeDiff, "ms", inputEvent);
      if (["mouseUp"].includes(inputEvent.simpleType)) {
        this.t0 = t1;
      }
    }
    this.svgDiagramComponent.svgDiagramService.inputEventService.emitInputEvent(inputEvent);
  }

  private addListeners() {
    const nativeElement = this.getNativeElement();
    if (nativeElement && !this.mouseDownListener) {
      this.svgDiagramComponent.ngZone.runOutsideAngular(() => {
        this.mouseDownListener = this.mouseDownEvent.bind(this);
        nativeElement.addEventListener("mousedown", this.mouseDownListener);
        this.scrollListener = this.scrollEvent.bind(this);
        nativeElement.addEventListener("scroll", this.scrollListener);
        this.wheelListener = this.wheelEvent.bind(this);
        nativeElement.addEventListener("wheel", this.wheelListener);
        this.dragOverListener = this.dragOverEvent.bind(this);
        nativeElement.addEventListener("dragover", this.dragOverListener);
        this.dropListener = this.dropEvent.bind(this);
        nativeElement.addEventListener("drop", this.dropListener);
      });
    }

    this.addSvgListeners();
  }

  private removeListeners() {
    const nativeElement = this.getNativeElement();
    if (nativeElement) {
      if (this.mouseDownListener) {
        nativeElement.removeEventListener("mousedown", this.mouseDownListener, true);
      }
      if (this.scrollListener) {
        nativeElement.removeEventListener("scroll", this.scrollListener, true);
      }
      if (this.wheelListener) {
        nativeElement.removeEventListener("wheel", this.wheelListener, true);
      }
    }
    this.eventListenerDataList.forEach((eventListener: IEventListenerData) => {
      eventListener.element.removeEventListener(eventListener.eventName, eventListener.listener, true);
    });
  }

  private addMoveListeners() {
    const nativeElement = this.getNativeElement();
    if (nativeElement && (!this.mouseMoveListener || !this.mouseUpListener)) {
      this.svgDiagramComponent.ngZone.runOutsideAngular(() => {
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
    const nativeElement = this.getNativeElement();
    if (nativeElement) {
      if (this.mouseMoveListener) {
        nativeElement.removeEventListener("mousemove", this.mouseMoveListener, true);
        this.mouseMoveListener = null;
      }
      if (this.mouseUpListener) {
        window.removeEventListener("mouseup", this.mouseUpListener);
        this.mouseUpListener = null;
      }
    }
  }

  public refresh() {
    this.detectChanges();
  }

  public detectChanges() {
    // this.svgDiagramComponent.changeDetectorRef.detectChanges();
  }

  private mouseDownEvent(event: any) {
    this.onContainerMouseDown(event);
    event.preventDefault();
    event.stopPropagation();
    this.addMoveListeners();
    return false;
  }

  private mouseMoveEvent(event: any) {
    this.onContainerMouseMove(event);
    event.preventDefault();
    return false;
  }

  private mouseUpEvent(event: any) {
    this.onContainerMouseUp(event);
    this.detectChanges();
    event.preventDefault();
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

  public doFocus() {
    this.svgDiagramComponent.doFocus();
  }

  public onGroupSvgObjectMouseDown(event: any, svgObject: any) {
    this.doFocus();
    if (svgObject) {
      this.emitInputEvent({ type: "onGroupSvgObjectMouseDown", simpleType: "mouseDown", event, params: { svgObject } });
      this.addMoveListeners();
    }
  }

  public onGroupSvgObjectMouseUp(event: any, svgObject: any) {
    if (svgObject) {
      this.emitInputEvent({ type: "onGroupSvgObjectMouseUp", simpleType: "mouseUp", event, params: { svgObject } });
    }
  }

  public onGroupSvgObjectMouseOver(event: any, svgObject: any) {
    this.doFocus();
    if (svgObject) {
      this.emitInputEvent({ type: "onGroupSvgObjectMouseOver", simpleType: "mouseOver", event, params: { svgObject } });
      this.svgDiagramComponent.showTooltip(event, svgObject);
    }
  }

  public onGroupSvgObjectMouseOut(event: any, svgObject: any) {
    this.doFocus();
    if (svgObject) {
      this.emitInputEvent({ type: "onGroupSvgObjectMouseOut", simpleType: "mouseOut", event, params: { svgObject } });
      this.svgDiagramComponent.hideTooltip(event, svgObject);
    }
  }

  public onContainerMouseDown(event: any) {
    this.doFocus();
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
    this.doFocus();
    this.emitInputEvent({ type: "onContainerDrop", simpleType: "drop", event, params: {} });
  }

  public onContainerWheel(event: any) {
    this.emitInputEvent({ type: "onContainerWheel", simpleType: "wheel", event, params: {} });
  }

  public onHandleMouseDown(event: any, svgObject: any, parentSvgObject: any) {
    this.doFocus();
    this.emitInputEvent({
      type: "onHandleMouseDown",
      simpleType: "mouseDown",
      event,
      params: { svgObject: parentSvgObject, handleSvgObject: svgObject },
    });
    this.addMoveListeners();
  }

  public onKeyDown(event: KeyboardEvent) {
    if (this.svgDiagramComponent.hasFocus) {
      this.emitInputEvent({ type: "onKeyDown", simpleType: "keyDown", event, params: {} });
    }
  }

  public addSvgListeners() {
    try {
      // Get svg elements
      const svgEl = this.svgDiagramComponent.getSvgElement();
      const svgModel = this.svgDiagramComponent.svgModel;
      const svgElementList = svgModel.svgObjectList.concat(svgModel.svgYellowObjectList);

      // Add listeners
      if (svgEl) {
        this.addEventListener("focus", svgEl, (event: any) => {
          this.svgDiagramComponent.hasFocus = true;
        });
        this.addEventListener("focusout", svgEl, (event: any) => {
          this.svgDiagramComponent.hasFocus = false;
        });
      }

      // Add listeners to sbg elements (groups)
      svgElementList.forEach((svgElement: any) => {
        this.addEventListener("mousedown", svgElement, (event: any) => {
          this.onGroupSvgObjectMouseDown(event, svgElement);
        });
        this.addEventListener("mouseup", svgElement, (event: any) => {
          this.onGroupSvgObjectMouseUp(event, svgElement);
        });
        // this.addEventListener("contextmenu", svgElement, (event: any) => {
        //   this.onGroupSvgObjectRightClick(event, svgElement);
        // });
        this.addEventListener("mouseover", svgElement, (event: any) => {
          this.onGroupSvgObjectMouseOver(event, svgElement);
        });
        this.addEventListener("mouseout", svgElement, (event: any) => {
          this.onGroupSvgObjectMouseOut(event, svgElement);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  private addEventListener(eventName: string, element: any, cb: any) {
    this.eventListenerDataList.push({
      eventName,
      element,
      listener: element.addEventListener(eventName, cb),
    });
  }
}
