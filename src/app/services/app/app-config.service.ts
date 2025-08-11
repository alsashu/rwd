import { IApiService } from "../api/api.service";
import { IMvcService } from "../mvc/imvc.service";
import { MvcConst } from "../mvc/mvc.const";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { AppConfigConst } from "./app-config-const.service";

/**
 * Interface of Config file
 */
export interface IConfigFile {
  minimalPwdLength: number;
  wikiTemplates: any[];
  ssoClientIdConfig: any[];
}

/**
 * Interface of AppConfigService
 */
export interface IAppConfigService {
  configFile: IConfigFile;
  getConfig();
  loadConfigFile();
  getVersion();
}

/**
 * Application config service
 */
export class AppConfigService implements IAppConfigService {
  private version = "2.5.0";

  public configFile: IConfigFile;
  private apiService: IApiService;
  private mvcService: IMvcService;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(public servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    this.loadConfigFile();
  }

  /**
   * Get the config
   * @returns The config
   */
  public getConfig() {
    return AppConfigConst.config;
  }

  /**
   * Load the config
   */
  public loadConfigFile() {
    const url = "assets/config.json";
    this.mvcService.emit({ type: MvcConst.MSG_START_LOADING_APP_CONFIG });
    this.apiService.loadFile(url).subscribe((res: any) => {
      this.configFile = res;
      this.mvcService.emit({ type: MvcConst.MSG_END_LOADING_APP_CONFIG, config: this.configFile });
    });
  }

  /**
   * Get app version
   * @returns String value
   */
  public getVersion() {
    return this.version;
  }
}
