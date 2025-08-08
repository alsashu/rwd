import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { DiagramEvent } from "../../diagram/diagram-event";

export class ClickHandleTool extends Tool {
  constructor(toolManager: IToolManager) {
    super("ClickHandleTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    let lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      let draggingData = this.draggingData;
      res =
        ["mouseDown"].includes(lastEvent.simpleType) &&
        draggingData.isMouseDown &&
        draggingData.mouseDownButtons & 1 &&
        !draggingData.isMouseMoving &&
        draggingData.mouseDownSvgObject &&
        !(draggingData.mouseDownSvgObject.isEnabled === false) &&
        !(draggingData.mouseDownSvgObject.isVisible === false) &&
        draggingData.mouseDownHandleSvgObject &&
        draggingData.mouseDownHandleSvgObject.isMouseDownHandle;
    }
    return res;
  }

  public doStart(): void {}

  public doMouseDown(): void {
    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.HandleClicked,
        object: this.diagramService.diagram,
        subject: this.draggingData.mouseDownHandleSvgObject,
        params: this.draggingData.mouseDownSvgObject,
      })
    );
    this.toolManager.cancelLastEvent();
  }

  public doMouseMove(): void {
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }

  public doMouseUp(): void {
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
