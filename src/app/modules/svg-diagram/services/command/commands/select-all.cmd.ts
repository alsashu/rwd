import { ISvgDiagramService } from "../../diagram/svg-diagram.service";
import { AbstractCommand } from "./acommand";

export class SelectAllCommand extends AbstractCommand {
  private selectedSvgObjectMemento: any[] = null;

  public constructor(svgDiagramService: ISvgDiagramService) {
    super(svgDiagramService, "SelectAllCommand", "Tout sélectionner");
  }

  public execute(): boolean {
    if (!this.selectedSvgObjectMemento) {
      this.selectedSvgObjectMemento = this.svgDiagramService.selectionService.getSelectedSvgObjects();
    }
    this.svgDiagramService.selectionService.selectAll();
    return true;
  }

  public undo() {
    this.svgDiagramService.selectionService.selectSvgObjects(this.selectedSvgObjectMemento);
  }
}
