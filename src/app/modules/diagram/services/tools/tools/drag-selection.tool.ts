import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { cloneDeep } from "lodash";
import { DiagramEvent } from "../../diagram/diagram-event";

export class DragSelectionTool extends Tool {
  public movingData = {
    movingSvgObjects: [],
    movingSvgObjectsMemo: [],
    links: [],
  };

  constructor(toolManager: IToolManager) {
    super("DragSelectionTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      res =
        ["mouseMove"].includes(lastEvent.simpleType) &&
        draggingData.isMouseDown &&
        draggingData.mouseDownButtons & 1 &&
        draggingData.isMouseMoving &&
        draggingData.mouseDownSvgObject &&
        !(draggingData.mouseDownSvgObject.isEnabled == false) &&
        !draggingData.mouseDownPrimitiveSvgObject &&
        !draggingData.mouseDownHandleSvgObject;
    }
    return res;
  }

  public doStart(): void {
    const toolService = this.toolService;
    const draggingData = toolService.draggingData;
    const svgObject = this.toolService.draggingData.mouseDownSvgObject;
    if (svgObject) {
      if (!svgObject.isSelected) {
        this.selectionService.selectSvgObjects([svgObject]);
      }
    }
    if (draggingData.mouseDownEvent.ctrlKey && this.canClone()) {
      this.doClone();
    }
    this.movingData.movingSvgObjects = this.selectionService.getSelectedSvgObjects();
    this.movingData.movingSvgObjectsMemo = cloneDeep(this.movingData.movingSvgObjects);

    this.movingData.links = this.svgObjectService.graphService.getSvgObjectsLinks(
      this.selectionService.getSelectedSvgObjects()
    );
  }

  public doMouseMove(): void {
    this.toolService.moveSvgObjects(this.movingData);
    this.svgObjectService.graphService.refreshLinks(this.movingData.links);
  }

  public doMouseUp(): void {
    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.SelectionMoved,
        object: this.diagramService.diagram,
        subject: this.movingData.movingSvgObjects,
      })
    );
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }

  // Cloning
  public canClone() {
    return true;
  }

  public doClone() {
    const res = this.cloneSelection();
    this.selectionService.selectSvgObjects(res);
    return res;
  }

  public cloneSelection() {
    return this.svgObjectService.cloneService.cloneSvgObjects(this.selectionService.getSelectedSvgObjects());
  }
}
