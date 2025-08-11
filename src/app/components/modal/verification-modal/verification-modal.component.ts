import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { KeyValue } from "@angular/common";

import { ModelService } from "../../../services/model/model.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { RightsService } from "src/app/services/rights/rights.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";
import { ITranslateService } from "src/app/services/translate/translate.service";

@Component({
  selector: "app-verification-modal",
  templateUrl: "./verification-modal.component.html",
  styleUrls: ["./verification-modal.component.css"],
})
/**
 * Verification modal component
 */
export class VerificationModalComponent implements OnInit {
  /**
   * Form title
   */
  public title = "Verification";

  /**
   * Button OK label
   */
  public btnOKLabel = "Validate";

  /**
   * Form parameters
   */
  public params = {
    formData: {
      verificationState: null,
      verificationComment: null,
      verificationCR: null,
      verificationInputDocument: null,
      verificationResponseState: null,
      verificationResponseComment: null,
      verificationResponseCheck: null,
      verificationCloseState: null,
      verificationCorrectionState: null,
      verificationRulesStateList: null,
      verificationRulesState: null,
      verificationOverallState: null,
    },
    object: null,
  };

  public isForcedNOK = false;

  public maxlength = 500;

  /**
   * Verification states label map
   */
  public verificationStateConfigMap = new Map([
    [
      ModelVerificationService.verificationStateValues.notVerified,
      {
        index: 0,
        isVisible: true,
        label: ModelVerificationService.verificationStateValues.notVerified,
        icon: ["fas", "ellipsis-h"],
        class: "property-check-span ",
      },
    ], // "far", "square"
    [
      ModelVerificationService.verificationStateValues.verifiedOK,
      {
        index: 1,
        isVisible: true,
        label: ModelVerificationService.verificationStateValues.verifiedOK,
        icon: ["fas", "check"],
        class: "property-check-span green-status",
      },
    ], // "far", "check-square"
    [
      ModelVerificationService.verificationStateValues.verifiedNOK,
      {
        index: 2,
        isVisible: true,
        label: ModelVerificationService.verificationStateValues.verifiedNOK,
        icon: ["fas", "times"],
        class: "property-check-span red-status",
      },
    ], // "far", "minus-square"
  ]);

  /**
   * Verification responses states label map
   */
  public verificationResponseStateConfigMap = new Map([
    [
      ModelVerificationService.verificationStateValues.notVerified,
      {
        index: 0,
        isVisible: true,
        label: ModelVerificationService.verificationResponseStateValues.noResponse,
        icon: ["fas", "ellipsis-h"],
        class: "property-check-span ",
      },
    ],
    [
      ModelVerificationService.verificationResponseStateValues.responseStateOK,
      {
        index: 1,
        isVisible: true,
        label: "Response OK",
        icon: ["fas", "check"],
        class: "property-check-span green-status",
      },
    ],
    [
      ModelVerificationService.verificationResponseStateValues.responseStateNOK,
      {
        index: 2,
        isVisible: true,
        label: "Response NOK",
        icon: ["fas", "times"],
        class: "property-check-span red-status",
      },
    ],
  ]);

  /**
   * Form classes
   */
  public classes = {
    commentWarningClass: "hidden-text",
    responseCommentWarningClass: "hidden-text",
    propNOKWarningClass: "hidden-text",
  };

  public modelService: ModelService;
  public rightsService: RightsService;
  public translateService: ITranslateService;
  public modelVerificationService: IModelVerificationService;

  /**
   * Constructor
   * @param activeModal NgbActiveModal
   * @param servicesService The Services Service
   */
  public constructor(public activeModal: NgbActiveModal, public servicesService: ServicesService) {
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as RightsService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.btnOKLabel = this.translateService.translateFromMap(this.btnOKLabel);
    this.title = this.translateService.translateFromMap(this.title);

    this.verificationStateConfigMap.forEach((value: any, key: string) => {
      value.label = this.translateService.translateFromMap(value.label);
    });
    this.verificationResponseStateConfigMap.forEach((value: any, key: string) => {
      value.label = this.translateService.translateFromMap(value.label);
    });
  }

  /**
   * Init form
   * @param params Parameters
   */
  public init(params: any) {
    this.params = params;
    if (params) {
      if (params.title) {
        this.title = params.title;
      }
      if (params.btnOKLabel) {
        this.btnOKLabel = this.translateService.translateFromMap(params.btnOKLabel);
      }
      if (params.object && params.object.type !== "objectProperty") {
        this.isForcedNOK = this.modelVerificationService.checkIfOnePropertyIsNOK(params.object);
        this.classes.propNOKWarningClass = this.isForcedNOK ? "form-text red-text" : "hidden-text";
      }
    }
  }

  /**
   * Verification state ordering function
   * @param a First value
   * @param b Second value
   * @returns -1/1 depending on index values of a & b comparison
   */
  public verificationStateOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return a.value.index < b.value.index ? -1 : 1;
  };

  /**
   * Function that returns the boolean : the user can make verification
   * @returns bool
   */
  public canVerify() {
    return this.rightsService.canWrite(RightsConst.VERIFICATION);
  }

  /**
   * Function that returns the boolean : the user can answer verification
   * @returns bool
   */
  public canAnswerVerify() {
    return this.rightsService.canWrite(RightsConst.VERIFICATION_ANSWER);
  }

  /**
   * Test if a trimmed string is empty
   */
  private isStringEmpty(s: string): boolean {
    return !s || (s && s.trim && s.trim() === "");
  }

  /**
   * Validate form call back
   */
  public onValidateClick() {
    this.classes.commentWarningClass = "hidden-text";
    this.classes.responseCommentWarningClass = "hidden-text";
    let error = false;
    if (
      this.params.formData.verificationState === ModelVerificationService.verificationStateValues.verifiedNOK &&
      this.isStringEmpty(this.params.formData.verificationComment) &&
      this.canVerify()
    ) {
      this.classes.commentWarningClass = "form-text red-text";
      error = true;
    }
    if (
      this.params.formData.verificationResponseState ===
        ModelVerificationService.verificationResponseStateValues.responseStateNOK &&
      this.isStringEmpty(this.params.formData.verificationResponseComment) &&
      this.canAnswerVerify()
    ) {
      this.classes.responseCommentWarningClass = "form-text red-text";
      error = true;
    }
    if (error) {
      return;
    }
    this.activeModal.close(this.params);
  }

  /**
   * Get Clean string value ("null" => "")
   * @param s The string value
   * @returns String
   */
  public getCleanStringValue(s: string): string {
    return s && s !== "null" ? s : "";
  }

  public getVerificationRulesStateClass(): string {
    return "";
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
}
