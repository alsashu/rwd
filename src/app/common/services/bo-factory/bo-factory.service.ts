import { IServicesService } from "src/app/services/services/iservices.service";
import { v4 as uuid } from "uuid";

export interface IFactory {
  buildBOFromType(type: string, params?: any): any;
}

export interface IBoFactoryBuilderService {
  build(boFactoryService: IBoFactoryService);
}

export interface IBoFactoryService {
  buildBOFromType(type: string, params?: any): any;
  addFactories(factories: IFactory[]);
  postCreateBo(bo: any, params: any): any;
}

export class BoFactoryService implements IBoFactoryService {
  private factories: IFactory[] = [];

  constructor(public servicesService: IServicesService, boFactoryBuilderService: IBoFactoryBuilderService) {
    boFactoryBuilderService.build(this);
  }

  public initService() {}

  public addFactories(factories: IFactory[]) {
    this.factories = this.factories.concat(factories);
  }

  public buildBOFromType(type: string, params: any = null): any {
    let bo = null;
    this.factories.forEach((factory) => {
      if (!bo) {
        bo = factory.buildBOFromType(type, params);
      }
    });
    //    console.log(">> buildBOFromType", bo, type, params, this.factories);
    return bo;
  }

  public postCreateBo(bo: any, params: any): any {
    if (bo) {
      if (!bo.id) {
        bo.id = uuid();
      }

      if (params) {
        if (params.id) {
          bo.id = params.id;
        }
        if (params.parent) {
          if (!params.parent.id) {
            params.parent.id = uuid();
          }
          bo.parentId = params.parent.id;
          bo.parent = params.parent;
        }
        if (params.label !== undefined) {
          bo.label = params.label;
        }
        if (params.index !== undefined) {
          bo.index = params.index;
        }
        if (params.ioType !== undefined) {
          bo.ioType = params.ioType;
        }
      }
    }
    return bo;
  }
}
