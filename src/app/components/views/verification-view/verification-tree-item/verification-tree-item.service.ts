import { ModelPropertiesService } from "src/app/services/model/model-properties.service";
import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { RightsService } from "src/app/services/rights/rights.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { TranslateService } from "src/app/services/translate/translate.service";

/**
 * Service helpinh displaying an item in the verification tree of the verification tree
 */
export class VerificationTreeItemService {
  public modelPropertiesService: ModelPropertiesService;
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
    ) as ModelPropertiesService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as TranslateService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as RightsService;
  }

  private getOptions() {
    return this.params && this.params.getOptions ? this.params.getOptions() : null;
  }

  public getNodeItemClass(node: any): string {
    return "node-item" + (node && node.isExpanded ? " node-item-expanded" : "");
  }

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

  public getNodeObjectMetaDataValue(node: any, propertyName: string): any {
    return this.modelVerificationService.getVerificationDataPropertyValue(node ? node.object : null, propertyName);
  }

  public getTypeShortFormat(node: any): string {
    let res = this.getNodeObjectTypeDisplayedValue(node);
    if (res) {
      res = res.split(":").pop();
    }
    return res;
  }

  public getVerificationToBeVerifiedValue(node: any): any {
    return this.modelVerificationService.getObjectIsToBeVerifiedValue(node ? node.object : null);
  }

  public getVerificationStateValue(node: any): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vst = tbv
      ? this.getNodeObjectMetaDataValue(node, ModelVerificationService.verificationProperties.verificationState)
      : null;
    return tbv ? (vst ? vst : ModelVerificationService.verificationStateValues.notVerified) : "-";
  }

  public getVerificationStateDisplayValue(node: any): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vst = tbv
      ? this.getNodeObjectMetaDataValue(node, ModelVerificationService.verificationProperties.verificationState)
      : null;
    return tbv
      ? vst
        ? this.translateService.translateFromMap(vst)
        : ModelVerificationService.verificationStateValues.notVerified
      : "-";
  }

  public getVerificationStateShortDisplayValue(node: any): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vst = tbv
      ? this.getNodeObjectMetaDataValue(node, ModelVerificationService.verificationProperties.verificationState)
      : null;
    return this.getVerificationShortState(vst);
  }

  /**
   * Get short display of a verif state
   * @param state The state value
   * @returns String
   */
  public getVerificationShortState(state: any, defaultValue: string = "-"): string {
    let res = defaultValue;
    if (state) {
      if (state === ModelVerificationService.verificationStateValues.verifiedOK) {
        res = "OK";
      } else if (state === ModelVerificationService.verificationStateValues.verifiedNOK) {
        res = "NOK";
      } else {
        res = "?";
      }
    }
    return res;
  }

  public getVerificationOverallStateShortDisplayValue(node: any): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vst = tbv
      ? this.getNodeObjectMetaDataValue(node, ModelVerificationService.verificationProperties.verificationOverallState)
      : null;
    return this.getVerificationShortState(vst);
  }

  public getVerificationRulesStateShortDisplayValue(node: any): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vst = tbv
      ? this.getNodeObjectMetaDataValue(node, ModelVerificationService.verificationProperties.verificationRulesState)
      : null;
    return this.getVerificationShortState(vst);
  }

  public getVerificationRulesStateList(node: any): any {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vrstl = tbv
      ? this.getNodeObjectMetaDataValue(
          node,
          ModelVerificationService.verificationProperties.verificationRulesStateList
        )
      : null;
    return vrstl;
  }

  /**
   * Get class of a verif state
   * @param state The state value
   * @returns String
   */
  public getClassFromVerificationState(state: any): string {
    let res = "button w3em ";
    if (state === ModelVerificationService.verificationStateValues.notVerified) {
      res += "button-active-grey ";
    } else if (state === ModelVerificationService.verificationStateValues.verifiedOK) {
      res += "button-active-ok ";
    } else if (state === ModelVerificationService.verificationStateValues.verifiedNOK) {
      res += "button-active-nok ";
    }
    return res;
  }

  public getClassFromShortVerificationState(state: any): string {
    let res = "button w3em ";
    if (state === "OK") {
      res += "button-active-ok ";
    } else if (state === "NOK") {
      res += "button-active-nok ";
    }
    return res;
  }

  public getVerificationOverallStateClass(node: any): string {
    return this.getClassFromShortVerificationState(this.getVerificationOverallStateShortDisplayValue(node));
  }

  public getVerificationRulesStateClass(node: any): string {
    return this.getClassFromShortVerificationState(this.getVerificationRulesStateShortDisplayValue(node));
  }

  public getVerificationStateClass(node: any): string {
    return this.getClassFromVerificationState(this.getVerificationStateValue(node));
  }

  public getVerificationResponseStateDisplayValue(node: any): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vst = tbv
      ? this.getNodeObjectMetaDataValue(node, ModelVerificationService.verificationProperties.verificationResponseState)
      : null;
    return tbv
      ? vst
        ? this.translateService.translateFromMap(vst)
        : ModelVerificationService.verificationResponseStateValues.noResponse
      : "-";
  }

  public getVerificationResponseStateShortDisplayValue(node: any): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vst = tbv
      ? this.getNodeObjectMetaDataValue(node, ModelVerificationService.verificationProperties.verificationResponseState)
      : null;
    return this.getVerificationShortState(vst, "");
  }

  public getVerificationResponseStateClass(node: any): string {
    let res = "button w3em ";
    const value = this.getVerificationResponseStateDisplayValue(node);
    if (value === ModelVerificationService.verificationResponseStateValues.noResponse) {
      res += "button-active-grey ";
    } else if (value === ModelVerificationService.verificationResponseStateValues.responseStateOK) {
      res += "button-active-ok ";
    } else if (value === ModelVerificationService.verificationResponseStateValues.responseStateNOK) {
      res += "button-active-nok ";
    }
    return res;
  }

  public getVerificationStringDisplayValue(node: any, propertyName: string): string {
    const vd = this.modelVerificationService.getObjectVerificationData(node ? node.object : null);
    return vd ? vd[propertyName] : "";
  }

  public getVerificationBooleanDisplayValue(
    node: any,
    propertyName: string,
    hideIfNotToBeVerified: boolean = true
  ): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vd = this.modelVerificationService.getObjectVerificationData(node ? node.object : null);
    return vd && tbv && hideIfNotToBeVerified ? vd[propertyName] : "";
  }

  public getVerificationBooleanValue(node: any, propertyName: string, hideIfNotToBeVerified: boolean = true): boolean {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vd = this.modelVerificationService.getObjectVerificationData(node ? node.object : null);
    return vd && tbv && hideIfNotToBeVerified ? vd[propertyName] : false;
  }

  public getVerificationIsToBeVerifiedValue(node: any): boolean {
    return this.modelVerificationService.getObjectIsToBeVerifiedValue(node.object);
  }

  public getVerificationCloseStateDisplayValue(node: any): string {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vd = this.modelVerificationService.getObjectVerificationData(node ? node.object : null);
    return vd && tbv ? vd[ModelVerificationService.verificationProperties.verificationCloseState] : "";
  }

  public getVerificationUserDisplayValue(node: any): string {
    const vd = this.modelVerificationService.getObjectVerificationData(node ? node.object : null);
    return vd && vd.verificationUser
      ? typeof vd.verificationUser === "string"
        ? vd.verificationUser
        : vd.verificationUser.name
      : "";
  }

  public getVerificationDate(node: any): Date {
    const vd = this.modelVerificationService.getObjectVerificationData(node ? node.object : null);
    return vd && vd.verificationDate ? vd.verificationDate : null;
  }

  public getVerificationDateDisplayValue(node: any): string {
    const date = this.getVerificationDate(node);
    return date ? date.toString() : null;
  }

  public getVerificationAnswerDisplayValue(node: any): string {
    const vd = this.modelVerificationService.getObjectVerificationData(node ? node.object : null);
    return vd && vd.verificationAnswer ? vd.verificationAnswer : "";
  }

  public getVerificationClosedStateDisplayValue(node: any): string {
    const vd = this.modelVerificationService.getObjectVerificationData(node ? node.object : null);
    return vd && vd.verificationClosedState ? vd.verificationClosedState : "";
  }

  public onVerificationMenuBtnClick(event: any, node: any) {
    if (node && node.object) {
      if (this.getOptions().parentView && this.getOptions().parentView.onNodeRightClick) {
        this.getOptions().parentView.onNodeRightClick(event, node);
      }
    }
  }

  public onToBeVerifiedBtnClick(event: any, node: any) {
    if (node && node.object) {
      if (event && event.ctrlKey) {
        this.modelVerificationService.modifyObjectsToBeVerifiedValue([node.object], "toggle");
        this.modelVerificationService.modifyObjectsPropertiesToBeVerifiedValue([node.object], "toggle");
      } else {
        this.modelVerificationService.modifyObjectsToBeVerifiedValue([node.object], "toggle");
      }
      this.onNodeModified(node);
    }
  }

  public onVerificationStateBtnClick(event: any, node: any) {
    if (node && node.object) {
      if (event && event.shiftKey) {
        this.modelVerificationService.modifySelectedObjectsVerificationState(
          ModelVerificationService.verificationStateValues.verifiedOK
        );
        if (event.ctrlKey) {
          this.modelVerificationService.modifySelectedObjectsPropertiesVerificationData({
            verificationState: ModelVerificationService.verificationStateValues.verifiedOK,
          });
        }
        this.onNodeModified(node);
      } else {
        this.modelVerificationService.modifyVerificationDataViaForm(node.object, {
          cb: (o: any) => this.onNodeModified(node),
        });
      }
    }
  }

  private onNodeModified(node: any) {
    if (this.getOptions().parentView && this.getOptions().parentView.onNodeModified) {
      this.getOptions().parentView.onNodeModified(node);
    }
  }

  public isVerificationDataVisible(node: any): boolean {
    return node && node.object && node.object.type !== "treeMenuNode";
  }

  /**
   * Function that returns the boolean : the user can make verification
   * @returns bool
   */
  public canVerify(): boolean {
    return this.rightsService.canWrite(RightsConst.VERIFICATION);
  }

  /**
   * Function that returns the boolean : the user can answer verification
   * @returns bool
   */
  public canAnswerVerify(): boolean {
    return this.rightsService.canWrite(RightsConst.VERIFICATION_ANSWER);
  }

  /**
   * Function that returns the boolean : the user can open verification modal dialog
   * @returns bool
   */
  public canOpenVerifyDialog(): boolean {
    return this.canVerify() || this.canAnswerVerify();
  }
}
