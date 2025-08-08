import { IModelPropertiesService } from "src/app/services/model/model-properties.service";
import { IModelVerificationService } from "src/app/services/model/model-verification.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { RightsService } from "src/app/services/rights/rights.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { TranslateService } from "src/app/services/translate/translate.service";

/**
 * Component displaying an item in the compare tree of the compare view
 */
export class CompareTreeItemService {
  public modelPropertiesService: IModelPropertiesService;
  private modelVerificationService: IModelVerificationService;
  public translateService: TranslateService;
  private rightsService: RightsService;

  /**
   * Constructor
   * @param servicesService The ServicesService
   */
  constructor(public servicesService: ServicesService, public params: any) {
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as IModelPropertiesService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as TranslateService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as RightsService;
  }

  // private getOptions() {
  //   return this.params && this.params.getOptions ? this.params.getOptions() : null;
  // }

  /**
   *
   * @param node Get node item class
   * @returns
   */
  public getNodeItemClass(node: any): string {
    return "node-item" + (node && node.isExpanded ? " node-item-expanded" : "");
  }

  /**
   * Get node object type
   * @param node The node
   * @returns
   */
  public getNodeObjectTypeDisplayedValue(node: any): string {
    return this.modelPropertiesService.getObjectTypeLabel(node ? node.object : "");
  }

  /**
   * Get data per version
   * @param node The node
   * @returns A list
   */
  public getDataPerVersionList(node: any): any[] {
    let res: any[] = [];
    if (node && node.compareData && node.compareData.dataPerVersionList) {
      res = node.compareData.dataPerVersionList;
    }
    return res;
  }

  // /**
  //  *
  //  * @param node Get node item displayed value
  //  * @param propertyName
  //  * @param prefix
  //  * @returns
  //  */
  // public getNodeDisplayedValue(node: any, propertyName: string, prefix: string = ""): string {
  //   return node && node[propertyName] ? prefix + node[propertyName] : "";
  // }

  // /**
  //  * Get node object displayed value
  //  * @param node The node
  //  * @param propertyName The property name
  //  * @param prefix
  //  * @param suffix
  //  * @returns
  //  */
  // public getNodeObjectDisplayedValue(
  //   node: any,
  //   propertyName: string,
  //   prefix: string = "",
  //   suffix: string = ""
  // ): string {
  //   return node && node.object && node.object[propertyName] ? prefix + node.object[propertyName] + suffix : "";
  // }

  // /**
  //  * Get node object meta data displayed value
  //  * @param node  The node
  //  * @param propertyName The property name
  //  * @param prefix
  //  * @param suffix
  //  * @returns
  //  */
  // public getNodeObjectMetaDataDisplayedValue(
  //   node: any,
  //   propertyName: string,
  //   prefix: string = "",
  //   suffix: string = ""
  // ): string {
  //   const v = this.getNodeObjectMetaDataValue(node, propertyName);
  //   return v ? prefix + String(v) + suffix : "";
  // }

  // /**
  //  * Get node object meta data value
  //  * @param node The node
  //  * @param propertyName The property name
  //  * @returns
  //  */
  // public getNodeObjectMetaDataValue(node: any, propertyName: string): any {
  //   return this.modelVerificationService.getVerificationDataPropertyValue(node ? node.object : null, propertyName);
  // }

  // /**
  //  * Get type in short format
  //  * @param node The node
  //  * @returns String
  //  */
  // public getTypeShortFormat(node: any): string {
  //   let res = this.getNodeObjectTypeDisplayedValue(node);
  //   if (res) {
  //     res = res.split(":").pop();
  //   }
  //   return res;
  // }

  // public getProjectList(node: any): any[] {
  //   let res: any[] = [{ label: "P1" }, { label: "P2" }, { label: "P3" }];
  //   if (node && node.compareData) {
  //   }
  //   return res;
  // }
}
