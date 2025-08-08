import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IDownloadProjectService } from "src/app/services/import-export/download-project.service";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { ISelectionService } from "src/app/common/services/selection/selection.service";

/**
 * Download a project command
 */
export class DownloadProjectCommand extends AbstractCommand {
  public params: any = {};

  /**
   * Constructor
   */
  constructor() {
    super("Download Project");
  }

  /**
   * Execute the command
   * @returns
   */
  public execute(): boolean {
    const selectedObjectAsAProject = this.getSelectedObjectAsAProject();
    if (selectedObjectAsAProject) {
      (
        this.servicesService.getService(ServicesConst.DownloadProjectService) as IDownloadProjectService
      ).downloadProject(selectedObjectAsAProject);
    }

    return false;
  }

  /**
   * Tests is the command can be executed
   * @returns
   */
  public canExecute(): boolean {
    return this.getSelectedObjectAsAProject();
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
