import { DeleteCommand } from "../../commands/delete.cmd";
import { CompositeCommand } from "../../common/services/command/commands/composite.cmd";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { IClipboardService } from "src/app/common/services/clipboard/clipboard.service";

export class CutCommand extends CompositeCommand {
  constructor() {
    super([], "Cut");
  }

  execute(): boolean {
    if (!this.commands.length) {
      const selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
      const clipboardService = this.servicesService.getService(ServicesConst.ClipboardService) as IClipboardService;

      const objects = selectionService.getSelectedObjects();
      //TODO clipboard memo
      clipboardService.setObjects(objects);
      this.commands = [new DeleteCommand().initFromObjectList(objects)];
      selectionService.deselectAllObjects();
    }
    return super.execute();
  }
}
