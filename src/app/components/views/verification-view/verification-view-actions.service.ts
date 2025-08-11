import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";
import { environment } from "src/environments/environment";

/**
 * Actions of the VerificationView
 */
export class VerificationViewActionsService {
  /**
   * Toolbar actions
   */
  public toolBarActions = {
    type: "tool-bar",
    actions: [
      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "button",
            html: (item: any) => "view.menu.action",
            icon: (item: any) => "bars",
            click: (event: any, item: any) => this.parent.onBtnMenuClicked(event),
            active: (item: any) => false,
            enabled: (item: any) => true,
            visible: (item: any) => true,
          },
        ],
      },

      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "dropdown",
            html: (item: any) => "view.options.action",
            icon: (item: any) => "eye",
            enabled: (item: any) => true,
            visible: (item: any) => true,
            actions: [
              {
                type: "dropdown-item",
                html: (item: any) => "verif.view.show.overall.nok.action",
                click: (event: any, item: any) => this.parent.onVerifiedOverallNOKFilter(),
                active: (item: any) => this.parent.treeItemOptions.isVerifiedOverallNOKFilterActive,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
              { type: "divider" },
              {
                type: "dropdown-item",
                html: (item: any) => "verif.view.show.tobe.verified.action",
                click: (event: any, item: any) => this.parent.onToBeVerifiedFilter(),
                active: (item: any) => this.parent.treeItemOptions.isToBeVerifiedFilterActive,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
              {
                type: "dropdown-item",
                html: (item: any) => "verif.view.show.not.verified.action",
                click: (event: any, item: any) => this.parent.onNotVerifiedFilter(),
                active: (item: any) => this.parent.treeItemOptions.isNotVerifiedFilterActive,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
              {
                type: "dropdown-item",
                html: (item: any) => "verif.view.show.nok.action",
                click: (event: any, item: any) => this.parent.onVerifiedNOKFilter(),
                active: (item: any) => this.parent.treeItemOptions.isVerifiedNOKFilterActive,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
              { type: "divider" },
              {
                type: "dropdown-item",
                html: (item: any) => "verif.view.show.rules.nok.action",
                click: (event: any, item: any) => this.parent.onVerifiedRulesNOKFilter(),
                active: (item: any) => this.parent.treeItemOptions.isVerifiedRulesNOKFilterActive,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
              { type: "divider" },
              {
                type: "dropdown-item",
                html: (item: any) => "verif.view.reset.filters.action",
                click: (event: any, item: any) => {
                  this.parent.resetFilters();
                  this.parent.updateFilters();
                },
                active: (item: any) => false,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
              { type: "divider" },
              {
                type: "dropdown-item",
                html: (item: any) => "properties.view.hide.hide.undefined.properties",
                click: (event: any, item: any) => this.parent.toggleIsUndefinedValueVisible(),
                active: (item: any) => !this.parent.treeItemOptions.isUndefinedValueVisible,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
            ],
          },

          {
            type: "button",
            html: (item: any) => "view.refresh.action",
            icon: (item: any) => "sync-alt",
            click: (event: any, item: any) => {
              this.parent.refresh();
            },
            active: (item: any) => false,
            enabled: (item: any) => this.parent.userCanRefresh(),
            visible: (item: any) => true,
          },

          {
            type: "button",
            html: (item: any) => "verif.view.export.action",
            icon: (item: any) => "file-export",
            click: (event: any, item: any) => {
              this.parent.export();
            },
            active: (item: any) => false,
            enabled: (item: any) => this.parent.userCanExport(),
            visible: (item: any) => !environment.cordova,
          },
        ],
      },
    ],
  };

  /**
   * Conext menu actions
   */
  public contextMenuActions = [
    {
      html: (item: any) => "Verification",
      enabled: (item: any) => true,
      visible: (item: any) => true,
      subMenuId: "smVerification",
      contextMenuActions: [
        {
          html: (item: any) => "verification.set.to.verified.action",
          click: (item: any) => this.getModelVerificationService().modifySelectedObjectsToBeVerifiedValue(true),
          active: (item: any) => false,
          enabled: (item: any) =>
            this.parent.selectionService.getSelectedObjects().length > 0 && this.parent.canVerify(),
          visible: (item: any) => true,
        },
        {
          html: (item: any) => "verification.unset.to.verified.action",
          click: (item: any) => this.getModelVerificationService().modifySelectedObjectsToBeVerifiedValue(false),
          active: (item: any) => false,
          enabled: (item: any) =>
            this.parent.selectionService.getSelectedObjects().length > 0 && this.parent.canVerify(),
          visible: (item: any) => true,
        },
        { divider: true, visible: true },
        {
          html: (item: any) => "verification.set.to.vOK.action",
          click: (item: any) =>
            this.getModelVerificationService().modifySelectedObjectsVerificationState(
              ModelVerificationService.verificationStateValues.verifiedOK
            ),
          active: (item: any) => false,
          enabled: (item: any) =>
            this.parent.selectionService.getSelectedObjects().length > 0 &&
            this.parent.canVerify() &&
            this.getModelVerificationService().checkIfSelectedObjectsCanBeSetTOOK(),
          visible: (item: any) => true,
        },
        {
          html: (item: any) => "verification.set.to.vNOK.action",
          click: (item: any) =>
            this.getModelVerificationService().modifySelectedObjectsVerificationState(
              ModelVerificationService.verificationStateValues.verifiedNOK
            ),
          active: (item: any) => false,
          enabled: (item: any) =>
            this.parent.selectionService.getSelectedObjects().length === 1 && this.parent.canVerify(),
          visible: (item: any) => true,
        },
        {
          html: (item: any) => "verification.set.to.not.verified.action",
          click: (item: any) =>
            this.getModelVerificationService().modifySelectedObjectsVerificationState(
              ModelVerificationService.verificationStateValues.notVerified
            ),
          active: (item: any) => false,
          enabled: (item: any) =>
            this.parent.selectionService.getSelectedObjects().length > 0 && this.parent.canVerify(),
          visible: (item: any) => true,
        },

        { divider: true, visible: true },

        {
          html: (item: any) => "Properties",
          enabled: (item: any) => true,
          visible: (item: any) => true,
          subMenuId: "smPropertiesVerification",
          contextMenuActions: [
            {
              html: (item: any) => "verification.set.tobeverified.to.all.properties",
              click: (item: any) =>
                this.getModelVerificationService().modifySelectedObjectsPropertiesToBeVerifiedValue(true),
              active: (item: any) => false,
              enabled: (item: any) =>
                this.parent.selectionService.getSelectedObjects().length > 0 && this.parent.canVerify(),
              visible: (item: any) => true,
            },
          ],
        },

        { divider: true, visible: true },
        {
          html: (item: any) => "verification.reset.verification.data",
          click: (item: any) => this.getModelVerificationService().resetSelectedObjectsVerificationData(),
          active: (item: any) => false,
          enabled: (item: any) =>
            this.parent.selectionService.getSelectedObjects().length > 0 && this.parent.canVerify(),
          visible: (item: any) => true,
        },
        { divider: true, visible: true },
        {
          html: (item: any) => "verification.open.verification.dialog",
          click: (item: any) => this.getModelVerificationService().modifyFirstSelectedObjectVerificationDataViaForm(),
          active: (item: any) => false,
          enabled: (item: any) =>
            this.parent.selectionService.getSelectedObjects().length === 1 && this.parent.canOpenVerifyDialog(),
          visible: (item: any) => true,
        },
      ],
    },
  ];

  /**
   * Actions map link to nodes
   */
  public nodeActionsMap = new Map([]);

  /**
   * Action map depending on object type
   */
  public objectTypeActionsMap = new Map([]);

  /**
   * Constructor
   * @param parent The parent view
   */
  constructor(private parent: any) {}

  /**
   * ModelVerificationService getter
   * @returns modelVerificationService
   */
  private getModelVerificationService(): IModelVerificationService {
    return this.parent.modelVerificationService;
  }
}
