import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class ResetZoomCommand extends AbstractCommand {
  public constructor(diagramService: IDiagramService) {
    super(diagramService, "ResetZoomCommand", "Zoom 100%");
  }

  public execute(): boolean {
    this.diagramService.zoomScrollService.setZoom(1);
    return true;
  }
}
