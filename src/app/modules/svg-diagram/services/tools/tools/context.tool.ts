import { SvgDiagramEvent } from "../../diagram/svg-diagram-event";
import { Tool } from "../tool";
import { IToolManager } from "../tool.manager";

export class ContextTool extends Tool {
  constructor(toolManager: IToolManager) {
    super("ContextTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      res =
        ["mouseUp"].includes(lastEvent.simpleType) &&
        draggingData.isMouseDown &&
        draggingData.mouseDownButtons & 2 &&
        !draggingData.isMouseMoving;
    }
    return res;
  }

  public doMouseUp(): void {
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      // If right click outside selection, select object under mouse
      const draggingData = this.toolService.draggingData;
      if (draggingData.mouseDownSvgObject) {
        const mouseDownSvgObjectIsSelected = this.svgDiagramService.selectionService.getIsSelected(
          draggingData.mouseDownSvgObject
        );
        // console.log(">> ContextTool.doMouseUp", draggingData.mouseDownSvgObject, mouseDownSvgObjectIsSelected);

        if (mouseDownSvgObjectIsSelected !== true) {
          this.selectionService.selectSvgObjects([draggingData.mouseDownSvgObject]);
          // this.svgDiagramService.emitDiagramEvent(
          //   new SvgDiagramEvent({
          //     type: SvgDiagramEvent.ObjectSingleClicked,
          //     object: this.svgDiagramService.diagram,
          //     subject: this.svgDiagramService.selectionService.getSelectedSvgObjects(),
          //     params: lastEvent,
          //   })
          // );
        }
      }

      this.svgDiagramService.emitDiagramEvent(
        new SvgDiagramEvent({
          type: SvgDiagramEvent.ObjectContextClicked,
          object: this.svgDiagramService.diagram,
          subject: this.svgDiagramService.selectionService.getSelectedSvgObjects(),
          params: lastEvent,
        })
      );
    }
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
