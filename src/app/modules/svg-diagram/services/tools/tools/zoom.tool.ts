import { SvgDiagramEvent } from "../../diagram/svg-diagram-event";
import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";

export class ZoomTool extends Tool {
  constructor(toolManager: IToolManager) {
    super("ZoomTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    res = ["wheel"].includes(lastEvent.simpleType);
    return res;
  }

  public doMouseWheel(): void {
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent && lastEvent.event) {
      const event = lastEvent.event;
      if (event.ctrlKey || event.altKey) {
        event.preventDefault();
      } else if (event.shiftKey) {
      } else {
        event.preventDefault();
        const zoomScrollService = this.toolService.zoomScrollService;
        if (event.deltaY < 0) {
          zoomScrollService.zoomPlus();
        } else if (event.deltaY > 0) {
          zoomScrollService.zoomMinus();
        }
      }
    }
    this.svgDiagramService.emitDiagramEvent(
      new SvgDiagramEvent({
        type: SvgDiagramEvent.ViewportBoundsChanged,
        object: this.svgDiagramService.diagram,
        subject: null,
      })
    );
    this.stopTool();
  }
}
