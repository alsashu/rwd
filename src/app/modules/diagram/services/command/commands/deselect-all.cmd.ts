import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class DeSelectAllCommand extends AbstractCommand {
  private selectedSvgObjectMemento: any[] = null;

  public constructor(diagramService: IDiagramService) {
    super(diagramService, "DeSelectAllCommand", "Tout sélectionner");
  }

  public execute(): boolean {
    if (!this.selectedSvgObjectMemento) {
      this.selectedSvgObjectMemento = this.diagramService.selectionService.getSelectedSvgObjects();
    }
    this.diagramService.selectionService.deSelectAll();
    return true;
  }

  public undo() {
    this.diagramService.selectionService.selectSvgObjects(this.selectedSvgObjectMemento);
  }
}
