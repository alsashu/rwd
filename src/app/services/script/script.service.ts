import { IServicesService } from "../../services/services/iservices.service";
import { ModelService } from "../../services/model/model.service";
import { MessageService } from "../../services/message/message.service";
import { ServicesConst } from "../services/services.const";
import { ServicesServiceSingleton } from "../services/services-service.singleton";

export interface IScriptService {
  execute(scriptId: string, context?: any): any;
  executeScript(script: any, context?: any): any;
  executeCode(code: any, context?: any): any;
}

export class ScriptService implements IScriptService {
  private modelService: ModelService;
  private messageService: MessageService;

  constructor(public servicesService: IServicesService) {}

  public initService() {
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.messageService = this.servicesService.getService(ServicesConst.MessageService) as MessageService;
  }

  public execute(scriptId: string, context: any = null): any {
    const res = null;
    /* TODO
    console.log("ScriptService.execute", scriptId);
    let script = this.modelService.getObjectById(this.modelService.model, scriptId);
    if (!script) {
      script = this.svgLibraryService.getScriptById(scriptId);
    }
    if (script && script.code) {
      res = this.executeCode(script.code, context);
    } else {
      console.log("ScriptService.execute Script not found", scriptId, script);
    }
*/
    return res;
  }

  public executeScript(script: any, context: any = null): any {
    let res = null;
    if (script && script.code) {
      res = this.executeCode(script.code, context);
    }
    return res;
  }

  public executeCode(code: any, context: any = null): any {
    let res = null;
    try {
      if (!this.servicesService) {
        this.servicesService = ServicesServiceSingleton.instance;
      }
      const scriptContext = {
        servicesService: this.servicesService,
        context,
      };
      const servicesService = this.servicesService;
      const modelService = this.modelService;
      res = eval(code);
      this.messageService.addTextMessage("Exécution script. Résultat = " + String(res == undefined ? "ok" : res));
    } catch (e) {
      console.log(e);
      this.messageService.addExceptionMessage(e);
    }
    return res;
  }
}
