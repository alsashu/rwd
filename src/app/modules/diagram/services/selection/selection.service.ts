import { IDiagramService } from "../diagram/diagram.service";
import { DiagramEvent } from "../diagram/diagram-event";

export class SelectionService {
  private selectedSvgObjects: any[] = [];
  public frozzenSelectionStatus = false;

  constructor(public diagramService: IDiagramService) {}

  private fireEvent() {
    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.ChangedSelection,
        object: this.diagramService.diagram,
        subject: this.selectedSvgObjects,
      })
    );
    this.diagramService.refreshDiagram();
    // this.diagramService.refresh();
  }

  public selectAll() {
    this.selectSvgObjects(this.diagramService.getSelectableSvgObjects());
  }

  public deSelectAll() {
    this.selectSvgObjects([]);
  }

  public hasSelection(): boolean {
    return this.selectedSvgObjects.length > 0;
  }

  public selectSvgObjects(svgObjects: any[]): any[] {
    if (this.isSelectionFrozzen()) {
      return;
    }
    if (svgObjects && svgObjects.forEach) {
      this.selectedSvgObjects.forEach((o: any) => (o.isSelected = false));
      this.selectedSvgObjects = this.diagramService.svgObjectService.filterSelectableSvgObjects(svgObjects);
      this.selectedSvgObjects.forEach((o: any) => (o.isSelected = true));
      this.fireEvent();
      console.log(">> selectSvgObjects", this.selectedSvgObjects, this);
    } else {
      console.log(">> selectSvgObjects ERROR", svgObjects);
    }
    return this.selectedSvgObjects;
  }

  public getSelectedSvgObjects() {
    return this.selectedSvgObjects;
  }

  public getFirstSelectedSvgObjects() {
    return this.getSelectedSvgObjects().find((o: any) => true);
  }

  public toggleSvgObjectSelection(svgObject: any) {
    if (this.isSelectionFrozzen()) {
      return;
    }
    if (this.diagramService.svgObjectService.isSvgObjectSelectable(svgObject)) {
      svgObject.isSelected = !svgObject.isSelected;
      const i = this.selectedSvgObjects.indexOf(svgObject);
      if (i > -1) {
        this.selectedSvgObjects.splice(i, 1);
      }
      if (svgObject.isSelected) {
        this.selectedSvgObjects.push(svgObject);
      }
      this.fireEvent();
    }
  }

  public selectSvgObjectRecInRectangle(rect: { x: number; y: number; width: number; height: number }) {
    this.selectSvgObjects(
      this.diagramService.getSelectableSvgObjects().filter((svg: any) => this.isSvgObjectIntRect(svg, rect))
    );
  }

  public isSvgObjectIntRect(svgObject: any, rect: { x: number; y: number; width: number; height: number }): boolean {
    return (
      svgObject &&
      svgObject.x >= Math.min(rect.x, rect.x + rect.width) &&
      svgObject.x <= Math.max(rect.x, rect.x + rect.width) &&
      svgObject.y >= Math.min(rect.y, rect.y + rect.height) &&
      svgObject.y <= Math.max(rect.y, rect.y + rect.height)
    );
  }

  public isSelectionFrozzen() {
    return this.frozzenSelectionStatus;
  }
}
