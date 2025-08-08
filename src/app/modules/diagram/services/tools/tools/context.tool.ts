import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { DiagramEvent } from "../../diagram/diagram-event";

export class ContextTool extends Tool {
  constructor(toolManager: IToolManager) {
    super("ContextTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      res =
        ["mouseUp"].includes(lastEvent.simpleType) &&
        draggingData.isMouseDown &&
        draggingData.mouseDownButtons & 2 &&
        !draggingData.isMouseMoving;
    }
    return res;
  }

  public doMouseUp(): void {
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      // lastEvent.event.preventDefault();
      // lastEvent.event.stopPropagation();

      // TODO this.draggingData

      // BackgroundContextClicked
      // ObjectContextClicked

      // cf. https://github.com/isaacplmann/ngx-contextmenu/issues/100
      // setTimeout(() => {
      this.diagramService.emitDiagramEvent(
        new DiagramEvent({
          type: DiagramEvent.ObjectContextClicked,
          object: this.diagramService.diagram,
          subject: this.diagramService.selectionService.getSelectedSvgObjects(),
          params: lastEvent,
        })
      );
      // }
    }
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
