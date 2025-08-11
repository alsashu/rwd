import { ToolManager } from "./tool.manager";
import { IDiagramService } from "../diagram/diagram.service";
import { SvgObjectService } from "../svg-object/svg-object.service";
import { HandleService } from "./handle/handle.service";
import { ZoomScrollService } from "../zoom-scroll/zoom-scroll.service";
import { SelectionService } from "../selection/selection.service";
import { IInputEvent } from "../events/input-event.service";

export class ToolService {
  public draggingData = {
    isMouseDown: false,
    isMouseMoving: false,
    selectionRect: null,
    mouseDownEvent: null,
    mouseDownCoordFromClient: null,
    mouseDownCoordFromLayer: null,
    mouseDownButtons: null,
    mouseDownScrollPos: null,
    mouseDownPrimitiveSvgObject: null,
    mouseDownSvgObject: null,
    mouseDownHandleSvgObject: null,
    mouseDownHandleSvgObjectMemo: null,
  };

  public diagramService: IDiagramService;
  public svgObjectService: SvgObjectService;
  public zoomScrollService: ZoomScrollService;
  public selectionService: SelectionService;

  public handleService: HandleService = new HandleService();

  constructor(public toolManager: ToolManager) {
    this.diagramService = this.toolManager.diagramService;
    this.svgObjectService = this.diagramService.svgObjectService;
    this.selectionService = this.diagramService.selectionService;
    this.zoomScrollService = this.diagramService.zoomScrollService;
  }

  public getDiagramComponent() {
    return this.diagramService.diagramController.diagramComponent;
  }

  public getDiagram() {
    return this.diagramService.diagram;
  }

  public onMouseDown(diagramEvent: IInputEvent) {
    const event = diagramEvent.event;
    const params = diagramEvent.params;

    const svgObject = params && params.svgObject ? params.svgObject : null;
    const primitiveSvgObject = params && params.primitiveSvgObject ? params.primitiveSvgObject : null;
    const handleSvgObject = params && params.handleSvgObject ? params.handleSvgObject : null;

    this.draggingData.isMouseDown = true;
    this.draggingData.mouseDownEvent = event;
    this.draggingData.mouseDownCoordFromClient = this.zoomScrollService.getMousePositionFromClient(event);
    this.draggingData.mouseDownCoordFromLayer = this.zoomScrollService.getMousePositionFromLayer(event);
    this.draggingData.mouseDownButtons = event.buttons;
    this.draggingData.mouseDownScrollPos = this.zoomScrollService.getScrollPos();

    if (primitiveSvgObject) {
      this.draggingData.mouseDownPrimitiveSvgObject = primitiveSvgObject;
    }
    if (!this.draggingData.mouseDownSvgObject && svgObject) {
      this.draggingData.mouseDownSvgObject = svgObject;
    }
    if (handleSvgObject) {
      this.draggingData.mouseDownHandleSvgObject = handleSvgObject;
    }
  }

  public onMouseMove(diagramEvent: IInputEvent) {
    const event = diagramEvent.event;
    if (this.draggingData.isMouseDown) {
      if (!this.draggingData.isMouseMoving) {
        const coord = this.zoomScrollService.getMousePositionFromClient(event);
        const mouseDownCoord = this.draggingData.mouseDownCoordFromClient;
        const deltaCoord = { x: coord.x - mouseDownCoord.x, y: coord.y - mouseDownCoord.y };
        this.draggingData.isMouseMoving =
          this.draggingData.isMouseMoving || Math.abs(deltaCoord.x) > 5 || Math.abs(deltaCoord.y) > 5;
      }
    }
  }

  public onMouseUp(diagramEvent: IInputEvent) {
    this.draggingData.isMouseDown = false;
    this.draggingData.isMouseMoving = false;
    this.draggingData.mouseDownPrimitiveSvgObject = null;
    this.draggingData.mouseDownSvgObject = null;
    this.draggingData.mouseDownHandleSvgObject = null;
  }

  // Utils
  public refresh() {
    this.diagramService.refresh();
  }

  // Coords from event
  public getDeltaCoordFromClient() {
    let deltaCoord = null;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent && lastEvent.event) {
      const event = lastEvent.event;
      const coord = this.zoomScrollService.getMousePositionFromClient(event);
      const mouseDownCoord = this.draggingData.mouseDownCoordFromClient;
      deltaCoord = { x: coord.x - mouseDownCoord.x, y: coord.y - mouseDownCoord.y };
    }
    return deltaCoord;
  }

  // Move
  public moveSvgObjects(movingData: any): void {
    const deltaCoord = this.getDeltaCoordFromClient();
    for (let i = 0; i < movingData.movingSvgObjects.length; i++) {
      const svgObject = movingData.movingSvgObjects[i];
      const svgObjectMemo = movingData.movingSvgObjectsMemo[i];
      this.svgObjectService.refreshService.moveSvgObject(svgObject, svgObjectMemo, deltaCoord);
    }
    this.refresh();
  }
}
