import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";
import { DiagramEvent } from "../../diagram/diagram-event";

export class DeleteCommand extends AbstractCommand {
  public selectedSvgObjects = null;

  public constructor(diagramService: IDiagramService) {
    super(diagramService, "DeleteCommand", "Supprimer");
  }

  public canExecute(): boolean {
    return this.diagramService.selectionService.hasSelection();
  }

  public execute(): boolean {
    if (!this.selectedSvgObjects) {
      this.selectedSvgObjects = this.diagramService.selectionService.getSelectedSvgObjects();
    }

    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.SelectionDeleting,
        object: this.diagramService.diagram,
        subject: this.selectedSvgObjects,
      })
    );

    this.diagramService.commit((qs) => this.diagramService.removeSvgObjects(this.selectedSvgObjects));

    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.SelectionDeleted,
        object: this.diagramService.diagram,
        subject: this.selectedSvgObjects,
      })
    );

    return false;
  }

  // undo() {
  //   this.diagramService.transactionService.undo();
  // }
}
