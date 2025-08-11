import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IGitService } from "src/app/services/git/git-service";
import { ModelConstService } from "src/app/services/model/model-const.service";

/**
 * GitClone a project command
 */
export class GitCloneProjectCommand extends AbstractCommand {
  /**
   * Constructor
   */
  constructor() {
    super("GitClone Project");
  }

  /**
   * Execute the command
   * @returns False
   */
  public execute(): boolean {
    (this.servicesService.getService(ServicesConst.GitService) as IGitService).gitCloneProject();
    return false;
  }

  /**
   * Can execute the command
   * @returns Boolean value
   */
  public canExecute(): boolean {
    return true;
  }
}
