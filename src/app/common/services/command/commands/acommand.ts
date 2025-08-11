import { ICommand } from "./icommand";
import { IServicesService } from "../../../../services/services/iservices.service";
import { ServicesServiceSingleton } from "src/app/services/services/services-service.singleton";
import { ServicesConst } from "src/app/services/services/services.const";
import { ITranslateService } from "src/app/services/translate/translate.service";

export abstract class AbstractCommand implements ICommand {
  protected servicesService: IServicesService;
  protected translateService: ITranslateService;

  constructor(protected description: string = null) {
    this.servicesService = ServicesServiceSingleton.instance;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
  }

  public getDescription(): string {
    return this.translateService.translateFromMap(this.description);
  }

  public getOptions(): any {
    return null;
  }

  public abstract execute(): boolean;

  public canExecute(): boolean {
    return true;
  }

  public undo() {}

  public redo() {
    this.execute();
  }
}
