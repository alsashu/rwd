import { ISvgDiagramService } from "../../diagram/svg-diagram.service";
import { AbstractCommand } from "./acommand";

export class ResetZoomCommand extends AbstractCommand {
  public constructor(svgDiagramService: ISvgDiagramService) {
    super(svgDiagramService, "ResetZoomCommand", "Zoom 100%");
  }

  public execute(): boolean {
    this.svgDiagramService.zoomScrollService.resetZoom();
    return true;
  }
}
