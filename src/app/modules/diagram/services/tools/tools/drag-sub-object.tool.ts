import { Tool } from '../tool';
import { IToolManager } from '../tool.manager';
import { cloneDeep } from 'lodash';
import { DiagramEvent } from '../../diagram/diagram-event';

export class DragSubObjectTool extends Tool {
  movingData = {
    movingSvgObjects: [],
    movingSvgObjectsMemo: [],
  };

  constructor(toolManager: IToolManager) {
    super("DragSubObjectTool", toolManager);
  }
 
  canStart(): boolean {
    let res = false;
    let lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      let draggingData = this.draggingData;
      res = (["mouseMove"].includes(lastEvent.simpleType) && 
        draggingData.isMouseDown &&  
        draggingData.mouseDownButtons & 1 && 
        draggingData.isMouseMoving && 
        draggingData.mouseDownPrimitiveSvgObject &&
        draggingData.mouseDownPrimitiveSvgObject.isMovable && 
        !draggingData.mouseDownPrimitiveSvgObject.isPort && 
        !draggingData.mouseDownHandleSvgObject
      );
    }
    return res;
  }

  doStart(): void {
    let toolService = this.toolService;
    let draggingData = toolService.draggingData;
    let svgObject = this.toolService.draggingData.mouseDownSvgObject;
    this.movingData.movingSvgObjects = [];
    let primitiveSvgObject = draggingData.mouseDownPrimitiveSvgObject;
    if (svgObject && primitiveSvgObject) {
      this.movingData.movingSvgObjects = [primitiveSvgObject];
    }
    this.movingData.movingSvgObjectsMemo = cloneDeep(this.movingData.movingSvgObjects);
  }

  doMouseMove(): void {
    this.toolService.moveSvgObjects(this.movingData);
  }

  doMouseUp(): void {
    this.diagramService.emitDiagramEvent(new DiagramEvent(
      { 
        type: DiagramEvent.SelectionMoved,
        object: this.diagramService.diagram,
        subject: this.movingData.movingSvgObjects, 
        params: this.toolService.draggingData.mouseDownSvgObject, 
      }
    ));       
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}