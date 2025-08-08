import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { ICompareService } from "src/app/services/compare/compare.service";
import { IMetaModelService } from "src/app/services/meta/meta-model.service";
import { IModelService } from "src/app/services/model/model.service";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { IRightsService } from "src/app/services/rights/rights.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { IViewComponent } from "src/app/services/view/iview.component";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { GenericContextMenuService } from "../../app/generic-context-menu/generic-context-menu.service";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";
import { GenericTreeService } from "../../app/generic-tree/generic-tree.service";
import { INodeFactory } from "../../app/generic-tree/tree-factories/inode-factory";
import { AViewComponent } from "../base/aview.component";
import { CompareTreeNodeFactory } from "./compare-tree-node-factory/compare-tree.node-factory";
import { CompareViewActionsService } from "./compare-view-actions.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { IModalViewService } from "src/app/services/modal/imodal-view.service";

@Component({
  selector: "app-compare-view",
  templateUrl: "./compare-view.component.html",
  styleUrls: ["./compare-view.component.css"],
})
export class CompareViewComponent extends AViewComponent implements OnInit, IViewComponent, OnDestroy {
  public static viewType = "compare-view";
  private static lsNameCompareTree = "alm-rvw-compare-tree";

  @ViewChild(GenericContextMenuComponent, { static: true })
  public mainContextMenuComponent: GenericContextMenuComponent;
  @ViewChild(GenericTreeComponent, { static: true })
  public genericTreeComponent: GenericTreeComponent;
  @ViewChild("compareInfoBar")
  public compareInfoBarRef: ElementRef;

  public options = {
    categoryDisplayMode: true,
  };

  public treeItemOptions = {
    parentView: this,
  };

  public filters = {
    defaultFilter: (node: any): boolean => node && !(node.isVisibleFilter === false),
  };

  private refreshTimeOut = null;
  private refreshDelayMs = 1000;

  // Tree
  public nodes: any[] = [];
  public treeNodeFactory: INodeFactory;

  public viewActionsService = new CompareViewActionsService(this);
  public mvcEventSubscription: any;

  private selectionService: ISelectionService;
  public modelService: IModelService;
  private metaModelService: IMetaModelService;
  private rightsService: IRightsService;
  public compareService: ICompareService;
  public modalViewService: IModalViewService;

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
    super(CompareViewComponent.viewType, servicesService);

    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.metaModelService = this.servicesService.getService(ServicesConst.MetaModelService) as IMetaModelService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as IRightsService;
    this.compareService = this.servicesService.getService(ServicesConst.CompareService) as ICompareService;
    this.modalViewService = this.servicesService.getService(ServicesConst.ModalViewService) as IModalViewService;
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
    tc.treeMemoService.setLocalStorageName(CompareViewComponent.lsNameCompareTree);
    tc.options.onSelectObjects = (objects: any[], value: any) => {
      this.selectionService.selectObjects(objects, value);
    };
    tc.options.onNodeMouseDown = (event: any, node: any) => this.onNodeMouseDown(event, node);
    tc.options.onNodeDoubleClick = (event: any, node: any) => this.onNodeDoubleClick(event, node);
    tc.options.onNodeRightClick = (event: any, node: any) => this.onNodeRightClick(event, node);
    tc.options.filter = this.filters.defaultFilter;

    this.treeNodeFactory = new CompareTreeNodeFactory(tc.treeMemoService, {
      servicesService: this.servicesService,
      rootObject: () => this.compareService.compareData,
      nodeKeyPrefix: () => "compare-node-",
      buildNodeOverlay: (node: any) => this.buildNodeOverlay(node),
      translateLabel: (text: string) => this.translateService.translateFromMap(text),
      translateModelClassName: (text: string) => this.translateService.translateModelClassName(text),
      isTypeExtensionOfTypes: (type: string, extensions: string[]) =>
        this.metaModelService.isTypeExtensionOfTypes(type, extensions),
    });
  }

  /**
   * Init the MVC message subscription
   */
  public initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if (
        [MvcConst.MSG_START_SELECTING_PROJECT, MvcConst.MSG_PROJECT_CLOSED, MvcConst.MSG_RESET_COMPARISON].includes(
          message.type
        )
      ) {
        this.refreshWithDelay();
      } else if (
        [MvcConst.MSG_END_LOADING_PROJECT_FOR_COMPARISON, MvcConst.MSG_END_LOADING_PROJECT_COMPARISON_FILE].includes(
          message.type
        )
      ) {
        this.refresh();
      } else if (message.type === MvcConst.MSG_RIGHTS_LOADED) {
        this.userCanViewCompareView();
      }
    });
  }

  /**
   * Refresh the view with a delay
   */
  public refreshWithDelay() {
    clearTimeout(this.refreshTimeOut);
    this.refreshTimeOut = setTimeout(() => {
      this.refresh();
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
      // No context menu
      // this.mainContextMenuComponent.showContextMenu(event, node);
    }
  }

  /**
   * Refresh the view
   */
  public refresh() {
    this.nodes = this.treeNodeFactory.buildNodes();
    this.updateFilter();
  }

  /**
   * Overlay function called when building a tree node
   * @param node A node
   * @returns The node
   */
  public buildNodeOverlay(node: any) {
    // No overlay (action buttons for instance)
    return node;
  }

  /**
   * On node mouse down event call back
   * @param event The event
   * @param node The node
   */
  public onNodeMouseDown(event: any, node: any) {
    // console.log(node);
  }

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
   * Update the filter after filter selection modification
   */
  public updateFilter() {
    // this.showAllNodes();
  }

  /**
   * Deploy all nodes
   */
  public showAllNodes() {
    this.genericTreeComponent.genericTreeService.forEachNodes(this.nodes, (node: any) => (node.isVisibleFilter = true));
  }

  /**
   * Update a parent node (used for filtering)
   * @param node A node
   */
  public updateParentsNode(node: any) {
    if (node && node.isVisibleFilter) {
      this.genericTreeComponent.genericTreeService.forEachParentNodeRec(node, (nodeParent: any) => {
        nodeParent.isVisibleFilter = true;
      });
    }
  }

  /**
   * Test is user can open verification view
   * @returns bool
   */
  public userCanViewCompareView() {
    return true; // this.rightsService.canRead(RightsConst.COMPARE);
  }

  /**
   * Test is user can refresh the view
   * @returns bool
   */
  public userCanRefresh() {
    return true; // this.rightsService.canRead(RightsConst.COMPARE);
  }

  /**
   * Select projects to be compared
   */
  public selectProjects() {
    const params = {
      servicesService: this.servicesService,
    };

    this.modalViewService.openCompareProjectsModalComponent(params, (result: any) => {
      console.log("ok");
    });
  }

  /**
   * On scroll event
   * @param event
   */
  public onScroll(event: any) {
    this.compareInfoBarRef.nativeElement.scrollLeft = event.target.scrollLeft;
  }
}
