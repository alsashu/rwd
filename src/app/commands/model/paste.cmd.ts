import { cloneDeep } from "lodash";
import { CompositeCommand } from "../../common/services/command/commands/composite.cmd";
import { CreateCommand } from "../../commands/create.cmd";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { IModelService } from "src/app/services/model/model.service";
import { IClipboardService } from "src/app/common/services/clipboard/clipboard.service";

export class PasteCommand extends CompositeCommand {
  private selectionService: ISelectionService;
  private clipboardService: IClipboardService;
  private modelService: IModelService;

  private pasteObjects = null;

  constructor() {
    super([], "Paste");
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.clipboardService = this.servicesService.getService(ServicesConst.ClipboardService) as IClipboardService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
  }

  public execute(): boolean {
    if (!this.pasteObjects) {
      this.pasteObjects = [];
      const selectedObjects = this.selectionService.getSelectedObjects();
      if (selectedObjects.length === 1) {
        const selectedObject = selectedObjects[0];
        if (selectedObject.forEach) {
          const clipboardObjects = this.clipboardService.getObjects();
          //          this.pasteObjects = this.cloneService.cloneObjects(clipboardObjects);

          this.pasteObjects = cloneDeep(clipboardObjects);
          this.modelService.reNewObjectsIds(this.pasteObjects);

          // let qs = this.servicesService.queryService;
          // qs.commit(qs => {
          //   qs.addObjects(this.pasteObject, parent, propertyName);
          //   this.selectionService.selectSvgObjects(this.pasteObjects);
          // });

          //TODO renew labels
          this.commands = [
            new CreateCommand().initFromParams({ objects: this.pasteObjects, parentList: selectedObject }),
          ];
        }
      }
    }
    return super.execute();
  }
}
