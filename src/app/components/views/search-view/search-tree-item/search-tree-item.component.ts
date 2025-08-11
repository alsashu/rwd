import { Component, Input, OnInit } from "@angular/core";
import { ModelCommandsService } from "src/app/services/model/model-commands.service";
import { ModelPropertiesService } from "src/app/services/model/model-properties.service";
import { IModelVerificationService } from "src/app/services/model/model-verification.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";

@Component({
  selector: "app-search-tree-item",
  templateUrl: "./search-tree-item.component.html",
  styleUrls: ["../../../app/generic-tree/generic-tree.component.css", "./search-tree-item.component.css"],
})
export class SearchTreeItemComponent implements OnInit {
  @Input()
  public node: any;

  @Input()
  public treeController: any;

  @Input()
  public options?: any = {
    isKPDisplayed: false,
    isToBeVerifiedFilterActive: false,
  };

  public modelPropertiesService: ModelPropertiesService;
  public modelCommandsService: ModelCommandsService;
  public modelVerificationService: IModelVerificationService;

  constructor(public servicesService: ServicesService) {
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as ModelPropertiesService;
    this.modelCommandsService = this.servicesService.getService(
      ServicesConst.ModelCommandsService
    ) as ModelCommandsService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
  }

  public ngOnInit(): void {}

  // Node functions
  public getNodeItemClass(node: any): string {
    return "node-item" + (node && node.isExpanded ? " node-item-expanded" : "");
  }

  // Utils
  public getNodeDisplayedValue(node: any, propertyName: string, prefix: string = ""): string {
    return node && node[propertyName] ? prefix + node[propertyName] : "";
  }

  public getNodeObjectTypeDisplayedValue(node: any): string {
    return this.modelPropertiesService.getObjectTypeLabel(node ? node.object : "");
  }

  public getNodeObjectDisplayedValue(
    node: any,
    propertyName: string,
    prefix: string = "",
    suffix: string = ""
  ): string {
    return node && node.object && node.object[propertyName] ? prefix + node.object[propertyName] + suffix : "";
  }

  public getNodeObjectMetaDataDisplayedValue(
    node: any,
    propertyName: string,
    prefix: string = "",
    suffix: string = ""
  ): string {
    const v = this.getNodeObjectMetaDataValue(node, propertyName);
    return v ? prefix + String(v) + suffix : "";
  }

  // TODO in service
  public getNodeObjectMetaDataValue(node: any, propertyName: string): any {
    return this.modelVerificationService.getVerificationDataPropertyValue(node ? node.object : null, propertyName);
  }

  public getTypeShortFormat(node: any): string {
    let res = this.getNodeObjectTypeDisplayedValue(node);
    if (res) {
      const p = res.indexOf(":");
      if (p) {
        res = res.substring(p + 1);
      }
    }
    return res;
  }
}
