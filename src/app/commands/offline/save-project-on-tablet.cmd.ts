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
export class SaveProjectOnTabletCommand extends AbstractCommand {
  public params: any = {};

  constructor() {
    super("Save Project locally on tablet for offline mode use");
  }

  /**
   * Execute command
   * @returns boolean
   */
  public execute(): boolean {
    const mvcService: IMvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    const messageService: IMessageService = this.servicesService.getService(
      ServicesConst.MessageService
    ) as IMessageService;
    const translateService: ITranslateService = this.servicesService.getService(
      ServicesConst.TranslateService
    ) as ITranslateService;

    mvcService.startLoader();
    (this.servicesService.getService(ServicesConst.ModelLoadSaveService) as IModelLoadSaveService)
      .saveSelectedProjectOnTablet()
      .subscribe(
        (data: any) => {
          mvcService.stopLoader();
        },
        (error: any) => {
          console.error("Error saving project:", error);
          messageService.addTextMessage(
            translateService.translateFromMap("Error during saving project:") + " " + (error ? error.message : "")
          );
          mvcService.stopLoader();
        },
        (data: any) => {
          mvcService.stopLoader();
        }
      );

    return false;
  }

  /**
   * Can execute
   * @returns true if can be executed
   */
  public canExecute(): boolean {
    // TODO
    return (this.servicesService.getService(ServicesConst.ModelService) as IModelService).getSelectedProject();
  }
}
