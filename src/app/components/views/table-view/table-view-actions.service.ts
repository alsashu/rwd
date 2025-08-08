import { IModelCommandsService } from "src/app/services/model/model-commands.service";

export class TableViewActionsService {
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
            enabled: (item: any) => true,
            visible: (item: any) => true,
          },

          // {
          //   type: "button",
          //   html: (item: any) => "table.view.tobeverified.filter.action",
          //   icon: (item: any) => "check",
          //   click: (event: any, item: any) => {
          //     this.parent.treeItemOptions.isToBeVerifiedFilterActive = !this.parent.treeItemOptions
          //       .isToBeVerifiedFilterActive;
          //     this.parent.updateFilter();
          //   },
          //   active: (item: any) => this.parent.treeItemOptions.isToBeVerifiedFilterActive,
          //   enabled: (item: any) => true,
          //   visible: (item: any) => true,
          // },
          // {
          //   type: "button",
          //   html: (item: any) => "table.view.showKP.action",
          //   icon: (item: any) => "eye",
          //   click: (event: any, item: any) => {
          //     this.parent.treeItemOptions.isKPDisplayed = !this.parent.treeItemOptions.isKPDisplayed;
          //   },
          //   active: (item: any) => this.parent.treeItemOptions.isKPDisplayed,
          //   enabled: (item: any) => true,
          //   visible: (item: any) => true,
          // },

          {
            type: "dropdown",
            html: (item: any) => "view.options.action",
            icon: (item: any) => "eye",
            enabled: (item: any) => true,
            visible: (item: any) => true,
            actions: [],
          },
        ],
      },
    ],
  };

  public contextMenuActions = [
    {
      html: (item: any) => "Table data",
      enabled: (item: any) => true,
      visible: (item: any) => true,
      subMenuId: "smTable",
      contextMenuActions: [
        // {
        //   html: (item: any) => "Set 'to be verified' status",
        //   click: (item: any) => this.getModelVerificationService().modifySelectedObjectsToBeVerifiedValue(true),
        //   active: (item: any) => false,
        //   enabled: (item: any) => true,
        //   visible: (item: any) => true,
        // },
        // {
        //   html: (item: any) => "Unset 'to be verified' status",
        //   click: (item: any) => this.getModelVerificationService().modifySelectedObjectsToBeVerifiedValue(false),
        //   active: (item: any) => false,
        //   enabled: (item: any) => true,
        //   visible: (item: any) => true,
        // },
        // { divider: true, visible: true },
        // {
        //   html: (item: any) => "Set verification state to 'Verified OK'",
        //   click: (item: any) =>
        //     this.getModelVerificationService().modifySelectedObjectsVerificationState("Verified OK"),
        //   active: (item: any) => false,
        //   enabled: (item: any) => true,
        //   visible: (item: any) => true,
        // },
        // {
        //   html: (item: any) => "Set verification state to 'Verified NOK'",
        //   click: (item: any) =>
        //     this.getModelVerificationService().modifySelectedObjectsVerificationState("Verified NOK"),
        //   active: (item: any) => false,
        //   enabled: (item: any) => true,
        //   visible: (item: any) => true,
        // },
        // {
        //   html: (item: any) => "Set verification state to 'Not Verified'",
        //   click: (item: any) =>
        //     this.getModelVerificationService().modifySelectedObjectsVerificationState("Not Verified"),
        //   active: (item: any) => false,
        //   enabled: (item: any) => true,
        //   visible: (item: any) => true,
        // },
        // { divider: true, visible: true },
        // {
        //   html: (item: any) => "Open verification dialog",
        //   click: (item: any) => this.getModelVerificationService().modifyFirstSelectedObjectVerificationDataViaForm(),
        //   active: (item: any) => false,
        //   enabled: (item: any) => this.parent.selectionService.getSelectedObjects().length === 1,
        //   visible: (item: any) => true,
        // },
      ],
    },
  ];

  // Actions
  public nodeActionsMap = new Map([
    // [
    //   "select-action",
    //   {
    //     label: (node: any) => "Sélectionner",
    //     tooltip: (node: any) => "Sélectionner",
    //     icon: (node: any) => "check",
    //     click: (node: any) => {
    //       this.parent.selectVersion({ version: node.object });
    //     },
    //   },
    // ],
    // [
    //   "open-action",
    //   {
    //     label: (node: any) => "Ouvrir",
    //     tooltip: () => "Ouvrir",
    //     icon: (node: any) => "eye",
    //     click: (node: any) => {
    //       this.parent.onBtnOpenViewClick(node);
    //     },
    //   },
    // ],
  ]);

  // Node actions map
  public objectTypeActionsMap = new Map([
    // ["version", { actionNames: ["select-action"] }],
    // ["visualization", { actionNames: ["open-action"] }],
  ]);

  constructor(private parent: any) {}

  private getModelCommandsService(): IModelCommandsService {
    return this.parent.modelCommandsService;
  }
}
