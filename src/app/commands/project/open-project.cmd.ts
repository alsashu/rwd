import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IModelService } from "src/app/services/model/model.service";

/**
 * Open project command
 */
export class OpenProjectCommand extends AbstractCommand {
  public params: any = {};

  /**
   * Constructor
   */
  constructor() {
    super("Open Project");
  }

  /**
   * Init function
   * @param params project
   * @returns
   */
  public init(params: any): OpenProjectCommand {
    this.params = params;
    return this;
  }

  /**
   * Execute command
   * @returns boolean
   */
  public execute(): boolean {
    const modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    modelService.closeProject();
    if (this.params) {
      modelService.openProject(this.params.project);
    }
    return false;
  }

  /**
   * Can execute
   * @returns true if can be executed
   */
  public canExecute(): boolean {
    return true;
  }

  /**
   * Get the command description
   * @returns
   */
  public getDescription(): string {
    let res = this.translateService.translateFromMap("Open Project");
    if (this.params && this.params.project && this.params.project.label) {
      res += " " + this.params.project.label;
    }
    return res;
  }
}
