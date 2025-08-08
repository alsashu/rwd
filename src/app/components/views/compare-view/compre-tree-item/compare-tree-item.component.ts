import { Component, Input, OnInit } from "@angular/core";
import { IModelPropertiesService } from "src/app/services/model/model-properties.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { ITranslateService, TranslateService } from "src/app/services/translate/translate.service";
import { CompareTreeItemService } from "./compare-tree-item.service";

@Component({
  selector: "app-compare-tree-item",
  templateUrl: "./compare-tree-item.component.html",
  styleUrls: ["../../../app/generic-tree/generic-tree.component.css", "./compare-tree-item.component.css"],
})
/**
 * Component that display an item of the compare tree
 */
export class CompareTreeItemComponent implements OnInit {
  @Input()
  public node: any;

  @Input()
  public treeController: any;

  @Input()
  public options?: any = {
    isTypeDisplayed: false,
    isKPDisplayed: false,
    isToBeVerifiedFilterActive: false,
  };

  public compareTreeItemService: CompareTreeItemService;

  public modelPropertiesService: IModelPropertiesService;
  public translateService: ITranslateService;

  /**
   * Constructor
   * @param servicesService The ServicesService
   */
  constructor(public servicesService: ServicesService) {
    this.compareTreeItemService = new CompareTreeItemService(servicesService, {
      getOptions: () => this.options,
    });
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as IModelPropertiesService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit(): void {}

  /**
   * Mouse down event on instance
   * @param event The mouse event
   * @param dataPerVersion The data per version about the instance
   */
  public onObjectInstanceClick(event: any, dataPerVersion: any) {
    if (dataPerVersion) {
      console.log("dataPerVersion", dataPerVersion, dataPerVersion.object);
    }
  }
}
