import { cloneDeep } from "lodash";
import { IDiagramService } from "../diagram/diagram.service";
import { DiagramEvent } from "../diagram/diagram-event";

export class ClipboardService {
  private svgObjects: any[] = [];

  constructor(public diagramService: IDiagramService) {}

  public getSvgObjects(): any[] {
    return this.svgObjects;
  }

  public setSvgObjects(svgObjects: any[]) {
    this.svgObjects = cloneDeep(svgObjects);
    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.ClipboardChanged,
        object: this.diagramService.diagram,
        subject: this.svgObjects,
      })
    );
  }
}
