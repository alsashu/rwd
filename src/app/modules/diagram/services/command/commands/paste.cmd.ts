import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";
import { DiagramEvent } from "../../diagram/diagram-event";

export class PasteCommand extends AbstractCommand {
  public pasteSvgObjects = null;

  public constructor(diagramService: IDiagramService) {
    super(diagramService, "PasteCommand", "Coller");
  }

  public canExecute(): boolean {
    return this.diagramService.selectionService.hasSelection();
  }

  public execute(): boolean {
    if (!this.pasteSvgObjects) {
      let clipboardSvgObjects = this.diagramService.clipboardService.getSvgObjects();
      this.pasteSvgObjects = this.diagramService.svgObjectService.cloneService.cloneSvgObjects(clipboardSvgObjects);
    }
    let ds = this.diagramService;
    ds.commit((qs) => {
      ds.addSvgObjects(this.pasteSvgObjects);
      ds.selectionService.selectSvgObjects(this.pasteSvgObjects);
    });

    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.ClipboardPasted,
        object: this.diagramService.diagram,
        subject: this.pasteSvgObjects,
      })
    );
    return true;
  }

  public undo() {
    //    this.diagramService.transactionService.undo();
  }
}
