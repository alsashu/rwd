import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from "@angular/core";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { ServicesService } from "../../../services/services/services.service";
import { ISelectionService } from "../../../common/services/selection/selection.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { IViewComponent } from "src/app/services/view/iview.component";
import { AViewComponent } from "../base/aview.component";
import { IRightsService } from "src/app/services/rights/rights.service";
import { GenericContextMenuService } from "../../app/generic-context-menu/generic-context-menu.service";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";
import { GenericTreeService } from "../../app/generic-tree/generic-tree.service";
import { INodeFactory } from "../../app/generic-tree/tree-factories/inode-factory";
import { RuleViewActionsService } from "./rule-view-actions.service";
import { ModelMapNodeFactory } from "../../app/generic-tree/tree-factories/model-map.node-factory/model-map.node-factory";
import { ModelMetadataService } from "src/app/services/model/model-metadata.service";
import { IRuleService } from "src/app/services/rule/rule.service";
import { IModelService } from "src/app/services/model/model.service";

@Component({
  selector: "app-rule-view",
  templateUrl: "./rule-view.component.html",
  styleUrls: ["./rule-view.component.css"],
})
export class RuleViewComponent extends AViewComponent implements OnInit, IViewComponent, OnDestroy {
  public static viewType = "rule-view";
  private static lsNameRuleTree = "alm-rvw-rule-tree";

  @ViewChild(GenericContextMenuComponent, { static: true })
  public mainContextMenuComponent: GenericContextMenuComponent;
  @ViewChild(GenericTreeComponent, { static: true })
  public genericTreeComponent: GenericTreeComponent;

  public logTypes = {
    textLog: "textLog",
    ruleEngineLog: "ruleEngineLog",
    ruleLog: "ruleLog",
  };

  public options = {
    isLogVisible: false,
    logType: this.logTypes.textLog,
  };

  public treeItemOptions = {
    parentView: this,
    isTypeDisplayed: false,
    isKPDisplayed: false,
    isToBeVerifiedFilterActive: false,
    isNotVerifiedFilterActive: false,
    isVerifiedNOKFilterActive: false,
    isUndefinedValueVisible: false,
  };

  public filters = {
    defaultFilter: (node: any): boolean => node && !(node.isVisibleFilter === false),
  };

  private refreshTimeOut = null;
  private refreshDelayMs = 1000;

  public aceOptions: any = {
    maxLines: 10000,
    printMargin: false,
    useSoftTabs: true,
    tabSize: 2,
    navigateWithinSoftTabs: true,
    wrap: false,
    hScrollBarAlwaysVisible: false,
    vScrollBarAlwaysVisible: false,
  };

  // Tree
  public nodes: any[] = [];
  public treeNodeFactory: INodeFactory;

  public viewActionsService = new RuleViewActionsService(this);
  public mvcEventSubscription: any;

  public ruleService: IRuleService;
  private modelService: IModelService;
  private modelMetadataService: ModelMetadataService;
  private selectionService: ISelectionService;
  private rightsService: IRightsService;

  /**
   * Constructor
   * @param changeDetectorRef The ChangeDetectorRef
   * @param genericContextMenuService The GenericContextMenuService
   * @param genericTreeService The GenericTreeService
   * @param servicesService The ServicesService
   */
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public genericContextMenuService: GenericContextMenuService,
    public genericTreeService: GenericTreeService,
    public servicesService: ServicesService
  ) {
    super(RuleViewComponent.viewType, servicesService);

    this.ruleService = this.servicesService.getService(ServicesConst.RuleService) as IRuleService;
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as IRightsService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.modelMetadataService = this.servicesService.getService(
      ServicesConst.ModelMetadataService
    ) as ModelMetadataService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.initTree();
    this.initMvc();
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    if (this.mvcEventSubscription) {
      this.mvcEventSubscription.unsubscribe();
    }
  }

  /**
   * Init the tree component
   */
  public initTree() {
    const tc = this.genericTreeComponent;
    tc.treeMemoService.setLocalStorageName(RuleViewComponent.lsNameRuleTree);
    tc.options.useCategoryTemplate = false;
    tc.options.onSelectObjects = (objects: any[], value: any) => this.selectionService.selectObjects(objects, value);
    tc.options.onDrop = (event: any, node: any) => this.onDrop(event, node);

    this.treeNodeFactory = new ModelMapNodeFactory(tc.treeMemoService, {
      rootObjects: () => this.ruleService.rules,
      modelMap: this.modelMetadataService.modelConfig.modelMap,
      buildNodeOverlay: (node: any) => this.buildNodeOverlay(node),
    });
  }

  /**
   * Init the MVC message subscription
   */
  public initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if (
        [MvcConst.MSG_END_LOADING_MODEL, MvcConst.MSG_PROJECT_CLOSED, MvcConst.MSG_RULE_LIST_CHANGED].includes(
          message.type
        )
      ) {
        this.options.isLogVisible = false;
        this.refresh();
      } else if ([MvcConst.MSG_END_SELECTING_PROJECT].includes(message.type)) {
        this.refresh();
      } else if (
        [MvcConst.MSG_CS_RULE_ENGINE_EXECUTION_END, MvcConst.MSG_PY_RULE_ENGINE_EXECUTION_END].includes(message.type)
      ) {
        this.ruleService.log = "";
        alert(this.translateService.translateFromMap("Rule execution is done. Press OK to reload the project."));
        this.modelService.openProject(this.modelService.getSelectedProject());
      } else if (
        [MvcConst.MSG_CS_RULE_ENGINE_LOG_CHANGED, MvcConst.MSG_PY_RULE_ENGINE_LOG_CHANGED].includes(message.type)
      ) {
        this.options.isLogVisible = true;
        this.options.logType = this.logTypes.textLog;

        // Delay because ace does not refresh content well if hidden
        setTimeout(() => {
          if (message.logData && message.logData.ruleLog && message.logData.ruleLog.forEach) {
            this.options.logType = this.logTypes.ruleLog;
          }
        }, 50);
      } else if (message.type === MvcConst.MSG_PROJECT_CLOSED) {
        this.ruleService.reset();
      }
    });
  }

  /**
   * Refresh the view with a delay
   */
  public refreshWithDelay() {
    clearTimeout(this.refreshTimeOut);
    this.refreshTimeOut = setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, this.refreshDelayMs);
  }

  /**
   * Refresh the view
   */
  public refresh() {
    this.nodes = this.treeNodeFactory.buildNodes();
  }

  /**
   * Overlay function called when building a tree node
   * @param node A node
   * @returns The node
   */
  public buildNodeOverlay(node: any) {
    if (node && node.object) {
      const object = node.object;
      if (object && object.type === "rule-prototype") {
        return null;
      }
    }
    return node;
  }

  /**
   * Function called when the menu button is clicked
   * @param event The event
   */
  public onBtnMenuClicked(event: any) {
    this.showContextMenu(event, this.genericTreeComponent.clickedNode || (this.nodes.length ? this.nodes[0] : null));
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Displays the context menu
   * @param event The event
   * @param element The selected element
   * @param target The html target
   */
  public showContextMenu(event: any, node: any, target: any = null) {
    if (node) {
      // No context menu
      // this.mainContextMenuComponent.showContextMenu(event, node);
    }
  }

  /**
   * Test is user can use rules
   * @returns bool
   */
  public userCanUseRules() {
    // return this.rightsService.canRead(RightsConst.VERIFICATION);
    return true;
  }

  /**
   * On drop
   * @param event
   * @param node
   */
  public onDrop(event: any, node: any) {
    try {
      if (event.dataTransfer.types.includes("text/plain")) {
        const dndTextData = event.dataTransfer.getData("text");
        if (dndTextData && dndTextData !== "") {
          const dndData = JSON.parse(dndTextData);
          if (dndData.type === "rule-prototype" && dndData.object) {
            this.ruleService.insertRuleFromLibrary(dndData.object, node ? node.object : null);
          } else {
            if (dndData.type === "rule" && dndData.object) {
              const rule = this.ruleService.getRuleByLabel(dndData.object ? dndData.object.label : null);
              this.ruleService.moveRule(rule, node ? node.object : null);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Get Clean string value ("null" => "")
   * @param s The string value
   * @returns String
   */
  public getCleanStringValue(s: string): string {
    return s && s !== "null" ? s : "";
  }

  /**
   * On object name click in message rule log view
   * @param message The message
   */
  public onObjectNameClick(message: any) {
    if (message && message.Id && message.ObjectClass) {
      const bos = this.modelService.getObjectsByItemIdAndObjectClassNameList(this.modelService.getSelectedProject(), [
        {
          itemId: message.Id,
          objectClassName: message.ObjectClass,
        },
      ]);
      this.selectionService.selectObjects(bos);
    }
  }
}
