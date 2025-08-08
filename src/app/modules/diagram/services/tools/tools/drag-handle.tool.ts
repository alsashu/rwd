import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { cloneDeep } from "lodash";
import { IHandleController } from "../handle/handle.service";
import { DiagramEvent } from "../../diagram/diagram-event";

export class DragHandleTool extends Tool {
  public movingData = {
    movingSvgObjects: [],
    movingSvgObjectsMemo: [],
    links: [],
  };

  public handle: any;
  public handleController: IHandleController;

  constructor(toolManager: IToolManager) {
    super("DragHandleTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    let lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      let draggingData = this.draggingData;
      res =
        ["mouseMove"].includes(lastEvent.simpleType) &&
        draggingData.isMouseDown &&
        draggingData.mouseDownButtons & 1 &&
        draggingData.isMouseMoving &&
        draggingData.mouseDownSvgObject &&
        draggingData.mouseDownHandleSvgObject &&
        !draggingData.mouseDownHandleSvgObject.isMouseDownHandle;
        //        ["translate-handle", "rotate-handle"].includes(draggingData.mouseDownHandleSvgObject.type)
    }
    return res;
  }

  public doStart(): void {
    this.handle = this.toolService.draggingData.mouseDownHandleSvgObject;
    this.movingData.movingSvgObjects = this.selectionService.getSelectedSvgObjects();
    this.movingData.movingSvgObjectsMemo = cloneDeep(this.movingData.movingSvgObjects);

    this.movingData.links = this.svgObjectService.graphService
      .getSvgObjectsLinks(this.selectionService.getSelectedSvgObjects())
      .filter((svg) => !svg.isSelected);

    this.handleController = this.toolService.handleService.buildHandleController(this.handle, this.toolService);
    this.handleController.doStart();
  }

  public doMouseMove(): void {
    this.handleController.doMouseMove(this.movingData);
  }

  public doMouseUp(): void {
    this.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.HandleMoved,
        object: this.diagramService.diagram,
        subject: this.movingData.movingSvgObjects,
        params: this.handle,
      })
    );
    this.handleController.doMouseUp(this.movingData);
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
