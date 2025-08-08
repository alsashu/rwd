import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";

/**
 * IomappingView actions service
 */
export class IomappingViewActionsService {
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

          // {
          //   type: "button",
          //   html: (item: any) => "view.showRedAndYellow.action",
          //   icon: (item: any) => "not-equal",
          //   click: (event: any, item: any) => {
          //     this.parent.treeItemOptions.isRedAndYellowDisplayed =
          //       !this.parent.treeItemOptions.isRedAndYellowDisplayed;
          //     this.parent.refresh();
          //   },
          //   active: (item: any) => this.parent.treeItemOptions.isRedAndYellowDisplayed,
          //   enabled: (item: any) => true,
          //   visible: (item: any) => true,
          // },
        ],
      },
      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "dropdown",
            html: (item: any) => "Comparison options",
            icon: (item: any) => "eye",
            enabled: (item: any) => true,
            visible: (item: any) => this.parent.compareService.comparisonIsComputed(),
            actions: [
              {
                type: "dropdown-item",
                html: (item: any) => "view.showRedAndYellow.action",
                click: (event: any, item: any) => {
                  this.parent.treeItemOptions.isRedAndYellowDisplayed =
                    !this.parent.treeItemOptions.isRedAndYellowDisplayed;
                  this.parent.refresh();
                },
                active: (item: any) => this.parent.treeItemOptions.isRedAndYellowDisplayed,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
              {
                type: "divider",
                visible: (item: any) => this.parent.compareService.getCompareProjectList().length >= 3,
              },

              {
                type: "dropdown-item",
                html: (item: any) => this.parent.getCompareLevelMenu(1),
                click: (event: any, item: any) => this.parent.onCompareLevel(1),
                active: (item: any) => this.parent.compareLevel === 1,
                enabled: (item: any) => true,
                visible: (item: any) => this.parent.compareService.getCompareProjectList().length >= 3,
              },
              {
                type: "dropdown-item",
                html: (item: any) => this.parent.getCompareLevelMenu(2),
                click: (event: any, item: any) => this.parent.onCompareLevel(2),
                active: (item: any) => this.parent.compareLevel === 2,
                enabled: (item: any) => true,
                visible: (item: any) => this.parent.compareService.getCompareProjectList().length >= 3,
              },
              {
                type: "dropdown-item",
                html: (item: any) => this.parent.getCompareLevelMenu(3),
                click: (event: any, item: any) => this.parent.onCompareLevel(3),
                active: (item: any) => this.parent.compareLevel === 3,
                enabled: (item: any) => true,
                visible: (item: any) => this.parent.compareService.getCompareProjectList().length >= 4,
              },
              {
                type: "dropdown-item",
                html: (item: any) => this.parent.getCompareLevelMenu(4),
                click: (event: any, item: any) => this.parent.onCompareLevel(4),
                active: (item: any) => this.parent.compareLevel === 4,
                enabled: (item: any) => true,
                visible: (item: any) => this.parent.compareService.getCompareProjectList().length >= 5,
              },
            ],
          },
        ],
      },
    ],
  };

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
            this.getModelVerificationService().modifyFirstSelectedObjectVerificationDataViaForm({
              forcedData: { verificationState: ModelVerificationService.verificationStateValues.verifiedNOK },
            }),

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

  // Actions
  public nodeActionsMap = new Map([]);

  // Node actions map
  public objectTypeActionsMap = new Map([]);

  /**
   * Constructor
   * @param parent Parent view
   */
  constructor(private parent: any) {}

  /**
   * Get the model verif service
   * @returns The service
   */
  private getModelVerificationService(): IModelVerificationService {
    return this.parent.modelVerificationService;
  }
}
