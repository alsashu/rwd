import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class RedoCommand extends AbstractCommand {
  public constructor(diagramService: IDiagramService) {
    super(diagramService, "RedoCommand", "Rétablir");
  }

  public canExecute(): boolean {
    return this.diagramService.transactionService.canRedo();
  }

  public execute(): boolean {
    this.diagramService.transactionService.redo();
    return false;
  }
}
