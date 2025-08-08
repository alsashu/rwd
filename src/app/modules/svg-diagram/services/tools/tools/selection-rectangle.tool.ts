import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";

export class SelectionRectangleTool extends Tool {
  private selectionRect: { x: number; y: number; width: number; height: number } = null;

  constructor(toolManager: IToolManager) {
    super("SelectionRectangleTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      res =
        ["mouseMove"].includes(lastEvent.simpleType) &&
        draggingData.isMouseDown &&
        draggingData.mouseDownButtons & 1 &&
        draggingData.isMouseMoving &&
        !draggingData.mouseDownSvgObject;
    }
    return res;
  }

  public doMouseMove(): void {
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      const event = lastEvent.event;
      const toolService = this.toolService;
      const coord = toolService.zoomScrollService.getMousePositionFromLayer(event);
      const mouseDownCoord = draggingData.mouseDownCoordFromLayer;
      this.selectionRect = {
        x: mouseDownCoord.x,
        y: mouseDownCoord.y,
        width: Math.round(coord.x - mouseDownCoord.x),
        height: Math.round(coord.y - mouseDownCoord.y),
      };
      this.updateSelectionRect(true, this.selectionRect);
      toolService.refresh();
    }
  }

  public doMouseUp(): void {
    this.selectSvgObjectRecInRectangle(this.selectionRect);
    this.toolManager.cancelLastEvent();
    this.stopTool();
    // TODO this.svgDiagramService.refresh();
  }

  public doStop() {
    this.updateSelectionRect(false);
  }

  public updateSelectionRect(isVisible: boolean, rect: { x: number; y: number; width: number; height: number } = null) {
    this.toolService.getSvgDiagramComponent().updateSelectionRect(isVisible, rect);
  }

  public selectSvgObjectRecInRectangle(rect: { x: number; y: number; width: number; height: number }) {
    this.selectionService.selectSvgObjectRecInRectangle(rect);
  }
}
