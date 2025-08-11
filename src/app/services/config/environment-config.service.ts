import { IServicesService } from "../services/iservices.service";

/**
 * Interface of EnvironmentConfigService
 */
export interface IEnvironmentConfigService {
  setEnvironmentSettings(environmentSettings: any): any;
  getIOMappingBoardTypeData(id: string): any;
}

/**
 * Service managing Environment Config from environmentsettings.tcfg file
 */
export class EnvironmentConfigService implements IEnvironmentConfigService {
  public environmentSettings: any;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(private servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {}

  /**
   * Set the environmentSettings data
   * @param environmentSettings The environment Settings data
   * @returns environmentSettings
   */
  public setEnvironmentSettings(environmentSettings: any): any {
    this.environmentSettings = environmentSettings;
    return environmentSettings;
  }

  /**
   * Get io mapping board type data from board type name
   * @param id The name of the board type
   * @returns The board type data if found
   */
  public getIOMappingBoardTypeData(id: string): any {
    return this.environmentSettings &&
      this.environmentSettings.ioMappingSettings &&
      this.environmentSettings.ioMappingSettings.boardTypes &&
      this.environmentSettings.ioMappingSettings.boardTypes.find
      ? this.environmentSettings.ioMappingSettings.boardTypes.find((bt: any) => bt.name === id)
      : null;
  }
}
