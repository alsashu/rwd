import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";
import { SvgConstService } from "../../svg-object/svg-const.service";
import { DiagramEvent } from "../../diagram/diagram-event";

export class PolylinePointTool extends Tool {
  constructor(toolManager: IToolManager) {
    super("PolylinePointTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      const selectedObjects = this.selectionService.getSelectedSvgObjects();
      //        .filter((svg) => !(svg.isVisible === false) && !(svg.isEnabled === false));
      if (selectedObjects.length === 1) {
        const svgObject = selectedObjects[0];
        if ([SvgConstService.POLYLINE_SEL_TYPE, SvgConstService.PATH_SEL_TYPE].includes(svgObject.selType)) {
          res =
            ["mouseUp"].includes(lastEvent.simpleType) &&
            lastEvent.event.altKey &&
            draggingData.isMouseDown &&
            draggingData.mouseDownButtons & 1 &&
            !draggingData.isMouseMoving;
        }
      }
    }
    return res;
  }

  public doMouseUp(): void {
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent && lastEvent.event) {
      const draggingData = this.toolService.draggingData;
      // if (!lastEvent.event.altKey) {
      //   if (lastEvent.event.ctrlKey) {
      //     if (draggingData.mouseDownSvgObject) {
      //       this.selectionService.toggleSvgObjectSelection(draggingData.mouseDownSvgObject);
      //     }
      //   } else {
      //     const selectedObjects = (draggingData.mouseDownSvgObject ? [draggingData.mouseDownSvgObject] : []).filter(
      //       (svg: any) => !(svg.isVisible === false) && !(svg.isEnabled === false)
      //     );
      //     this.selectionService.selectSvgObjects(selectedObjects);
      //   }
      // } else {
      // Alt key: add / delete polyline point
      const selectedObjects = this.selectionService
        .getSelectedSvgObjects()
        .filter((svg) => !(svg.isVisible === false) && !(svg.isEnabled === false));

      if (selectedObjects.length === 1) {
        const svgObject = selectedObjects[0];
        if ([SvgConstService.POLYLINE_SEL_TYPE, SvgConstService.PATH_SEL_TYPE].includes(svgObject.selType)) {
          if (draggingData.mouseDownHandleSvgObject) {
            // console.log(">> handle !", draggingData.mouseDownHandleSvgObject);
            this.svgObjectService.geometryService.deleteHandlePoint(svgObject, draggingData.mouseDownHandleSvgObject);
          } else {
            const coord = this.diagramService.zoomScrollService.getMousePositionFromLayer(lastEvent.event);
            this.svgObjectService.geometryService.addPointToSvgObject(svgObject, coord);
          }
        }
      }
      // }
    }
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
