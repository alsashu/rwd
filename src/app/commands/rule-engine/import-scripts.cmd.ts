import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";

export class ImportScriptsCommand extends AbstractCommand {
  constructor() {
    super("Import rule engine scripts");
  }

  public execute(): boolean {
    console.log("ImportScriptsCommand");
    // (this.servicesService.getService(ServicesConst.ModelService) as IModelService).deselectProject();
    return false;
  }

  public canExecute(): boolean {
    return true;
  }
}
