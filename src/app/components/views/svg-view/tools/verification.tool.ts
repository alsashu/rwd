import { Tool } from "src/app/modules/svg-diagram/services/tools/tool";
import { IToolManager } from "src/app/modules/svg-diagram/services/tools/tool.manager";
import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { IRightsService } from "src/app/services/rights/rights.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { SvgViewComponent } from "../svg-view.component";

export class VerificationTool extends Tool {
  private modelVerificationService: IModelVerificationService;
  private rightsService: IRightsService;

  constructor(public toolManager: IToolManager, public svgViewComponent: SvgViewComponent) {
    super("VerificationTool", toolManager);
    this.modelVerificationService = this.svgViewComponent.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.rightsService = this.svgViewComponent.servicesService.getService(
      ServicesConst.RightsService
    ) as IRightsService;
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
      if (lastEvent.event.shiftKey && this.rightsService.canWrite(RightsConst.VERIFICATION)) {
        this.modelVerificationService.modifySelectedObjectsVerificationState(
          ModelVerificationService.verificationStateValues.verifiedOK
        );
      } else if (lastEvent.event.altKey) {
        this.modelVerificationService.modifyFirstSelectedObjectVerificationDataViaForm({
          forcedData: { verificationState: ModelVerificationService.verificationStateValues.verifiedNOK },
        });
      } else {
        this.modelVerificationService.modifySelectedObjectsToBeVerifiedValue("toggle");
      }
    }
    this.toolManager.cancelLastEvent();
    this.stopTool();
  }
}
