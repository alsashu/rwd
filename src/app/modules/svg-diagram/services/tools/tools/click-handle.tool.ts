import { SvgDiagramEvent } from "../../diagram/svg-diagram-event";
import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";

export class ClickHandleTool extends Tool {
  constructor(toolManager: IToolManager) {
    super("ClickHandleTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
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
    this.svgDiagramService.emitDiagramEvent(
      new SvgDiagramEvent({
        type: SvgDiagramEvent.HandleClicked,
        object: this.svgDiagramService.diagram,
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
