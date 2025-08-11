import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IUploadProjectService } from "src/app/services/import-export/upload-project.service";

export class UploadProjectCommand extends AbstractCommand {
  public params: any = {};

  constructor() {
    super("Upload Project");
  }

  public init(params: any): UploadProjectCommand {
    this.params = params;
    return this;
  }

  public execute(): boolean {
    (this.servicesService.getService(ServicesConst.UploadProjectService) as IUploadProjectService).uploadProject();
    return false;
  }

  public canExecute(): boolean {
    return true;
  }
}
