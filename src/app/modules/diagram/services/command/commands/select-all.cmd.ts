import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class SelectAllCommand extends AbstractCommand {
  private selectedSvgObjectMemento: any[] = null;

  public constructor(diagramService: IDiagramService) {
    super(diagramService, "SelectAllCommand", "Tout sélectionner");
  }

  public execute(): boolean {
    if (!this.selectedSvgObjectMemento) {
      this.selectedSvgObjectMemento = this.diagramService.selectionService.getSelectedSvgObjects();
    }
    this.diagramService.selectionService.selectAll();
    return true;
  }

  public undo() {
    this.diagramService.selectionService.selectSvgObjects(this.selectedSvgObjectMemento);
  }
}
