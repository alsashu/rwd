import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class DecreaseZoomCommand extends AbstractCommand {
  constructor(diagramService: IDiagramService) {
    super(diagramService, "DecreaseZoomCommand", "Zoom -");
  }

  public execute(): boolean {
    this.diagramService.zoomScrollService.zoomMinus();
    return true;
  }
}
