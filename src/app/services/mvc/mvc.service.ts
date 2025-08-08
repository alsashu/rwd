import { EventEmitter } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ICommandEvent, CommandEventConst, ICommandService } from "src/app/common/services/command/command.service";
import { IMvcService } from "./imvc.service";
import { IServicesService } from "../services/iservices.service";
import { MvcConst } from "./mvc.const";
import { ServicesConst } from "../services/services.const";
import { IInjectableUtilsService } from "../injectable/injectable-utils.service";

export class MvcService implements IMvcService {
  public mvcEvent = new EventEmitter<any>();
  public ngxService: NgxUiLoaderService;

  constructor(public servicesService: IServicesService) {}

  public initService() {
    this.ngxService = (
      this.servicesService.getService(ServicesConst.InjectableUtilsService) as IInjectableUtilsService
    ).ngxService;

    this.init(this.servicesService.getService(ServicesConst.CommandService) as ICommandService);
  }

  public init(commandService: ICommandService) {
    // Mapping command service events
    commandService.eventEmitter.on("event", (event: ICommandEvent) => {
      if (CommandEventConst.CommandExecuteUndoOrRedo.includes(event.eventType)) {
        this.emit({ type: MvcConst.MSG_COMMAND_EXECUTE, event });
      }
      this.emit({ type: MvcConst.MSG_COMMAND_EVENT, event });
    });
  }

  public emit(mvcMessage: any) {
    console.log(">> mvc", mvcMessage && mvcMessage.type ? mvcMessage.type : "?", mvcMessage);
    this.mvcEvent.emit(mvcMessage);
  }

  // TODO: use another service...
  public startLoader() {
    if (this.ngxService) {
      this.ngxService.start();
    }
  }

  public stopLoader() {
    if (this.ngxService) {
      this.ngxService.stopAll();
    }
  }
}
