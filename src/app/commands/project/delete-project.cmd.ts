import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IModelService } from "src/app/services/model/model.service";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { ModelConstService } from "src/app/services/model/model-const.service";

/**
 * Delete selected project command
 */
export class DeleteProjectCommand extends AbstractCommand {
  /**
   * Constructor
   */
  constructor() {
    super("Delete Project");
  }

  /**
   * Execute the command
   * @returns False
   */
  public execute(): boolean {
    const selectedObject = (this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService)
      .getSelectedObjects()
      .find((o: any) => true);
    (this.servicesService.getService(ServicesConst.ModelService) as IModelService).deleteProjectFromServer(
      selectedObject
    );
    return false;
  }

  /**
   * Can execute the command
   * @returns Boolean value
   */
  public canExecute(): boolean {
    const selectedObject = (this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService)
      .getSelectedObjects()
      .find((o: any) => true);
    return selectedObject && selectedObject.type === ModelConstService.PROJECT_TYPE;
  }
}
