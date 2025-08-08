import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class IncreaseZoomCommand extends AbstractCommand {
  constructor(diagramService: IDiagramService) {
    super(diagramService, "IncreaseZoomCommand", "Zoom +");
  }

  public execute(): boolean {
    this.diagramService.zoomScrollService.zoomPlus();
    return true;
  }
}
