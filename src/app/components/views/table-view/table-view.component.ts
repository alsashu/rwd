import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { TableViewActionsService } from "./table-view-actions.service";
import { IViewComponent } from "../../../services/view/iview.component";
import { IViewService } from "../../../services/view/view.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { INodeFactory } from "../../app/generic-tree/tree-factories/inode-factory";
import { CommandService, ICommandService } from "src/app/common/services/command/command.service";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IMetaModelService } from "src/app/services/meta/meta-model.service";
import { ModalViewService } from "src/app/services/modal/modal-view.service";
import { ModelMetadataService } from "src/app/services/model/model-metadata.service";
import { ModelService } from "src/app/services/model/model.service";
import { ScriptService } from "src/app/services/script/script.service";
import { GenericContextMenuService } from "../../app/generic-context-menu/generic-context-menu.service";
import { GenericTreeService } from "../../app/generic-tree/generic-tree.service";
import { IModalViewService } from "src/app/services/modal/imodal-view.service";
import { TableTreeNodeFactory } from "./table-tree-node-factory/table-tree.node-factory";
import { IModelCommandsService } from "src/app/services/model/model-commands.service";
import { IModelVerificationService } from "src/app/services/model/model-verification.service";
import { AViewComponent } from "../base/aview.component";

@Component({
  selector: "app-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["../../app/generic-tree/generic-tree.component.css", "./table-view.component.css"],
})
export class TableViewComponent extends AViewComponent implements OnInit, IViewComponent, OnDestroy {
  public static viewType = "table-view";
  private static lsNameTableViewTree = "alm-rvw-table-tree";

  @ViewChild(GenericContextMenuComponent, { static: true })
  public mainContextMenuComponent: GenericContextMenuComponent;

  @ViewChild(GenericTreeComponent, { static: true })
  public genericTreeComponent: GenericTreeComponent;

  public options = {
    categoryDisplayMode: true,
  };

  public treeItemOptions = {
    isKPDisplayed: false,
    isToBeVerifiedFilterActive: false,
    isNotVerifiedFilterActive: false,
    isVerifiedNOKFilterActive: false,
  };

  public filters = {
    defaultFilter: (node: any): boolean => true,
    // toBeVerifiedFilter: (node: any): boolean =>
    //   this.genericTreeComponent.getChildrenNodesLength(node) > 0 ||
    //   this.getNodeObjectMetaDataValue(node, "toBeVerified"),
    // notVerifiedFilter: (node: any): boolean =>
    //   this.genericTreeComponent.getChildrenNodesLength(node) > 0 ||
    //   (this.getNodeObjectMetaDataValue(node, "toBeVerified") &&
    //     !["Verified OK", "Verified NOK"].includes(this.getNodeObjectMetaDataValue(node, "verificationState"))),
    // verifiedNOKFilter: (node: any): boolean =>
    //   this.genericTreeComponent.getChildrenNodesLength(node) > 0 ||
    //   this.getNodeObjectMetaDataValue(node, "verificationState") === "Verified NOK",
  };

  // Tree
  public nodes: any[] = [];
  public treeNodeFactory: INodeFactory;

  public viewActionsService = new TableViewActionsService(this);
  public mvcEventSubscription: any;

  private refreshTimeOut = null;
  private refreshDelayMs = 1000;

  public commandService: ICommandService;
  public selectionService: ISelectionService;
  public viewService: IViewService;
  public modelMetadataService: ModelMetadataService;
  public modelService: ModelService;
  public scriptService: ScriptService;
  public modalViewService: IModalViewService;
  public metaModelService: IMetaModelService;
  public modelCommandsService: IModelCommandsService;
  public modelVerificationService: IModelVerificationService;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public genericContextMenuService: GenericContextMenuService,
    public genericTreeService: GenericTreeService,
    public servicesService: ServicesService
  ) {
    super(TableViewComponent.viewType, servicesService);

    this.commandService = this.servicesService.getService(ServicesConst.CommandService) as CommandService;
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
    this.modelMetadataService = this.servicesService.getService(
      ServicesConst.ModelMetadataService
    ) as ModelMetadataService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.scriptService = this.servicesService.getService(ServicesConst.ScriptService) as ScriptService;
    this.modalViewService = this.servicesService.getService(ServicesConst.ModalViewService) as ModalViewService;
    this.metaModelService = this.servicesService.getService(ServicesConst.MetaModelService) as IMetaModelService;
    this.modelCommandsService = this.servicesService.getService(
      ServicesConst.ModelCommandsService
    ) as IModelCommandsService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
  }

  public ngOnInit() {
    this.initTree();
    this.initMvc();
    // this.refresh();
  }

  public ngOnDestroy() {
    if (this.mvcEventSubscription) {
      this.mvcEventSubscription.unsubscribe();
    }
  }

  public initTree() {
    const tc = this.genericTreeComponent;
    tc.treeMemoService.setLocalStorageName(TableViewComponent.lsNameTableViewTree);
    tc.options.onSelectObjects = (objects: any[], value: any) => this.selectionService.selectObjects(objects, value);
    tc.options.onNodeMouseDown = (event: any, node: any) => this.onNodeMouseDown(event, node);
    tc.options.onNodeDoubleClick = (event: any, node: any) => this.onNodeDoubleClick(event, node);
    tc.options.onNodeRightClick = (event: any, node: any) => this.onNodeRightClick(event, node);
    // tc.options.onDrop = (event: any, node: any) => this.onDrop(event, node);
    tc.options.filter = this.filters.defaultFilter;

    this.treeNodeFactory = new TableTreeNodeFactory(tc.treeMemoService, {
      rootObject: () => this.modelService.getSelectedProject(),
      rootLabel: () => this.modelService.getSelectedProjectLabel(),
      nodeKeyPrefix: () => "table-node-",
      // modelMap: this.modelMetadataService.modelConfig.modelMap,
      buildNodeOverlay: (node: any) => this.buildNodeOverlay(node),
      translateLabel: (text: string) => this.translateService.translateFromMap(text),
      isTypeExtensionOfTypes: (type: string, extensions: string[]) =>
        this.metaModelService.isTypeExtensionOfTypes(type, extensions),
    });
  }

  public initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if ([MvcConst.MSG_END_LOADING_MODEL, MvcConst.MSG_END_SELECTING_PROJECT].includes(message.type)) {
        this.refresh();
      } else if ([MvcConst.MSG_BO_SELECTION_CHANGED].includes(message.type)) {
        this.refreshWithDelay();
      }
    });
  }

  public refreshWithDelay() {
    clearTimeout(this.refreshTimeOut);
    this.refreshTimeOut = setTimeout(() => {
      console.log("Table view refresh");
      this.changeDetectorRef.detectChanges();
    }, this.refreshDelayMs);
  }

  // Menus
  public onBtnMenuClicked(event: any) {
    this.showContextMenu(event, this.genericTreeComponent.clickedNode || (this.nodes.length ? this.nodes[0] : null));
    event.preventDefault();
    event.stopPropagation();
  }

  public showContextMenu(event: any, node: any, target: any = null) {
    if (node) {
      this.mainContextMenuComponent.showContextMenu(event, node);
    }
  }

  public refresh() {
    this.nodes = this.treeNodeFactory.buildNodes();
  }

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

      // if (node.object.type === "version" && node.object === this.modelService.getSelectedVersion()) {
      //   node.icons = [{ icon: ["fas", "check"] }];
      // }
      // if (node.object.type === "packagedElement") {
      //   node.isLazyLoaded = true;
      // }
      // if (node.label === "packagedElement") {
      //   node = null;
      // }
    }
    return node;
  }

  public onNodeMouseDown(event: any, node: any) {
    // if (event.buttons & 1) {
    //   this.genericContextMenuComponent.closeContextMenu();
    // }
  }

  public onNodeDoubleClick(event: any, node: any) {
    // if (!((node.nodes && node.nodes.length) || !node.nodesLoaded)) {
    //   if (event.ctrlKey) {
    //     if (node.object.type === ModelConstService.SCRIPT_TYPE) {
    //       this.onBtnExecuteClick(node);
    //     } else if (node.object.type === ModelConstService.DIAGRAM_TYPE) {
    //       this.onBtnOpenViewClick(node, { altView: true });
    //     }
    //   } else {
    //     this.onBtnOpenViewClick(node);
    //   }
    // }
  }

  public onNodeRightClick(event: any, node: any) {
    this.showContextMenu(event, node);
    event.preventDefault();
    event.stopPropagation();
  }

  public updateFilter() {
    // tslint:disable-next-line: prefer-const
    let filter = this.filters.defaultFilter;
    // if (this.treeItemOptions.isToBeVerifiedFilterActive) {
    //   filter = this.filters.toBeVerifiedFilter;
    // }
    // if (this.treeItemOptions.isNotVerifiedFilterActive) {
    //   filter = this.filters.notVerifiedFilter;
    // }
    // if (this.treeItemOptions.isVerifiedNOKFilterActive) {
    //   filter = this.filters.verifiedNOKFilter;
    // }
    this.genericTreeComponent.options.filter = filter;
  }

  // TODO in service
  public getNodeObjectMetaDataValue(node: any, propertyName: string): any {
    const metaData = this.getObjectMetaData(node.object);
    return metaData ? metaData[propertyName] : null;
  }

  public getObjectMetaData(object: any): any {
    return object ? object.metaData : null;
  }
}
