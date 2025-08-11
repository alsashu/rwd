// import { Tool } from '../tool';
// import { IToolManager } from '../tool.manager';
// import { cloneDeep } from 'lodash';
// import { SvgDiagramEvent } from '../../diagram/svg-diagram-event';

// export class DragSubObjectTool extends Tool {
//   movingData = {
//     movingSvgObjects: [],
//     movingSvgObjectsMemo: [],
//   };

//   constructor(toolManager: IToolManager) {
//     super("DragSubObjectTool", toolManager);
//   }

//   canStart(): boolean {
//     let res = false;
//     const lastEvent = this.toolManager.lastEvent;
//     if (lastEvent) {
//       const draggingData = this.draggingData;
//       res = (["mouseMove"].includes(lastEvent.simpleType) &&
//         draggingData.isMouseDown &&
//         draggingData.mouseDownButtons & 1 &&
//         draggingData.isMouseMoving &&
//         draggingData.mouseDownPrimitiveSvgObject &&
//         draggingData.mouseDownPrimitiveSvgObject.isMovable &&
//         !draggingData.mouseDownPrimitiveSvgObject.isPort &&
//         !draggingData.mouseDownHandleSvgObject
//       );
//     }
//     return res;
//   }

//   doStart(): void {
//     const toolService = this.toolService;
//     const draggingData = toolService.draggingData;
//     const svgObject = this.toolService.draggingData.mouseDownSvgObject;
//     this.movingData.movingSvgObjects = [];
//     const primitiveSvgObject = draggingData.mouseDownPrimitiveSvgObject;
//     if (svgObject && primitiveSvgObject) {
//       this.movingData.movingSvgObjects = [primitiveSvgObject];
//     }
//     this.movingData.movingSvgObjectsMemo = cloneDeep(this.movingData.movingSvgObjects);
//   }

//   doMouseMove(): void {
//     this.toolService.moveSvgObjects(this.movingData);
//   }

//   doMouseUp(): void {
//     this.diagramService.emitDiagramEvent(new SvgDiagramEvent(
//       {
//         type: SvgDiagramEvent.SelectionMoved,
//         object: this.diagramService.diagram,
//         subject: this.movingData.movingSvgObjects,
//         params: this.toolService.draggingData.mouseDownSvgObject,
//       }
//     ));
//     this.toolManager.cancelLastEvent();
//     this.stopTool();
//   }
// }
