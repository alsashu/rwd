import { GenericTreeExcelExport } from "src/app/components/app/generic-tree/export/generic-tree.excel.export";
import { IAppConfigService } from "src/app/services/app/app-config.service";
import { IModelVerificationService } from "src/app/services/model/model-verification.service";
import { IModelService } from "src/app/services/model/model.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { ITranslateService } from "src/app/services/translate/translate.service";
import { VerificationTreeItemService } from "../verification-tree-item/verification-tree-item.service";

/**
 * Verification view excel export
 */
export class VerificationViewExcelExportService {
  public verificationTreeItemService: VerificationTreeItemService;

  private translateService: ITranslateService;
  private modelService: IModelService;
  private appConfigService: IAppConfigService;
  public modelVerificationService: IModelVerificationService;

  public constructor(public servicesService: ServicesService, public getNodesCB: any, public treeItemOptions: any) {
    this.verificationTreeItemService = new VerificationTreeItemService(servicesService, {
      getOptions: () => this.treeItemOptions,
    });

    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.appConfigService = this.servicesService.getService(ServicesConst.AppConfigService) as IAppConfigService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
  }

  /**
   * Export data
   */
  public export() {
    const fileName = this.modelService.getSelectedProjectLabel();

    const versions = this.modelService.getSelectedProjectVersions();

    let headerWSData = [
      ["Export details"],
      ["Right Viewer version", this.appConfigService.getVersion()],
      ["GIT Branch", ""], // TODO
      ["RailML name", this.modelService.getSelectedProjectLabel()],
      ["RailML version", versions ? versions.xmlVersion : ""],
      ["XSD version", versions ? versions.xsdVersion : ""],

      // TODO:
      // Verification Rules executed and their versions	Date / hour of execution	Person in action	Role	Rule Version	Data file generated in Rules_Result
      // Calcul cables principaux	20/04/2022 11:38	Victor MALEJACQ	Verificator	TBC where to get the info
      // Règle divers signals	20/04/2022 14:31	Denis RAFFAULT	Admin
      // …
    ];

    // Labels translation
    for (let i = 0; i < headerWSData.length; i++) {
      headerWSData[i][0] = this.translateService.translateFromMap(headerWSData[i][0]);
    }

    // Verification worksheet labels
    const headerLabels = [
      "Item",
      // TODO to be added for consistency with right editor
      // "Object name",
      // "Object id",
      // "Property name",
      "Property value",
      "Type",
      "To Be Verified",
      "Verification Overall State",
      "Verification Rules State",
      "Verification State",
      "Verification Comment",
      "Input Document",
      "CR",
      "Verification User",
      "Verification Date",
      "Response State",
      "Response Comment",
      "Response Check",
      "Close State",
      "Correction State",
    ];
    // Labels translation
    for (let i = 0; i < headerLabels.length; i++) {
      headerLabels[i] = this.translateService.translateFromMap(headerLabels[i]);
    }

    const nodes = this.getNodesCB();

    new GenericTreeExcelExport().exportToXlsxFile(
      headerWSData,
      nodes,
      (node: any) => this.getTreeMenuNodeExportData(node),
      headerLabels,
      fileName
    );
  }

  /**
   * Get node data
   * @param node The node
   * @returns The exported data for the node
   */
  public getTreeMenuNodeExportData(node: any): any {
    let res: any = null;

    if (!node) {
      return res;
    }

    let labelValue = node.label;
    let value = "";
    let typeValue = this.verificationTreeItemService.getTypeShortFormat(node);

    if (node.label === "objectProperty") {
      labelValue = node.object && node.object.property ? node.object.property.displayedName : "";
      value = node.object && node.object.property ? node.object.property.displayedValue : "";
      typeValue = ""; // TODO add object type for property lines for easy filtering
    }

    let label = "";
    for (let i = 0; i < node.indent; i++) {
      label += "    ";
    }
    label += String(labelValue);

    const dateValue = this.verificationTreeItemService.getVerificationDate(node);
    const date: Date = dateValue ? new Date(dateValue) : null;
    const verificationDate = date ? date.toLocaleDateString() + "-" + date.toLocaleTimeString() : "";

    res = {
      label,
      // TODO to be added for consistency with right editor
      // "Object name",
      // "Object id",
      // "Property name",
      value,
      type: typeValue,
      toBeVerified: this.modelVerificationService.getObjectIsToBeVerifiedValue(node.object),
      verificationOverallState: this.verificationTreeItemService.getVerificationOverallStateShortDisplayValue(node),
      verificationRulesState: this.verificationTreeItemService.getVerificationRulesStateShortDisplayValue(node),
      verificationState: this.verificationTreeItemService.getVerificationStateShortDisplayValue(node),
      verificationComment: this.verificationTreeItemService.getVerificationStringDisplayValue(
        node,
        "verificationComment"
      ),
      verificationInputDocument: this.verificationTreeItemService.getVerificationStringDisplayValue(
        node,
        "verificationInputDocument"
      ),
      verificationCR: this.verificationTreeItemService.getVerificationStringDisplayValue(node, "verificationCR"),
      verificationUser: this.verificationTreeItemService.getVerificationUserDisplayValue(node),
      verificationDate,
      responseState: this.verificationTreeItemService.getVerificationResponseStateShortDisplayValue(node),
      verificationResponseComment: this.verificationTreeItemService.getVerificationStringDisplayValue(
        node,
        "verificationResponseComment"
      ),
      verificationResponseCheck: this.verificationTreeItemService.getVerificationStringDisplayValue(
        node,
        "verificationResponseCheck"
      ),
      closeState: this.verificationTreeItemService.getVerificationBooleanValue(node, "verificationCloseState")
        ? "Closed"
        : "Open",
      correctionState: this.verificationTreeItemService.getVerificationBooleanValue(node, "verificationCorrectionState")
        ? "Amended"
        : "Not Amended",
    };
    return res;
  }
}
