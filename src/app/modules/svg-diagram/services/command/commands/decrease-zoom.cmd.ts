import { ISvgDiagramService } from "../../diagram/svg-diagram.service";
import { AbstractCommand } from "./acommand";

export class DecreaseZoomCommand extends AbstractCommand {
  constructor(svgDiagramService: ISvgDiagramService) {
    super(svgDiagramService, "DecreaseZoomCommand", "Zoom -");
  }

  public execute(): boolean {
    this.svgDiagramService.zoomScrollService.zoomMinus();
    return true;
  }
}
