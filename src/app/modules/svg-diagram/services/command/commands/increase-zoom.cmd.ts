import { ISvgDiagramService } from "../../diagram/svg-diagram.service";
import { AbstractCommand } from "./acommand";

export class IncreaseZoomCommand extends AbstractCommand {
  constructor(svgDiagramService: ISvgDiagramService) {
    super(svgDiagramService, "IncreaseZoomCommand", "Zoom +");
  }

  public execute(): boolean {
    this.svgDiagramService.zoomScrollService.zoomPlus();
    return true;
  }
}
