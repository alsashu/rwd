import { IDiagramService } from "../diagram/diagram.service";
import { DiagramEvent } from "../diagram/diagram-event";

export class LayoutService {
  constructor(public diagramService: IDiagramService) {
    if (this.diagramService.diagramController) {
      this.diagramService.changeEventEmitter.subscribe((event) => {
        if (event.propertyName == "CommittingTransaction") {
          let transaction = event.object;
          if (transaction && transaction.changeEvents && transaction.changeEvents.length) {
            this.executeDiagramLayout();
          }
        }
      });
    }
  }

  public executeDiagramLayout() {
    if (this.diagramService.diagramLayout) {
      this.diagramService.diagramLayout.execute();

      this.diagramService.emitDiagramEvent(
        new DiagramEvent({
          type: DiagramEvent.LayoutCompleted, //ChangedSelection,
          object: this.diagramService.diagram,
          subject: this.diagramService.diagramLayout,
        })
      );
    }
  }
}
