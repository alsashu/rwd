import { Tool } from "src/app/modules/diagram/services/tools/tool";
import { IToolManager } from "src/app/modules/diagram/services/tools/tool.manager";
import { ModelVerificationService } from "src/app/services/model/model-verification.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { GraphicViewComponent } from "../graphic-view.component";

export class VerificationTool extends Tool {
  constructor(public toolManager: IToolManager, public graphicViewComponent: GraphicViewComponent) {
    super("VerificationTool", toolManager);
  }

  public canStart(): boolean {
    let res = false;
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent) {
      const draggingData = this.draggingData;
      if (["mouseUp"].includes(lastEvent.simpleType)) {
        const test = true;
      }
      res =
        ["mouseUp"].includes(lastEvent.simpleType) &&
        draggingData.isMouseDown &&
        draggingData.mouseDownButtons & 4 &&
        !draggingData.isMouseMoving;
    }
    return res;
  }

  public doMouseUp(): void {
    const lastEvent = this.toolManager.lastEvent;
    if (lastEvent && lastEvent.event) {
      const draggingData = this.toolService.draggingData;
      if (lastEvent.event.ctrlKey) {
        if (draggingData.mouseDownSvgObject) {
          this.selectionService.toggleSvgObjectSelection(draggingData.mouseDownSvgObject);
        }
      } else {
        if (draggingData.mouseDownSvgObject && !draggingData.mouseDownSvgObject.isSelected) {
          this.selectionService.selectSvgObjects(
            draggingData.mouseDownSvgObject ? [draggingData.mouseDownSvgObject] : []
          );
        }
      }
      if (lastEvent.event.shiftKey && this.graphicViewComponent.rightsService.canWrite(RightsConst.VERIFICATION)) {
        this.graphicViewComponent.modelVerificationService.modifySelectedObjectsVerificationState(
          ModelVerificationService.verificationStateValues.verifiedOK
        );
      } else if (lastEvent.event.altKey) {
        this.graphicViewComponent.modelVerificationService.modifyFirstSelectedObjectVerificationDataViaForm({
          forcedData: { verificationState: ModelVerificationService.verificationStateValues.verifiedNOK },
        });
      } else {
        this.graphicViewComponent.modelVerificationService.modifySelectedObjectsToBeVerifiedValue("toggle");
      }
    }
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
