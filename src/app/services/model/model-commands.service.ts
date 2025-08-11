import { TransactionCommand } from "src/app/commands/transaction.cmd";
import { ICommandService, CommandService } from "src/app/common/services/command/command.service";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { TranslateService } from "../translate/translate.service";
import { ModelVerificationService } from "./model-verification.service";

export interface IModelCommandsService {
  modifyObjects(objectList: any[], propertyName: string, value: any);
  modifyObjectsWithDataList(dataList: Array<{ object: any; propertyName: string; value: any }>);

  // Objetcs meta data
  modifySelectedObjectsMetaDataValue(propertyName: string, value: any);
  modifyObjectsMetaDataValue(objects: any[], propertyName: string, value: any);

  // Objetcs attribute meta data
  modifyObjectsAttributeMetaDataValue(objects: any[], attributeName: string, propertyName: string, value: any);
  modifySelectedObjectsAttributeMetadaValue(attributeName: string, propertyName: string, value: any);
}

export class ModelCommandsService implements IModelCommandsService {
  private commandService: ICommandService;
  private selectionService: ISelectionService;
  private translateService: TranslateService;
  private modelVerificationService: ModelVerificationService;

  constructor(private servicesService: IServicesService) {}

  public initService() {
    this.commandService = this.servicesService.getService(ServicesConst.CommandService) as CommandService;
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as TranslateService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as ModelVerificationService;
  }

  public modifyObjects(objectList: any[], propertyName: string, value: any) {
    if (objectList && objectList.length) {
      this.commandService.execute(
        new TransactionCommand("Modify objects", (qs: any) => {
          objectList.forEach((object: any) => {
            const theValue = value === "toggle" ? !object[propertyName] : value;
            if (object[propertyName] !== theValue) {
              qs.modify(object, propertyName, theValue);
            }
          });
          return true;
        })
      );
    }
  }

  public modifyObjectsWithDataList(dataList: Array<{ object: any; propertyName: string; value: any }>) {
    if (dataList && dataList.length) {
      this.commandService.execute(
        new TransactionCommand("Modify objects", (qs: any) => {
          dataList.forEach((data: any) => {
            const object = data.object;
            const theValue = data.value === "toggle" ? !object[data.propertyName] : data.value;
            if (object[data.propertyName] !== theValue) {
              qs.modify(object, data.propertyName, theValue);
            }
          });
          return true;
        })
      );
    }
  }

  public modifyObjectsMetaDataValue(objects: any[], propertyName: string, value: any) {
    if (objects && objects.forEach) {
      const dataList: Array<{ object: any; propertyName: string; value: any }> = [];
      objects.forEach((o: any) => {
        const metaData = this.modelVerificationService.getOrCreateObjectMetaData(o);
        if (metaData) {
          dataList.push({ object: metaData, propertyName, value });
        }
      });
      this.modifyObjectsWithDataList(dataList);
    }
  }

  public modifySelectedObjectsMetaDataValue(propertyName: string, value: any) {
    this.modifyObjectsMetaDataValue(this.selectionService.getSelectedObjects(), propertyName, value);
  }

  public modifyObjectsAttributeMetaDataValue(objects: any[], attributeName: string, propertyName: string, value: any) {
    if (objects && objects.forEach) {
      const metaDataList = [];
      objects.forEach((o: any) => {
        if (o && o[attributeName] != undefined) {
          // const md = this.modelVerificationService.getOrCreateObjectMetaData(o);
          // if (o.metaData) {}
          // TODO
          // if (o[attributeName].metaData) {
          //   metaDataList.push(o[attributeName].metaData);
          // }
        }
      });
      this.modifyObjects(metaDataList, propertyName, value);
    }
  }

  public modifySelectedObjectsAttributeMetadaValue(attributeName: string, propertyName: string, value: any) {
    this.modifyObjectsAttributeMetaDataValue(
      this.selectionService.getSelectedObjects(),
      attributeName,
      propertyName,
      value
    );
  }
}
