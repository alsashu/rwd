import { SelectionService } from '../common/services/selection/selection.service';
import { IBoFactoryService, BoFactoryService } from '../common/services/bo-factory/bo-factory.service';
import { QueryService } from '../services/transaction/query.service';
import { TransactionCommand } from './transaction.cmd';
import { ServicesConst } from '../services/services/services.const';

export class CreateCommand extends TransactionCommand {
  selectionService: SelectionService;
  boFactoryService: IBoFactoryService;

  public params: any[] = [];

  constructor() {
    super("Création objets");
    this.selectionService = <SelectionService>this.servicesService.getService(ServicesConst.SelectionService);
    this.boFactoryService = <BoFactoryService>this.servicesService.getService(ServicesConst.BoFactoryService);
  }

  init(
    // [{ parentList: pl, object: o, versionId: id, }]
    params: any[],
  ): CreateCommand {
    this.params = params;
    return this;
  }

  initFromType(
    // [{ parentList: pl, type: o, versionId: id, }]
    params: any[],
  ): CreateCommand {
    let tmpParams: any[] = [];
    params.forEach( (param) => {
      let tmpParam = {
        parentList: param.parentList,
        parent: param.parent,
        propertyName: param.propertyName,
        object: this.boFactoryService.buildBOFromType(param.type, { versionId: param.versionId }),
      };
      console.log(">> initFromType", tmpParam);

      if (tmpParam.parentList && tmpParam.parentList.forEach && tmpParam.object) {
         tmpParams.push(tmpParam);
      } 
      else if (tmpParam.parent && tmpParam.propertyName && tmpParam.object) {
        tmpParams.push(tmpParam);
      }
    });
    this.params = tmpParams;
    return this;
  }

  initFromParams(params: any): CreateCommand {
    let tmpParams: any[] = [];
    if (params.objects && (params.parentList || (params.parent && params.propertyName))) {
      params.objects.forEach(object => {
        tmpParams.push({
          parentList: params.parentList,
          parent: params.parent,
          propertyName: params.propertyName,
          object: object,
        });
      });
      this.params = tmpParams;
    }
    return this;
  }

  getObjects() {
    let res = [];
    this.params.forEach(param => res.push(param.object));
    return res;
  }

  doExecute(qs: QueryService): boolean {
    let res = false;
    if (this.params) {
      let objects = [];
      this.params.forEach( (param) => {
        if (param.parent) {
          qs.add(param.parent, param.propertyName, param.object);
        }
        else {
          qs.add(param.parentList, null, param.object);
        }
        objects.push(param.object);
        //console.log(">> CreateCommand o =", param.object, param.parent, param.propertyName);
      });
      this.selectionService.selectObjects(objects);
      res = true;  
    }
    return res;
  }
}

