import { ScriptService } from '../services/script/script.service';
import { AbstractCommand } from '../common/services/command/commands/acommand';
import { ServicesConst } from '../services/services/services.const';

export class ExecuteScriptCommand extends AbstractCommand {
  private scriptService: ScriptService;

  constructor(
    private scriptId: string,
    private code: string = null,
    ) {
    super("Exécution script");
    this.scriptService = <ScriptService>this.servicesService.getService(ServicesConst.ScriptService);
  }

  public execute(): boolean {
    if (this.code) {
      this.scriptService.executeCode(this.code);
    } else {
      this.scriptService.execute(this.scriptId);
    }
    return false;
  }
}
