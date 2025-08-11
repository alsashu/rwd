import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IModelService } from "src/app/services/model/model.service";
import { ISelectionService } from "src/app/common/services/selection/selection.service";

/**
 * Close selected project command
 */
export class CloseProjectCommand extends AbstractCommand {
  /**
   * Constructor
   */
  constructor() {
    super("Close Project");
  }

  /**
   * Execute the command
   * @returns False
   */
  public execute(): boolean {
    (this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService).deselectAllObjects();
    (this.servicesService.getService(ServicesConst.ModelService) as IModelService).closeProject();
    return false;
  }

  /**
   * Can execute the command
   * @returns Boolean value
   */
  public canExecute(): boolean {
    return (this.servicesService.getService(ServicesConst.ModelService) as IModelService).getSelectedProject();
  }
}
