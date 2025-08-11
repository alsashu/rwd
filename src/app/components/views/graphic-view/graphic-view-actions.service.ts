import { IDiagramService } from "src/app/modules/diagram/services/diagram/diagram.service";
import { ICommandManager } from "src/app/modules/diagram/services/command/command.manager";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { RightsService } from "src/app/services/rights/rights.service";
import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

export class GraphicViewActionsService {
  public toolBarActions = {
    type: "tool-bar",
    actions: [
      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "button",
            html: (item: any) => "Menu",
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
            html: (item: any) => "Zoom +",
            icon: (item: any) => "search-plus",
            click: (event: any, item: any) => this.getCommandManager().execute("IncreaseZoomCommand"),
            enabled: (item: any) => this.getCommandManager().canExecute("IncreaseZoomCommand"),
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "Zoom -",
            icon: (item: any) => "search-minus",
            click: (event: any, item: any) => this.getCommandManager().execute("DecreaseZoomCommand"),
            enabled: (item: any) => this.getCommandManager().canExecute("DecreaseZoomCommand"),
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "graphic.view.reset.zoom.action",
            icon: (item: any) => "search",
            click: (event: any, item: any) => this.getCommandManager().execute("ResetZoomCommand"),
            enabled: (item: any) => this.getCommandManager().canExecute("ResetZoomCommand"),
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
            html: (item: any) => "verification.dropdown.action",
            icon: (item: any) => "tasks",
            enabled: (item: any) => true,
            visible: (item: any) => true,
            actions: [
              {
                type: "dropdown-item",
                html: (item: any) => "verification.set.to.verified.action",
                click: (event: any, item: any) =>
                  this.getModelVerificationService().modifySelectedObjectsToBeVerifiedValue(true),
                active: (item: any) => false,
                enabled: (item: any) =>
                  this.parent.selectionService.getSelectedObjects().length > 0 && this.parent.canVerify(),
                visible: (item: any) => true,
              },
              {
                type: "dropdown-item",
                html: (item: any) => "verification.unset.to.verified.action",
                click: (event: any, item: any) =>
                  this.getModelVerificationService().modifySelectedObjectsToBeVerifiedValue(false),
                active: (item: any) => false,
                enabled: (item: any) =>
                  this.parent.selectionService.getSelectedObjects().length > 0 && this.parent.canVerify(),
                visible: (item: any) => true,
              },
              { type: "divider" },
              {
                type: "dropdown-item",
                html: (item: any) => "verification.set.to.vOK.action",
                click: (event: any, item: any) =>
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
                type: "dropdown-item",
                html: (item: any) => "verification.set.to.vNOK.action",
                click: (event: any, item: any) =>
                  this.getModelVerificationService().modifySelectedObjectsVerificationState(
                    ModelVerificationService.verificationStateValues.verifiedNOK
                  ),
                active: (item: any) => false,
                enabled: (item: any) =>
                  this.parent.selectionService.getSelectedObjects().length === 1 && this.parent.canVerify(),
                visible: (item: any) => true,
              },
              {
                type: "dropdown-item",
                html: (item: any) => "verification.set.to.not.verified.action",
                click: (event: any, item: any) =>
                  this.getModelVerificationService().modifySelectedObjectsVerificationState(
                    ModelVerificationService.verificationStateValues.notVerified
                  ),
                active: (item: any) => false,
                enabled: (item: any) =>
                  this.parent.selectionService.getSelectedObjects().length > 0 && this.parent.canVerify(),
                visible: (item: any) => true,
              },
              { type: "divider" },
              {
                type: "dropdown-item",
                html: (item: any) => "verification.open.verification.dialog",
                click: (event: any, item: any) =>
                  this.getModelVerificationService().modifyFirstSelectedObjectVerificationDataViaForm(),
                active: (item: any) => false,
                enabled: (item: any) =>
                  this.parent.selectionService.getSelectedObjects().length === 1 && this.parent.canOpenVerifyDialog(),
                visible: (item: any) => true,
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
            ],
          },
        ],
      },

      // {
      //   type: "btn-group", visible: (item: any) => true,
      //   actions: [
      //     {
      //       type: "button", html: (item: any) => "Tout sélectionner", icon: (item: any) => "object-ungroup",
      //       click: (event: any, item: any) => this.getCommandManager().execute("SelectAllCommand"),
      //       active: (item: any) => false,
      //       enabled: (item: any) => true,
      //       visible: (item: any) => true,
      //     },
      //   ],
      // },

      {
        type: "btn-group",
        visible: (item: any) => true,
        class: (item: any) => "btn-right",
        actions: [
          {
            type: "input",
            html: (item: any) => "graphic.view.search.action",
            icon: (item: any) => "object-ungroup",
            value: "",
            onChange: (event: any, item: any) => {
              this.parent.searchValue = event;
            },
            click: (event: any, item: any) => {
              this.parent.searchAndSelect(item.value);
            },
            typeahead: (text: Observable<string>) => {
              return text.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                map((term) =>
                  term.length < 2
                    ? []
                    : this.parent.lastSearch
                        .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
                        .slice(0, 10)
                )
              );
            },
            active: (item: any) => false,
            enabled: (item: any) => true,
            visible: (item: any) => true,
          },

          {
            type: "dropdown",
            html: (item: any) => "view.options.action",
            icon: (item: any) => "cog",
            enabled: (item: any) => true,
            visible: (item: any) => true,
            actions: [
              {
                type: "dropdown-item",
                html: (item: any) => "graphic.view.display.grid.action",
                click: (event: any, item: any) =>
                  (this.parent.diagramService.diagramController.diagramComponent.config.grid.isVisible =
                    !this.parent.diagramService.diagramController.diagramComponent.config.grid.isVisible),
                active: (item: any) =>
                  this.parent.diagramService.diagramController.diagramComponent.config.grid.isVisible,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },

              // {
              //   type: "dropdown-item",
              //   html: (item: any) => "graphic.view.display.tooltips.action",
              //   click: (event: any, item: any) =>
              //     (this.parent.diagramService.diagramController.diagramComponent.config.display.isTooltipVisible =
              //       !this.parent.diagramService.diagramController.diagramComponent.config.display.isTooltipVisible),
              //   active: (item: any) =>
              //     this.parent.diagramService.diagramController.diagramComponent.config.display.isTooltipVisible,
              //   enabled: (item: any) => true,
              //   visible: (item: any) => true,
              // },
            ],
          },
        ],
      },
    ],
  };

  public contextMenuActions = [
    {
      html: (item: any) => "Zoom",
      enabled: (item: any) => true,
      visible: (item: any) => true,
      subMenuId: "smTP",
      contextMenuActions: [
        {
          type: "button",
          html: (item: any) => "Zoom +",
          click: (item: any) => this.getCommandManager().execute("IncreaseZoomCommand"),
          enabled: (item: any) => this.getCommandManager().canExecute("IncreaseZoomCommand"),
          visible: (item: any) => true,
        },
        {
          type: "button",
          html: (item: any) => "Zoom -",
          click: (item: any) => this.getCommandManager().execute("DecreaseZoomCommand"),
          enabled: (item: any) => this.getCommandManager().canExecute("DecreaseZoomCommand"),
          visible: (item: any) => true,
        },
        { divider: true, visible: true },
        {
          type: "button",
          html: (item: any) => "graphic.view.reset.zoom.action",
          click: (event: any, item: any) => this.getCommandManager().execute("ResetZoomCommand"),
          enabled: (item: any) => this.getCommandManager().canExecute("ResetZoomCommand"),
          visible: (item: any) => true,
        },
      ],
    },

    {
      html: (item: any) => "Verification",
      enabled: (item: any) => true,
      visible: (item: any) => this.parent.options.verifyMode,
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
              forcedData: {
                verificationState: "Verified NOK",
              },
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
          html: (item: any) => "verification.open.verification.dialog",
          click: (item: any) => this.getModelVerificationService().modifyFirstSelectedObjectVerificationDataViaForm(),
          active: (item: any) => false,
          enabled: (item: any) =>
            this.parent.selectionService.getSelectedObjects().length === 1 && this.parent.canOpenVerifyDialog(),
          visible: (item: any) => true,
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
      ],
    },
  ];

  public rightsService: RightsService;

  constructor(private parent: any, public servicesService: ServicesService) {
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as RightsService;
  }

  private getDiagramService(): IDiagramService {
    return this.parent.diagramService;
  }

  private getCommandManager(): ICommandManager {
    return this.getDiagramService().commandManager;
  }

  private getModelVerificationService(): IModelVerificationService {
    return this.parent.modelVerificationService;
  }

  public addToolBarActions(actions: any[]) {
    this.toolBarActions.actions = this.toolBarActions.actions.concat(actions);
  }
}
