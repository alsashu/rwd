import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { cloneDeep } from "lodash";
import { SvgConstService } from "src/app/services/svg/svg-const.service";
import { IHandleController } from "../handle/handle.service";

export class LinkingTool extends Tool {
  public movingData = {
    movingSvgObjects: [],
    movingSvgObjectsMemo: [],
  };

  public link: any;
  public linkPattern: any = {
    type: "group",
    selType: "polyline",
    isLink: true,
    x: 0,
    y: 0,
    points: "0,0 0,0",
    parent: null,
    svgObjects: [
      {
        x: 0,
        y: 0,
        type: "polyline",
        parent: null,
        points: "0,0 0,0",
        strokeWidth: 2,
        stroke: "#a00",
        fill: "none",
        //        style: "stroke-width: 2; stroke: #f00",
      },
    ],
  };

  public handle = { type: SvgConstService.POLYLINE_HANDLE, x: 0, y: 0, indexes: [0] };
  public handleController: IHandleController;

  constructor(toolManager: IToolManager) {
    super("LinkingTool", toolManager);
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
        !draggingData.mouseDownHandleSvgObject &&
        draggingData.mouseDownPrimitiveSvgObject &&
        draggingData.mouseDownPrimitiveSvgObject.isPort &&
        !draggingData.mouseDownPrimitiveSvgObject.isMovable;
    }
    return res;
  }

  public doStart(): void {
    const draggingData = this.draggingData;
    const svgObject = draggingData.mouseDownSvgObject;
    const primitiveSvgObject = draggingData.mouseDownPrimitiveSvgObject;

    this.movingData.movingSvgObjects = [];
    if (svgObject && primitiveSvgObject) {
      if (svgObject.parent) {
        const link = cloneDeep(this.linkPattern);
        link.x = primitiveSvgObject.x + svgObject.x;
        link.y = primitiveSvgObject.y + svgObject.y;
        this.diagramService.addSvgObject(link, svgObject.parent);
        this.selectionService.selectSvgObjects([link]);
        this.movingData.movingSvgObjects = [link];
        this.link = link;
      }
    }
    this.movingData.movingSvgObjectsMemo = cloneDeep(this.movingData.movingSvgObjects);

    this.handleController = this.toolService.handleService.buildHandleController(this.handle, this.toolService);
    this.handleController.doStart();
  }

  public doMouseMove(): void {
    this.handleController.doMouseMove(this.movingData);
  }

  public doMouseUp(): void {
    this.handleController.doMouseUp(this.movingData);
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
