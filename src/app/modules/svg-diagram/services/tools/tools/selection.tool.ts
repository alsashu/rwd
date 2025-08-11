import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { SvgDiagramEvent } from "../../diagram/svg-diagram-event";

export class SelectionTool extends Tool {
  constructor(toolManager: IToolManager) {
    super("SelectionTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      res =
        ["mouseUp"].includes(lastEvent.simpleType) &&
        draggingData.isMouseDown &&
        draggingData.mouseDownButtons & 1 &&
        !draggingData.isMouseMoving;
    }
    if (res) {
      const debug = true;
    }
    return res;
  }

  public doMouseUp(): void {
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent && lastEvent.event) {
      const draggingData = this.toolService.draggingData;
      if (lastEvent.event.ctrlKey && !lastEvent.event.altKey && !lastEvent.event.shiftKey) {
        if (draggingData.mouseDownSvgObject) {
          this.selectionService.toggleSvgObjectSelection(draggingData.mouseDownSvgObject);
        }
      } else {
        this.selectionService.selectSvgObjects(
          draggingData.mouseDownSvgObject ? [draggingData.mouseDownSvgObject] : []
        );
      }

      this.svgDiagramService.emitDiagramEvent(
        new SvgDiagramEvent({
          type: SvgDiagramEvent.ObjectSingleClicked,
          object: this.svgDiagramService.diagram,
          subject: this.svgDiagramService.selectionService.getSelectedSvgObjects(),
          params: lastEvent,
        })
      );
    }
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
