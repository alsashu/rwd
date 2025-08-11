import { QueryService } from "../services/transaction/query.service";
import { TransactionCommand } from "./transaction.cmd";
import { SelectionService } from "src/app/common/services/selection/selection.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ModelService } from "src/app/services/model/model.service";

export class DeleteCommand extends TransactionCommand {
  private selectionService: SelectionService;
  private modelService: ModelService;

  constructor(
    // [{ parentList: pl, object: o, }]
    public params: any[] = []
  ) {
    super("Suppression");
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as SelectionService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
  }

  public init(
    // [{ parentList: pl, object: o, }]
    params: any[]
  ): DeleteCommand {
    this.params = params;
    return this;
  }

  public initFromObjectList(objectList): DeleteCommand {
    if (objectList && objectList.forEach) {
      const params = [];
      objectList.forEach((o: any) => {
        const pl = this.modelService.getParentListFromObject(this.modelService.getModel(), o);
        if (pl) {
          params.push({ parentList: pl, object: o });
        } else {
        }
      });
      this.params = params;
    }
    return this;
  }

  public initFromSelection(): DeleteCommand {
    return this.initFromObjectList(this.selectionService.getSelectedObjects());
  }

  public doExecute(qs: QueryService): boolean {
    let res = false;
    if (this.params && this.params.forEach) {
      this.params.forEach((param) => {
        if (param.parentList && param.parentList.forEach) {
          qs.remove(param.parentList, null, param.object);
        } else if (param.parent && param.propertyName) {
          qs.remove(param.parent, param.propertyName, param.object);
        }
      });
      res = true;
    }
    return res;
  }
}
