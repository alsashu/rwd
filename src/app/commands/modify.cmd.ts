import { ICommand } from "../common/services/command/commands/icommand";
import { IServicesService } from "../services/services/iservices.service";
import { ModelService } from "../services/model/model.service";
import { cloneDeep } from "lodash";
import { ServicesConst } from "../services/services/services.const";
import { ServicesServiceSingleton } from "../services/services/services-service.singleton";

export class ModifyCommand implements ICommand {
  private servicesService: IServicesService;
  private modelService: ModelService;

  private propertyListDefault: string[] = [
    "x",
    "y",
    "x1",
    "y1",
    "x2",
    "y2",
    "cx",
    "cy",
    "r",
    "points",
    "d",
    "text",
    "rotate",
    "scale",
    "style",
    "labelX",
    "labelY",
    "label",
    "title",
    "isDeleted",
    "boId",
    "aspects",
    "libraryId",
    "connections",
    "trackId",
    "linkedPointId",
    "trackYIndex",
    "labelVisible",
    "nParentId",
    "pk",
    "absPos",
    "pos",
    "selectedInterfaceDiagramId",
    "selectedTemplateDiagramId",
  ];

  constructor(
    private objectsData: any[] = [], // [ { object: o, objectMemo: om }, ... ]
    private propertyList: string[] = null
  ) {
    this.servicesService = ServicesServiceSingleton.instance;
    this.modelService = <ModelService>this.servicesService.getService(ServicesConst.ModelService);

    this.propertyList = this.propertyList || this.propertyListDefault;
    objectsData.forEach((od: any) => {
      od.objectNew = cloneDeep(od.object);
    });
  }

  public initFromListAndCb(objectList: any[], cb: any, propertyList: string[] = null): ModifyCommand {
    this.propertyList = propertyList || this.propertyListDefault;
    if (objectList && objectList.length) {
      let objectsData = [];
      objectList.forEach((o) => {
        let oMemo = cloneDeep(o);
        if (cb(o)) {
          objectsData.push({
            object: o,
            objectMemo: oMemo,
            objectNew: cloneDeep(o),
          });
        }
      });
      this.objectsData = objectsData;
    }
    return this;
  }

  public getDescription(): string {
    let res = "Modification objet";
    if (this.objectsData && this.objectsData.length > 0) {
      if (this.objectsData.length == 1) {
        res = "Modification de l'objet ";
      } else {
        res = "Modification des objets ";
      }

      let objectList = "";
      let i = 0;
      this.objectsData.forEach((od) => {
        if (od.objectNew && od.objectNew.label) {
          if (i < 3) {
            if (objectList != "") {
              objectList += ", ";
            }
            objectList += od.objectNew.label;
          } else if (i == 4) {
            objectList += ", ...";
          }
          i++;
        }
      });
      res += objectList;
    }
    return res;
  }

  public getOptions() {
    return null;
  }

  public applyModificationsToObject(org: any, dest: any, memo: any = null): any {
    //TODO delete removed properties
    //TODO update links => require version
    let res = false;
    this.propertyList.forEach((property) => {
      if (dest[property] != undefined && dest[property] != org[property]) {
        dest[property] = org[property];
      }
      if (memo && dest[property] != memo[property]) {
        res = true;
      }
    });
    return res;
  }

  public execute(): boolean {
    this.objectsData.forEach((od) => {
      if (this.applyModificationsToObject(od.objectNew, od.object, od.objectMemo)) {
        if (od.object.changeMemento) {
          this.modelService.updateChangeStatus(od.object);
        }
      }
    });
    return this.objectsData.length > 0;
  }

  public canExecute() {
    return true;
  }

  public undo() {
    this.objectsData.forEach((od) => {
      // console.log("ModifyCommand.undo", od.objectMemo, od.object);
      this.applyModificationsToObject(od.objectMemo, od.object);
      if (od.objectMemo.changeStatus) {
        this.modelService.updateChangeStatus(od.object);
      }
    });
  }

  public redo() {
    this.execute();
  }
}
