import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { IModalViewService } from "src/app/services/modal/imodal-view.service";
import { ICommandService } from "src/app/common/services/command/command.service";
import { IMvcService } from "src/app/services/mvc/imvc.service";

/**
 * Synchronize Project saved locally on tablet with server
 * */
export class SynchronizeProjectWithServerCommand extends AbstractCommand {
  public params: any = {};

  constructor() {
    super("Synchronize project saved locally on tablet with server");
  }

  /**
   * Init function
   * @param params project
   * @returns
   */
  public init(params: any): SynchronizeProjectWithServerCommand {
    this.params = params;
    return this;
  }

  /**
   * Execute command
   * @returns boolean
   */
  public execute(): boolean {
    if (this.params) {
      const mvcService: IMvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
      const modalViewService = this.servicesService.getService(ServicesConst.ModalViewService) as IModalViewService;
      modalViewService.openMessageModalComponent(
        {
          message: this.translateService.translateFromMap(
            "Do you want to save the verification data from the tablet to the server (It will erase the server verification data)?"
          ),
        },
        () => {
          mvcService.startLoader();
          (this.servicesService.getService(ServicesConst.CommandService) as ICommandService).emitAfterExecuteCommand(
            this,
            true
          );
          (
            this.servicesService.getService(ServicesConst.ModelLoadSaveService) as IModelLoadSaveService
          ).synchroniseProjectFromTablet(this.params.project, () => {
            mvcService.stopLoader();
          });
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

  /**
   * Get options
   * @returns
   */
  public getOptions(): any {
    return {
      doNotNotify: true,
      // notifyCB: () => {
      //   console.log("ok");
      // },
    };
  }
}
