import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { IModelService } from "src/app/services/model/model.service";
import { IMvcService } from "src/app/services/mvc/imvc.service";
import { IMessageService } from "src/app/services/message/message.service";
import { ITranslateService } from "src/app/services/translate/translate.service";
import { IModalViewService } from "src/app/services/modal/imodal-view.service";

/**
 * Delete project from tablet
 */
export class DeleteProjectFromTabletCommand extends AbstractCommand {
  public params: any = {};

  constructor() {
    super("Delete project from tablet");
  }

  /**
   * Init function
   * @param params project
   * @returns
   */
  public init(params: any): DeleteProjectFromTabletCommand {
    this.params = params;
    return this;
  }

  /**
   * Execute command
   * @returns boolean
   */
  public execute(): boolean {
    if (this.params) {
      const modalViewService = this.servicesService.getService(ServicesConst.ModalViewService) as IModalViewService;
      modalViewService.openMessageModalComponent(
        {
          message: this.translateService.translateFromMap(
            "Do you want to delete the selected project from the tablet?"
          ),
        },
        () => {
          (
            this.servicesService.getService(ServicesConst.ModelLoadSaveService) as IModelLoadSaveService
          ).deleteProjectFromTablet(this.params.project);
        }
      );
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
