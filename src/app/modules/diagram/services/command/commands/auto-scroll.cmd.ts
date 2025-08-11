import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class AutoScrollCommand extends AbstractCommand {
  public constructor(diagramService: IDiagramService) {
    super(diagramService, "AutoScrollCommand", "Auto scroll");
  }

  public execute(): boolean {
    this.diagramService.zoomScrollService.autoScroll();
    return true;
  }
}
