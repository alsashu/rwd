import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { ICompareService } from "src/app/services/compare/compare.service";
import { IModelService } from "src/app/services/model/model.service";

/**
 * Set a project for comparison command
 */
export class SetProjectToComparisonCommand extends AbstractCommand {
  /**
   * Constructor
   */
  constructor() {
    super("Set project for comparison");
  }

  /**
   * Execute the command
   * @returns False
   */
  public execute(): boolean {
    const selectedObjectAsAProject = this.getSelectedObjectAsAProject();
    if (selectedObjectAsAProject) {
      (
        this.servicesService.getService(ServicesConst.CompareService) as ICompareService
      ).compareSelectedProjectWithAProject(selectedObjectAsAProject);
    }
    return false;
  }

  /**
   * Can execute the command
   * @returns Boolean value
   */
  public canExecute(): boolean {
    return (
      (this.servicesService.getService(ServicesConst.ModelService) as IModelService).getSelectedProject() &&
      this.getSelectedObjectAsAProject()
    );
  }

  /**
   * Get the selected object if it is a project
   * @returns The selected project, null is not
   */
  private getSelectedObjectAsAProject(): any {
    const selectedObject = (this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService)
      .getSelectedObjects()
      .find((o: any) => true);
    return selectedObject && selectedObject.type === ModelConstService.PROJECT_TYPE ? selectedObject : null;
  }
}
