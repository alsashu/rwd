import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class CutCommand extends AbstractCommand {
  public selectedSvgObjects = null;

  public constructor(diagramService: IDiagramService) {
    super(diagramService, "CutCommand", "Couper");
  }

  public canExecute(): boolean {
    return this.diagramService.selectionService.hasSelection();
  }

  public execute(): boolean {
    if (!this.selectedSvgObjects) {
      this.selectedSvgObjects = this.diagramService.selectionService.getSelectedSvgObjects();
      this.diagramService.clipboardService.setSvgObjects(this.selectedSvgObjects);
    }
    this.diagramService.commit((qs) => this.diagramService.removeSvgObjects(this.selectedSvgObjects));
    return true;
  }

  // public undo() {
  //   this.diagramService.transactionService.undo();
  // }
}
