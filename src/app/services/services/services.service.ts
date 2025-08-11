import { Injectable } from "@angular/core";
import { IService, IServiceGetter, IServicesService } from "./iservices.service";
import { ServicesServiceSingleton } from "./services-service.singleton";
import { ServicesConst } from "./services.const";
import { InjectableUtilsService } from "../injectable/injectable-utils.service";

@Injectable({
  providedIn: "root",
})
/**
 * Service providing services.
 * Services are added to a map and can be retrieved using an id defined in ServicesConst class.
 * Services are initiated when calling initServices
 */
export class ServicesService implements IServicesService, IServiceGetter {
  /**
   * The map of the services
   */
  public serviceMap: Map<string, IService> = new Map<string, IService>();

  /**
   * Constructor
   * @param injectableUtilsService The injectable Utils Service
   */
  constructor(private injectableUtilsService: InjectableUtilsService) {
    ServicesServiceSingleton.instance = this;
    this.addService(ServicesConst.InjectableUtilsService, this.injectableUtilsService);
  }

  /**
   * Add a service
   * @param id The id of the service
   * @param service The service
   * @returns The service
   */
  public addService(id: string, service: IService): IService {
    this.serviceMap.set(id, service);
    return service;
  }

  /**
   * Get a service
   * @param id The id of the service
   * @returns The found service
   */
  public getService(id: string): IService | undefined {
    const service = this.serviceMap.get(id);
    if (!service) {
      console.error("[ServicesService] getService, unknown service :", id);
    }
    return service;
  }

  /**
   * Init the services
   */
  public initServices() {
    this.serviceMap.forEach((service: any, serviceId: string) => {
      if (service.initService !== undefined) {
        service.initService();
      }
    });
  }
}
