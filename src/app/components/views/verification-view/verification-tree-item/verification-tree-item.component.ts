import { Component, Input, OnInit } from "@angular/core";
import { IModelPropertiesService } from "src/app/services/model/model-properties.service";
import { IModelVerificationService } from "src/app/services/model/model-verification.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { TranslateService } from "src/app/services/translate/translate.service";
import { VerificationTreeItemService } from "./verification-tree-item.service";

@Component({
  selector: "app-verification-tree-item",
  templateUrl: "./verification-tree-item.component.html",
  styleUrls: ["../../../app/generic-tree/generic-tree.component.css", "./verification-tree-item.component.css"],
})
/**
 * Component that display an item in the verification tre of the verification tree
 */
export class VerificationTreeItemComponent implements OnInit {
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

  public verificationTreeItemService: VerificationTreeItemService;

  public modelPropertiesService: IModelPropertiesService;
  private modelVerificationService: IModelVerificationService;
  public translateService: TranslateService;

  /**
   * Constructor
   * @param servicesService The ServicesService
   */
  constructor(public servicesService: ServicesService) {
    this.verificationTreeItemService = new VerificationTreeItemService(servicesService, {
      getOptions: () => this.options,
    });
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as IModelPropertiesService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as TranslateService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit(): void {}
}
