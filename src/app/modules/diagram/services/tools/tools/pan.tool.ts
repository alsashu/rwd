import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { DiagramEvent } from "../../diagram/diagram-event";

export class PanTool extends Tool {
  constructor(toolManager: IToolManager) {
    super("PanTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      res = ["mouseMove"].includes(lastEvent.simpleType) && lastEvent.event.buttons & 2 && draggingData.isMouseMoving;
    }
    return res;
  }

  public doMouseMove(): void {
    const toolService = this.toolService;
    const draggingData = toolService.draggingData;
    const zoomScrollService = toolService.zoomScrollService;

    const deltaCoord = toolService.getDeltaCoordFromClient();
    const zoom = zoomScrollService.getZoom();
    zoomScrollService.setDisplaySpeedMode(true);
    zoomScrollService.scroll({
      x: draggingData.mouseDownScrollPos.x - deltaCoord.x * zoom,
      y: draggingData.mouseDownScrollPos.y - deltaCoord.y * zoom,
    });
  }

  public doMouseUp(): void {
    this.toolService.zoomScrollService.setDisplaySpeedMode(false);
    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.ViewportBoundsChanged,
        object: this.diagramService.diagram,
        subject: null,
      })
    );

    this.toolManager.cancelLastEvent(true);
    this.stopTool();
  }
}
