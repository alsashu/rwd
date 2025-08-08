import { ITool } from "./tool";
import { PanTool } from "./tools/pan.tool";
import { SelectionTool } from "./tools/selection.tool";
import { ToolService } from "./tool.service";
import { ZoomTool } from "./tools/zoom.tool";
import { ContextTool } from "./tools/context.tool";
import { SelectionRectangleTool } from "./tools/selection-rectangle.tool";
import { DragSelectionTool } from "./tools/drag-selection.tool";
import { DragHandleTool } from "./tools/drag-handle.tool";
import { ClickHandleTool } from "./tools/click-handle.tool";
import { LinkingTool } from "./tools/linking.tool";
import { DragSubObjectTool } from "./tools/drag-sub-object.tool";
import { IDiagramService } from "../diagram/diagram.service";
import { IInputEvent } from "../events/input-event.service";
import { PolylinePointTool } from "./tools/polyline-point.tool";

export interface IToolManager {
  lastEvent: IInputEvent;
  toolService: ToolService;
  diagramService: IDiagramService;

  stopTool(tool: ITool);
  cancelLastEvent(doStopPropagation?: boolean);
}

export class ToolManager implements IToolManager {
  public lastEvent: IInputEvent;
  public tools: ITool[] = [];
  public currentTool: ITool;
  public inputEventSubscription: any;

  public toolService: ToolService = new ToolService(this);

  constructor(public diagramService: IDiagramService) {
    this.initTools();

    if (this.diagramService.diagramController) {
      this.inputEventSubscription = this.diagramService.inputEventService.inputEventEmitter.subscribe((e: any) =>
        this.handleInputEvent(e)
      );
    }
  }

  public onDestroy() {
    this.inputEventSubscription.unsubscribe();
  }

  public initTools() {
    this.addTool(new PanTool(this));
    this.addTool(new ZoomTool(this));
    this.addTool(new ContextTool(this));
    this.addTool(new PolylinePointTool(this));
    this.addTool(new SelectionTool(this));
    this.addTool(new SelectionRectangleTool(this));
    this.addTool(new DragSelectionTool(this));
    this.addTool(new DragHandleTool(this));
    this.addTool(new ClickHandleTool(this));
    this.addTool(new LinkingTool(this));
    this.addTool(new DragSubObjectTool(this));
  }

  public addTool(tool: ITool) {
    this.tools.push(tool);
  }

  public handleInputEvent(inputEvent: IInputEvent) {
    let handleEvent = true;

    if (["onPrimitiveSvgObjectMouseDown"].includes(inputEvent.type)) {
      handleEvent = false;
      const params = inputEvent.params;
      if (params) {
        const primitiveSvgObject = params.primitiveSvgObject;
        if (primitiveSvgObject && (primitiveSvgObject.isMovable || primitiveSvgObject.isPort)) {
          handleEvent = true;
        }
      }
    }

    if (handleEvent) {
      this.lastEvent = inputEvent;

      if (inputEvent.simpleType === "mouseDown") {
        this.toolService.onMouseDown(inputEvent);
      } else if (inputEvent.simpleType === "mouseMove") {
        this.toolService.onMouseMove(inputEvent);
      }

      this.findActiveTool();

      if (this.currentTool && this.currentTool.isActive) {
        if (inputEvent.simpleType === "mouseDown") {
          this.currentTool.doMouseDown();
        } else if (inputEvent.simpleType === "mouseMove") {
          this.currentTool.doMouseMove();
        } else if (inputEvent.simpleType === "mouseUp") {
          this.currentTool.doMouseUp();
        } else if (inputEvent.simpleType === "wheel") {
          this.currentTool.doMouseWheel();
        }
      }

      if (inputEvent.simpleType === "mouseUp") {
        this.toolService.onMouseUp(inputEvent);
      }
    }
  }

  public findActiveTool() {
    if (!this.currentTool || !this.currentTool.isActive) {
      this.currentTool = null;
      this.tools.forEach((t: any) => {
        if (!this.currentTool && t.isEnabled && t.canStart()) {
          this.setCurrentTool(t);
        }
      });
    }
  }

  public setCurrentTool(tool: ITool): ITool {
    if (this.currentTool && this.currentTool !== tool) {
      this.currentTool.stopTool();
    }
    this.currentTool = tool;
    this.currentTool.startTool();
    return this.currentTool;
  }

  public stopTool(tool: ITool) {
    this.currentTool = null;
  }

  public cancelLastEvent(doStopPropagation: boolean = false) {
    const lastEvent = this.lastEvent;
    if (lastEvent && lastEvent.event) {
      const event = lastEvent.event;
      event.preventDefault();
      if (doStopPropagation) {
        event.stopPropagation();
      }
    }
  }
}
