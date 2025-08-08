/**
 * Interface of a service
 */
// tslint:disable-next-line: no-empty-interface
export interface IService {}

/**
 * Interface of a service getter
 */
export interface IServiceGetter {
  getService(id: string): IService | undefined;
}

/**
 * Interface of the ServicesService
 */
export interface IServicesService extends IServiceGetter {
  addService(id: string, service: IService): IService;
  getService(id: string): IService | undefined;
  initServices();
}
