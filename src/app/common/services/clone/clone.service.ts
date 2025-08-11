import { cloneDeep } from "lodash";
import { v4 as uuid } from "uuid";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ModelService } from "../../../services/model/model.service";
import { ServicesConst } from "src/app/services/services/services.const";

export class CloneService {
  private modelService: ModelService;

  constructor(private servicesService: IServicesService) {
    this.modelService = <ModelService>this.servicesService.getService(ServicesConst.ModelService);
  }

  cloneObjects(objects: any[]): any[] {
    let res = [];
    if (objects && objects.forEach) {
      objects.forEach((o) => {
        let clone = this.cloneObject(o);
        if (clone) {
          res.push(clone);
        }
      });
    }
    return res;
  }

  cloneObject(object: any): any {
    let clone = this.buildClone(object);
    let res = this.modelService.addObject(clone);
    return res ? clone : null;
  }

  buildClone(object: any) {
    let clone = null;
    if (object) {
      clone = cloneDeep(object);
      clone.id = uuid();
      clone.label += " copie";
    }
    return clone;
  }
}
