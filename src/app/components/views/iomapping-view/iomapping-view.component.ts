import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, Input, ElementRef } from "@angular/core";
import { IomappingViewActionsService } from "./iomapping-view-actions.service";
import { IViewComponent } from "../../../services/view/iview.component";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { INodeFactory } from "../../app/generic-tree/tree-factories/inode-factory";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IMetaModelService } from "src/app/services/meta/meta-model.service";
import { IModelService } from "src/app/services/model/model.service";
import { GenericContextMenuService } from "../../app/generic-context-menu/generic-context-menu.service";
import { GenericTreeService } from "../../app/generic-tree/generic-tree.service";
import { IModelVerificationService } from "src/app/services/model/model-verification.service";
import { IRightsService } from "src/app/services/rights/rights.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { AViewComponent } from "../base/aview.component";
import { IomappingTreeNodeFactory } from "./iomapping-tree-node-factory/iomapping-tree.node-factory";
import { IView } from "src/app/services/view/iview";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { ICompareService } from "src/app/services/compare/compare.service";
import { ANodeFactory } from "../../app/generic-tree/tree-factories/anode-factory";

@Component({
  selector: "app-iomapping-view",
  templateUrl: "./iomapping-view.component.html",
  styleUrls: ["./iomapping-view.component.css"],
})
export class IomappingViewComponent extends AViewComponent implements OnInit, IViewComponent, OnDestroy {
  public static viewType = "iomapping-view";
  private static lsNameIomappingTree = "alm-rvw-iomapping-tree";

  @ViewChild(GenericContextMenuComponent, { static: true })
  public mainContextMenuComponent: GenericContextMenuComponent;

  @ViewChild(GenericTreeComponent, { static: true })
  public genericTreeComponent: GenericTreeComponent;

  @ViewChild(GenericTreeComponent, { read: ElementRef, static: true })
  public genericTreeComponentRef: ElementRef;

  @Input()
  public config: any = {
    viewComponent: null,
    boId: null,
    projectId: null,
  };

  @ViewChild("nodeContentTemplateIomappingRack")
  public nodeContentTemplateIomappingRackRef: ElementRef;

  @ViewChild("nodeContentTemplateIomappingEquipment")
  public nodeContentTemplateIomappingEquipmentRef: ElementRef;

  public options = {};

  public treeItemOptions = {
    isRedAndYellowDisplayed: true,
  };

  public filters = {
    defaultFilter: (node: any): boolean => node && !(node.isVisibleFilter === false),
  };

  private refreshTimeOut = null;
  private refreshDelayMs = 1000;

  public bo: any;
  public project: any;

  // Tree
  public nodes: any[] = [];
  public treeNodeFactory: INodeFactory;

  // Comparison
  public boComparison: any;
  public projectComparison: any;
  public nodesComparison: any[] = [];

  public treeNodeFactoryComparison: INodeFactory;
  public getComparisonProjectIndexCB = () => {
    return 1;
  };

  public compareLevel = 1;

  private lockBOChangedSelectionEvent = false;

  public viewActionsService = new IomappingViewActionsService(this);
  public mvcEventSubscription: any;

  private selectionService: ISelectionService;
  public modelService: IModelService;
  private metaModelService: IMetaModelService;
  public modelVerificationService: IModelVerificationService;
  private rightsService: IRightsService;
  public compareService: ICompareService;

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
    super(IomappingViewComponent.viewType, servicesService);

    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.metaModelService = this.servicesService.getService(ServicesConst.MetaModelService) as IMetaModelService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as IRightsService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.compareService = this.servicesService.getService(ServicesConst.CompareService) as ICompareService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.config.viewComponent = this;

    this.initTree();
    this.initMvc();
    this.initView();
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
   * Test is the view is this view
   * @param view The view to be compared to
   * @returns True if it is the same view
   */
  public isThisView(view: IView) {
    return (
      super.isThisView(view) && view.config.boId === this.config.boId && view.config.projectId === this.config.projectId
    );
  }

  /**
   * Init the view
   * @param force Force to init the view even if the bo was previously set
   */
  private initView(force = false) {
    if (!this.bo || force) {
      this.refresh();
    }
  }

  /**
   * Init the tree component
   */
  public initTree() {
    const tc = this.genericTreeComponent;
    tc.treeMemoService.setLocalStorageName(IomappingViewComponent.lsNameIomappingTree);
    tc.options.onSelectObjects = (objects: any[], value: any) => {
      this.lockBOChangedSelectionEvent = true;
      this.selectionService.selectObjects(objects, value);
      this.lockBOChangedSelectionEvent = false;
    };
    tc.options.onNodeMouseDown = (event: any, node: any) => this.onNodeMouseDown(event, node);
    tc.options.onNodeDoubleClick = (event: any, node: any) => this.onNodeDoubleClick(event, node);
    tc.options.onNodeRightClick = (event: any, node: any) => this.onNodeRightClick(event, node);
    tc.options.useCategoryTemplate = false;
    tc.options.getNodeContentTemplate = (node: any) =>
      node && node.type === "GenericADM:rack"
        ? this.nodeContentTemplateIomappingRackRef
        : this.nodeContentTemplateIomappingEquipmentRef;
    tc.options.filter = this.filters.defaultFilter;

    this.treeNodeFactory = new IomappingTreeNodeFactory(tc.treeMemoService, {
      rootObject: () => this.bo,
      rootLabel: () => (this.bo ? this.bo.label : "?"),
      getProjectComparison: () => this.projectComparison,
      getCompareLevel: () => this.compareLevel,
      nodeKeyPrefix: () => "iomapping-node-",
      buildNodeOverlay: (node: any) => {
        return this.buildNodeOverlay(node);
      },
      translateLabel: (text: string) => this.translateService.translateFromMap(text),
      isTypeExtensionOfTypes: (type: string, extensions: string[]) =>
        this.metaModelService.isTypeExtensionOfTypes(type, extensions),
      servicesService: this.servicesService,
    });

    this.treeNodeFactoryComparison = new IomappingTreeNodeFactory(null, {
      rootObject: () => this.boComparison,
      rootLabel: () => (this.boComparison ? this.boComparison.label : "?"),
      getProjectComparison: () => this.projectComparison,
      getCompareLevel: () => this.compareLevel,
      nodeKeyPrefix: () => "iomapping-node-comparison",
      buildNodeOverlay: (node: any) => {
        node = this.buildNodeOverlay(node);
        // node.label += "_V01";
        return node;
      },
      translateLabel: (text: string) => this.translateService.translateFromMap(text),
      translateModelClassName: (text: string) => this.translateService.translateModelClassName(text),
      isTypeExtensionOfTypes: (type: string, extensions: string[]) =>
        this.metaModelService.isTypeExtensionOfTypes(type, extensions),
      servicesService: this.servicesService,
    });
  }

  /**
   * Find node of the same object (type & id) in sibling nodes (nodes of another version)
   * @param node The node
   * @param siblingNodes Sibling nodes
   * @returns The found node, null if not
   */
  private findSiblingNode(node: any, siblingNodes: any[]): any {
    let res = null;
    if (node && node.object && siblingNodes) {
      siblingNodes.forEach((childNode: any) => {
        if (!res) {
          res = this.findSiblingNodeRec(node, childNode);
        }
      });
    }
    return res;
  }

  /**
   * Find recursively node of the same object (type & id) in sibling node (nodes of another version)
   * @param node The node
   * @param siblingNodes Sibling nodes
   * @returns The found node, null if not
   */
  private findSiblingNodeRec(node: any, siblingNode: any): any {
    let res = null;
    if (node && node.object && siblingNode && siblingNode.object) {
      if (node.object.id === siblingNode.object.id && node.object.type === siblingNode.object.type) {
        return siblingNode;
      }
      if (siblingNode.nodes) {
        siblingNode.nodes.forEach((childNode: any) => {
          if (!res) {
            res = this.findSiblingNodeRec(node, childNode);
          }
        });
      }
    }
    return res;
  }

  /**
   * Init the MVC message subscription
   */
  public initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if ([MvcConst.MSG_END_SELECTING_PROJECT].includes(message.type)) {
        this.initView(true);
      } else if (
        [
          MvcConst.MSG_END_LOADING_PROJECT_COMPARISON_FILE,
          MvcConst.MSG_RESET_COMPARISON,
          MvcConst.MSG_END_LOADING_PROJECT_FOR_COMPARISON,
        ].includes(message.type)
      ) {
        setTimeout(() => {
          this.refresh();
        }, 100);
      } else if ([MvcConst.MSG_BO_SELECTION_CHANGED].includes(message.type)) {
        this.onBOSelectionChange();
      } else if (message.type === MvcConst.MSG_RIGHTS_LOADED) {
        this.userCanViewVerificationView();
      }
    });
  }

  /**
   * Function called when the selection of business objects has changed
   */
  public onBOSelectionChange() {
    if (!this.lockBOChangedSelectionEvent) {
      const so = this.selectionService.getSelectedObjects().find((o: any) => true);
      if (so) {
        this.genericTreeComponent.centerOnObject(so);
      }
    }
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
      this.mainContextMenuComponent.showContextMenu(event, node);
    }
  }

  /**
   * Init project and assembly
   */
  private initViewData(useComparisonData: boolean = false) {
    this.project = this.modelService.getProject(this.config.projectId);
    this.bo = this.getAssemblyOfProject(this.project);
    this.projectComparison = null;
    this.boComparison = null;

    // Comparison?
    if (this.treeItemOptions.isRedAndYellowDisplayed && this.comparisonIsActive()) {
      const compareProjectList = this.compareService.getCompareProjectList();
      if (this.compareLevel < compareProjectList.length && this.compareLevel > 0) {
        this.project = compareProjectList[this.compareLevel - 1];
        this.bo = this.getAssemblyOfProject(this.project);
        this.projectComparison = compareProjectList[this.compareLevel];
        this.boComparison = this.getAssemblyOfProject(this.projectComparison);
      }
    }
  }

  /**
   * Get the assembly of a specific project
   * @param project The project
   * @returns The assembly
   */
  private getAssemblyOfProject(project: any): any {
    return project
      ? this.modelService.getObjectByItemIdAndObjectClassName(project, {
          itemId: this.config.boId,
          objectClassName: ModelConstService.ASSEMBLY_TYPE.split(":").pop(),
        })
      : null;
  }

  /**
   * Refresh the view
   */
  public refresh() {
    this.initViewData();
    this.nodes = this.treeNodeFactory.buildNodes();

    // Comparison?
    if (this.treeItemOptions.isRedAndYellowDisplayed && this.comparisonIsActive()) {
      this.refreshComparisonData();
    }
  }

  /**
   * Refresh comparison data
   */
  public refreshComparisonData() {
    this.nodesComparison = [];

    // Comparison active and red and yellow displayed?
    if (this.treeItemOptions.isRedAndYellowDisplayed && this.comparisonIsActive()) {
      this.nodesComparison = this.buildComparisonNodes();

      // Find deleted items and add them to parent node
      this.genericTreeService.forEachNodes(this.nodesComparison, (node: any) => {
        if (node.compareState === "deleted") {
          const parentNodeSibling = this.findSiblingNode(node.parent, this.nodes);
          if (
            parentNodeSibling &&
            !(this.treeNodeFactoryComparison as ANodeFactory).nodeExistsInParent(node, parentNodeSibling)
          ) {
            parentNodeSibling.nodes.push(node);
          }
        }
      });

      // Add comparison nodes to project nodes
      this.genericTreeService.forEachNodes(this.nodes, (node: any) => {
        node.nodeComparison = this.findSiblingNode(node, this.nodesComparison);
      });
    }
  }

  /**
   * Build comparison nodes
   * @param project
   * @returns
   */
  private buildComparisonNodes(/*projectComparison: any*/): any {
    const comparisonNodes = this.treeNodeFactoryComparison.buildNodes();
    return comparisonNodes;
  }

  /**
   * Tests is comparison is active and computed
   * @returns Boolean value
   */
  public comparisonIsActive(): boolean {
    return this.compareService.comparisonIsComputed();
  }

  /**
   * Overlay function called when building a tree node
   * @param node A node
   * @returns The node
   */
  public buildNodeOverlay(node: any) {
    if (node && node.object) {
      const object = node.object;
      const objectTypeActions: any = this.viewActionsService.objectTypeActionsMap.get(object.type);
      if (objectTypeActions && objectTypeActions.actionNames && objectTypeActions.actionNames.forEach) {
        node.actions = [];
        objectTypeActions.actionNames.forEach((actionName: string) =>
          node.actions.push(this.viewActionsService.nodeActionsMap.get(actionName))
        );
      }
    }
    return node;
  }

  /**
   * On node mouse down event call back
   * @param event The event
   * @param node The node
   */
  public onNodeMouseDown(event: any, node: any) {}

  /**
   * On node double click event call back
   * @param event The event
   * @param node The node
   */
  public onNodeDoubleClick(event: any, node: any) {}

  /**
   * On node right click event call back
   * @param event The event
   * @param node The node
   */
  public onNodeRightClick(event: any, node: any) {
    this.showContextMenu(event, node);
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Get a verification data value of a node
   * @param node The node
   * @param propertyName The name of the property
   * @returns The value of the property
   */
  public getNodeObjectVerificationDataValue(node: any, propertyName: string): any {
    const vd = this.modelVerificationService.getObjectOrPropertyVerificationData(node.object);
    return vd ? vd[propertyName] : null;
  }

  /**
   * Test is user can open verification view
   * @returns bool
   */
  public userCanViewVerificationView() {
    return this.rightsService.canRead(RightsConst.VERIFICATION);
  }

  /**
   * Test is user can refresh the view
   * @returns bool
   */
  public userCanRefresh() {
    return this.rightsService.canRead(RightsConst.VERIFICATION);
  }

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
   * Function that returns the boolean : the user can open verification modal dialog
   * @returns bool
   */
  public canOpenVerifyDialog() {
    return this.canVerify() || this.canAnswerVerify();
  }

  /**
   * Compare level selection
   * @param level The level value
   */
  public onCompareLevel(level: number) {
    const nbP = this.compareService.getCompareProjectList().length;
    this.compareLevel = level;
    if (this.compareLevel >= nbP) {
      this.compareLevel = 1;
    }
    this.refresh();
  }

  /**
   * Get compare menu
   * @param level comparaison level
   * @returns The compare menu label
   */
  public getCompareLevelMenu(level: number) {
    let res = this.translateService.translateFromMap("Red and yellow level ") + level;
    const projectList = this.compareService.getCompareProjectList();
    if (level > 0 && level < projectList.length) {
      const p1 = projectList[level - 1];
      const p2 = projectList[level];
      res =
        p1 && p2 && p1.label && p2.label
          ? this.translateService.translateFromMap("Red and yellow ") + p1.label + "/" + p2.label
          : res;
    }
    return res;
  }
}
