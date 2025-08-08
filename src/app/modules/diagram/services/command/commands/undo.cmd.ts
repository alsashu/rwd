import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class UndoCommand extends AbstractCommand {
  public constructor(diagramService: IDiagramService) {
    super(diagramService, "UndoCommand", "Défaire");
  }

  public canExecute(): boolean {
    return this.diagramService.transactionService.canUndo();
  }

  public execute(): boolean {
    this.diagramService.transactionService.undo();
    return false;
  }
}
