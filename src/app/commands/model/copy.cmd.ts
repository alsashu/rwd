import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IClipboardService } from "src/app/common/services/clipboard/clipboard.service";
import { ISelectionService } from "src/app/common/services/selection/selection.service";

export class CopyCommand extends AbstractCommand {
  constructor() {
    super("Copy");
  }

  execute(): boolean {
    (this.servicesService.getService(ServicesConst.ClipboardService) as IClipboardService).setObjects(
      (this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService).getSelectedObjects()
    );
    return false;
  }
}
