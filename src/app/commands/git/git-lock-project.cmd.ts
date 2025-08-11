import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IGitService } from "src/app/services/git/git-service";

/**
 * Git Lock a project command
 */
export class GitLockProjectCommand extends AbstractCommand {
  /**
   * Constructor
   */
  constructor() {
    super("GitLock Project");
  }

  /**
   * Execute the command
   * @returns False
   */
  public execute(): boolean {
    const selectedObject = (this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService)
      .getSelectedObjects()
      .find((o: any) => true);
    // (this.servicesService.getService(ServicesConst.GitService) as IGitService).gitLockProject(selectedObject);
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
    return selectedObject && selectedObject.type === ModelConstService.PROJECT_TYPE && selectedObject.isGitProject;
  }
}
