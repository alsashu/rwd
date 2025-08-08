import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { ICompareService } from "src/app/services/compare/compare.service";
import { IModelService } from "src/app/services/model/model.service";

/**
 * Add a project to comparison command
 */
export class AddProjectToComparisonCommand extends AbstractCommand {
  /**
   * Constructor
   */
  constructor() {
    super("Add project to comparison");
  }

  /**
   * Execute the command
   * @returns False
   */
  public execute(): boolean {
    const selectedObject = (this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService)
      .getSelectedObjects()
      .find((o: any) => true);
    if (selectedObject && selectedObject.type === ModelConstService.PROJECT_TYPE) {
      (
        this.servicesService.getService(ServicesConst.CompareService) as ICompareService
      ).compareSelectedProjectWithAProject(selectedObject, true);
    }
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
