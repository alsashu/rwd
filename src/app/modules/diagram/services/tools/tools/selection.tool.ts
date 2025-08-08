import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { SvgConstService } from "../../svg-object/svg-const.service";
import { DiagramEvent } from "../../diagram/diagram-event";

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
        // !lastEvent.event.altKey &&
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

      this.diagramService.emitDiagramEvent(
        new DiagramEvent({
          type: DiagramEvent.ObjectSingleClicked,
          object: this.diagramService.diagram,
          subject: this.diagramService.selectionService.getSelectedSvgObjects(),
          params: lastEvent,
        })
      );
    }
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
