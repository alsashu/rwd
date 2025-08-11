import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { IModelService } from "src/app/services/model/model.service";
import { IMvcService } from "src/app/services/mvc/imvc.service";
import { IMessageService } from "src/app/services/message/message.service";
import { ITranslateService } from "src/app/services/translate/translate.service";

/**
 * Save project to local file system for android app command
 */
export class OpenAndSaveProjectOnTabletCommand extends AbstractCommand {
  public params: any = {};

  constructor() {
    super("Open and save Project locally on tablet for offline mode use");
  }

  /**
   * Init function
   * @param params project
   * @returns
   */
  public init(params: any): OpenAndSaveProjectOnTabletCommand {
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
      modelService.openProjectAndSaveOnTablet(this.params.project);
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
}
