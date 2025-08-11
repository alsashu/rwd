// import { ToolService } from "../tool.service";
// import { SvgConstService } from "src/app/services/svg/svg-const.service";
// import { cloneDeep } from "lodash";
// import { SvgObjectService } from "../../svg-object/svg-object.service";
// import { IDiagramService } from "../../diagram/diagram.service";

// export interface IHandleController {
//   handleParams: any;
//   toolService: ToolService;
//   doStart(params?: any): void;
//   doMouseMove(params?: any): void;
//   doMouseUp(params?: any): void;
// }

// export class HandleService {
//   public buildHandleController(handleParams: any, toolService: ToolService): IHandleController {
//     let res = null;
//     if (handleParams.type === SvgConstService.SELECTION_HANDLE) {
//       res = new SelectionHandleController(handleParams, toolService);
//     } else if (handleParams.type === SvgConstService.ROTATE_HANDLE) {
//       res = new RotateHandleController(handleParams, toolService);
//     } else if (handleParams.type === SvgConstService.SIZE_HANDLE) {
//       res = new SizeHandleController(handleParams, toolService);
//     } else if (handleParams.type === SvgConstService.POLYLINE_HANDLE) {
//       res = new PolylineHandleController(handleParams, toolService);
//     } else if (handleParams.type === SvgConstService.PATH_HANDLE) {
//       res = new PathHandleController(handleParams, toolService);
//     } else if (handleParams.type === SvgConstService.MAPPING_HANDLE) {
//       res = new MappingHandleController(handleParams, toolService);
//     } else if (handleParams.type === SvgConstService.LINK_HANDLE) {
//       res = new LinkHandleController(handleParams, toolService);
//     } else {
//       res = new TranslateHandleController(handleParams, toolService);
//     }
//     return res;
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export abstract class AbstractHandleController implements IHandleController {
//   public svgObjectService: SvgObjectService;
//   public diagramService: IDiagramService;

//   constructor(public handleParams: any, public toolService: ToolService) {
//     this.svgObjectService = this.toolService.svgObjectService;
//     this.diagramService = this.toolService.diagramService;
//   }

//   public doStart(params: any): void {}

//   public doMouseMove(params: any): void {
//     const movingData = params;
//     const doRound = false; // TODO
//     const deltaCoord = this.toolService.getDeltaCoordFromClient();
//     for (let i = 0; i < movingData.movingSvgObjects.length; i++) {
//       const svgObject = movingData.movingSvgObjects[i];
//       const svgObjectMemo = movingData.movingSvgObjectsMemo[i];
//       this.moveSvgObjectHandle(svgObject, svgObjectMemo, deltaCoord, doRound);
//       // TODO DR OPTIM TEST
//       // this.svgObjectService.refreshService.refreshSvgObjectRec(svgObject, true);
//     }
//     // TODO DR OPTIM TEST
//     // this.svgObjectService.graphService.refreshLinks(movingData.links);
//     this.toolService.refresh();
//   }

//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {}

//   public doMouseUp(params: any): void {
//     const movingData = params;
//     this.svgObjectService.refreshService.refreshSvgObjects(movingData.movingSvgObjects);
//   }

//   public roundCoord(point: any): any {
//     return this.diagramService.zoomScrollService.roundCoord(point);
//   }

//   public roundCoordValue(value: any): any {
//     return this.diagramService.zoomScrollService.roundCoordValue(value);
//   }

//   public parseFloat(value: any): number {
//     return parseFloat(String(value));
//   }

//   public parseInt(value: any): number {
//     return parseInt(String(value), 10);
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export class SelectionHandleController extends AbstractHandleController {
//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
//     // Do nothing
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export class TranslateHandleController extends AbstractHandleController {
//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
//     this.svgObjectService.refreshService.moveSvgObject(svgObject, svgObjectMemo, deltaCoord, doRound);
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export class RotateHandleController extends AbstractHandleController {
//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
//     let rotate = svgObjectMemo.rotate;
//     rotate = (rotate != undefined ? rotate : 0) + deltaCoord.y;
//     this.diagramService.modify(svgObject, "rotate", this.roundCoordValue(rotate));
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export class SizeHandleController extends AbstractHandleController {
//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
//     const handleParams = this.handleParams;
//     if (["ne", "se"].includes(handleParams.pos)) {
//       this.diagramService.modify(
//         svgObject,
//         "width",
//         this.roundCoordValue(this.parseFloat(svgObjectMemo.width) + deltaCoord.x)
//       );
//     }
//     if (["se"].includes(handleParams.pos)) {
//       this.diagramService.modify(svgObject, "height", this.parseFloat(svgObjectMemo.height) + deltaCoord.y);
//     }
//     if (["ne"].includes(handleParams.pos)) {
//       this.diagramService.modify(svgObject, "y", this.roundCoordValue(this.parseFloat(svgObjectMemo.y) + deltaCoord.y));
//       this.diagramService.modify(
//         svgObject,
//         "height",
//         this.roundCoordValue(this.parseFloat(svgObjectMemo.height) - deltaCoord.y)
//       );
//     }
//     if (["sw"].includes(handleParams.pos)) {
//       this.diagramService.modify(svgObject, "x", this.roundCoordValue(this.parseFloat(svgObjectMemo.x) + deltaCoord.x));
//       this.diagramService.modify(
//         svgObject,
//         "width",
//         this.roundCoordValue(this.parseFloat(svgObjectMemo.width) - deltaCoord.x)
//       );
//       this.diagramService.modify(
//         svgObject,
//         "height",
//         this.roundCoordValue(this.parseFloat(svgObjectMemo.height) + deltaCoord.y)
//       );
//     }
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export class PolylineHandleController extends AbstractHandleController {
//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
//     const handleParams = this.handleParams;
//     this.svgObjectService.geometryService.movePointOfPolyLineSvgObject(
//       svgObject,
//       svgObjectMemo,
//       deltaCoord,
//       handleParams.indexes,
//       doRound
//     );
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export class PathHandleController extends AbstractHandleController {
//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
//     const handleParams = this.handleParams;
//     this.svgObjectService.geometryService.movePointOfPathSvgObject(
//       svgObject,
//       svgObjectMemo,
//       deltaCoord,
//       handleParams.indexes,
//       doRound
//     );
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export class MappingHandleController extends AbstractHandleController {
//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
//     const handleParams = this.handleParams;
//     const point = {
//       x: this.parseInt(svgObjectMemo[handleParams.xMapping]),
//       y: this.parseInt(svgObjectMemo[handleParams.yMapping]),
//     };
//     let coord = { x: point.x + deltaCoord.x, y: point.y + deltaCoord.y };
//     if (doRound) {
//       coord = this.roundCoord(coord);
//     }
//     this.diagramService.modify(svgObject, handleParams.xMapping, coord.x);
//     this.diagramService.modify(svgObject, handleParams.yMapping, coord.y);
//   }
// }

// // tslint:disable-next-line: max-classes-per-file
// export class LinkHandleController extends AbstractHandleController {
//   link: any;
//   linkMemo: any;

//   linkPattern: any = {
//     type: "group",
//     //    parent: null,
//     selType: "polyline",
//     x: 0,
//     y: 0,
//     isLink: true,
//     svgObjects: [
//       {
//         type: "polyline",
//         //        parent: null,
//         x: 0,
//         y: 0,
//         points: "0,0 0,0",
//         style: "stroke-width: 2; stroke: #f00",
//       },
//     ],
//   };

//   public moveSvgObjectHandle(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
//     if (!this.link) {
//       const link = cloneDeep(this.linkPattern);
//       link.x = svgObject.x;
//       link.y = svgObject.y;
//       svgObject.parent.svgObjects.push(link);
//       this.svgObjectService.initService.initSvgObjectRec(link, svgObject.parent, this.toolService.getDiagram());
//       this.toolService.selectionService.selectSvgObjects([link]);
//       this.link = link;
//       this.linkMemo = cloneDeep(this.link);
//     }
//     this.svgObjectService.geometryService.movePointOfPolyLineSvgObject(
//       this.link,
//       this.linkMemo,
//       deltaCoord,
//       [-1],
//       doRound
//     );
//   }
// }
