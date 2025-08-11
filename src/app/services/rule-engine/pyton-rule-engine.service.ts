import { IApiService } from "../api/api.service";
import { IModelLoadSaveService } from "../model/model-load-save.service";
import { ModelService } from "../model/model.service";
import { IMvcService } from "../mvc/imvc.service";
import { MvcConst } from "../mvc/mvc.const";
import { IRule } from "../rule/rule";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ITranslateService } from "../translate/translate.service";
import { IUserService } from "../user/user.service";

/**
 * Interface of the PythonRuleEngineService
 */
export interface IPythonRuleEngineService {
  executeRules(rules: IRule[]);
}

/**
 * Right editor Python rule engine service
 */
export class PythonRuleEngineService implements IPythonRuleEngineService {
  private apiService: IApiService;
  private modelService: ModelService;
  private modelLoadSaveService: IModelLoadSaveService;
  private userService: IUserService;
  private mvcService: IMvcService;
  private translateService: ITranslateService;

  /**
   * Constructor
   * @param servicesService
   */
  constructor(public servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.modelLoadSaveService = this.servicesService.getService(
      ServicesConst.ModelLoadSaveService
    ) as IModelLoadSaveService;
    this.userService = this.servicesService.getService(ServicesConst.UserService) as IUserService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
  }

  /**
   * Run rules
   * @param rules The rules
   */
  public executeRules(rules: IRule[]) {
    this.doRunRules(rules);
  }

  /**
   * Run the rules
   * @param rules The rules
   */
  private doRunRules(rules: IRule[]) {
    this.setLog(this.translateService.translateFromMap("Running python rule engine..."));

    const project = this.modelService.getSelectedProject();
    const user = this.userService.getCurrentUser();
    if (!project || !project.railMlFileName || !user || !rules || rules.length === 0) {
      return;
    }

    const railMLFileName = project.railMlFileName;
    const projectLabel = project.label;
    const insrcFileName = projectLabel + ".insrc.xml";
    const params = {
      ruleOrder: { rules: [] },
      projectId: project.id,
      projectName: project.projectName,
      projectLabel: project.label,
      path: project.path,
      railMlFileName: project.railMlFileName,
      insrcFileName: insrcFileName,
      userId: user.id,
      filePaths: [
        { scrFileName: railMLFileName, path: "", destFileName: railMLFileName },
        { scrFileName: railMLFileName + ".sha", path: "", destFileName: railMLFileName + ".sha" },
        { scrFileName: insrcFileName, path: "", destFileName: insrcFileName },
        { scrFileName: insrcFileName + ".sha", path: "", destFileName: insrcFileName + ".sha" },
      ],
      rulesArguments: [
        ["railMLFileName", railMLFileName],
        ["insrcFileName", insrcFileName],
      ],
    };

    rules.forEach((rule: IRule) => {
      params.ruleOrder.rules.push({
        id: rule.fileName,
        args: [],
      });
    });

    this.modelLoadSaveService.saveSelectedProject().subscribe((res: any) => {
      this.apiService.executePythonRuleEngine(params).subscribe((res: any) => {
        this.mvcService.emit({ type: MvcConst.MSG_PY_RULE_ENGINE_EXECUTION_END });
        this.apiService.getPythonRuleEngineLogs(params).then((loadedData: any) => {
          this.setLogs(loadedData);
        });
      });
    });
  }

  /**
   * Set the log content
   * @param log Log string content
   */
  private setLog(log: string) {
    this.mvcService.emit({ type: MvcConst.MSG_PY_RULE_ENGINE_LOG_CHANGED, log });
  }

  /**
   * Set the logs content
   * @param logData Logs data
   */
  private setLogs(logData: any) {
    try {
      this.mvcService.emit({
        type: MvcConst.MSG_PY_RULE_ENGINE_LOG_CHANGED,
        log: logData && logData.log ? logData.log : "",
        logData,
      });
    } catch (e) {
      this.mvcService.emit({ type: MvcConst.MSG_PY_RULE_ENGINE_LOG_CHANGED, log: e.toString() });
    }
  }
}
