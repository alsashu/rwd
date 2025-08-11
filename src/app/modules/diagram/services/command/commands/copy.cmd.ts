import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";
import { DiagramEvent } from "../../diagram/diagram-event";

export class CopyCommand extends AbstractCommand {
  public selectedSvgObjects = null;

  public constructor(diagramService: IDiagramService) {
    super(diagramService, "CopyCommand", "Copier");
  }

  public canExecute(): boolean {
    return this.diagramService.selectionService.hasSelection();
  }

  public execute(): boolean {
    if (!this.selectedSvgObjects) {
      this.selectedSvgObjects = this.diagramService.selectionService.getSelectedSvgObjects();
      this.diagramService.clipboardService.setSvgObjects(this.selectedSvgObjects);
      this.diagramService.emitDiagramEvent(
        new DiagramEvent({
          type: DiagramEvent.SelectionCopied,
          object: this.diagramService.diagram,
          subject: this.selectedSvgObjects,
        })
      );
    }
    return true;
  }
}
