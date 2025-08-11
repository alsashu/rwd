import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { ServicesConst } from "src/app/services/services/services.const";
import { IWikiService } from "src/app/services/wiki/wiki.service";

/**
 * Generate project documentation command
 */
export class GenerateDocCommand extends AbstractCommand {
  public params: any = null;

  constructor() {
    super("Generate project documentation");
  }

  public init(params: any): GenerateDocCommand {
    this.params = params;
    return this;
  }

  public execute(): boolean {
    if (this.params) {
      (this.servicesService.getService(ServicesConst.WikiService) as IWikiService).generateProjectDocumentation(
        this.params.projectId,
        this.params.languageCode,
        this.params.templateDir
      );
    }
    return false;
  }

  public canExecute(): boolean {
    return true;
  }
}
