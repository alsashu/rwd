import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy } from "@angular/core";
import { SearchViewActionsService } from "./search-view-actions.service";
import { IViewComponent } from "../../../services/view/iview.component";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { INodeFactory } from "../../app/generic-tree/tree-factories/inode-factory";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IMetaModelService } from "src/app/services/meta/meta-model.service";
import { GenericContextMenuService } from "../../app/generic-context-menu/generic-context-menu.service";
import { GenericTreeService } from "../../app/generic-tree/generic-tree.service";
import { SearchTreeNodeFactory } from "./search-tree-node-factory/search-tree.node-factory";
import { ModelVisitor } from "src/app/services/model/model.visitor";
import { ISearchService } from "src/app/services/search/search.service";
import { AViewComponent } from "../base/aview.component";
import { IModalViewService } from "src/app/services/modal/imodal-view.service";

@Component({
  selector: "app-search-view",
  templateUrl: "./search-view.component.html",
  styleUrls: ["../../app/generic-tree/generic-tree.component.css", "./search-view.component.css"],
})
/**
 * Search view component
 */
export class SearchViewComponent extends AViewComponent implements OnInit, IViewComponent, OnDestroy {
  public static viewType = "search-view";
  private static lsNameSearchTree = "alm-rvw-search-tree";

  @ViewChild(GenericContextMenuComponent, { static: true })
  public mainContextMenuComponent: GenericContextMenuComponent;
  @ViewChild(GenericTreeComponent, { static: true })
  public genericTreeComponent: GenericTreeComponent;
  @ViewChild("search-bar")
  public searchBar: ElementRef;

  public options = {
    categoryDisplayMode: true,
  };

  public treeItemOptions = {};

  // Tree
  public nodes: any[] = [];
  public model: any = null;

  public searchValue = "";
  public searchOptions = {
    caseSensitive: false,
    namesOrPropertiesOnly: false,
    filterObjectType: "*",
    // filterObjectType: "argos:pedale",
    filterPropertyName: null,
    // filterPropertyName: "pos",
  };
  public lastSearch = [];
  public searchResult: any;
  public treeNodeFactory: INodeFactory;

  private refreshTimeOut = null;
  private refreshDelayMs = 1000;

  public viewActionsService = new SearchViewActionsService(this);
  public mvcEventSubscription: any;

  private selectionService: ISelectionService;
  private metaModelService: IMetaModelService;
  private searchService: ISearchService;
  public modalViewService: IModalViewService;

  /**
   * Constructor
   * @param changeDetectorRef The changeDetectorRef
   * @param genericContextMenuService The genericContextMenuService
   * @param genericTreeService The genericTreeService
   * @param servicesService The services Service
   */
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public genericContextMenuService: GenericContextMenuService,
    public genericTreeService: GenericTreeService,
    public servicesService: ServicesService
  ) {
    super(SearchViewComponent.viewType, servicesService);

    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.metaModelService = this.servicesService.getService(ServicesConst.MetaModelService) as IMetaModelService;
    this.searchService = this.servicesService.getService(ServicesConst.SearchService) as ISearchService;
    this.modalViewService = this.servicesService.getService(ServicesConst.ModalViewService) as IModalViewService;
  }

  /**
   * Component init
   */
  public ngOnInit() {
    this.initTree();
    this.initMvc();
  }

  /**
   * Component destroy
   */
  public ngOnDestroy() {
    if (this.mvcEventSubscription) {
      this.mvcEventSubscription.unsubscribe();
    }
  }

  /**
   * Tree init
   */
  public initTree() {
    const tc = this.genericTreeComponent;
    tc.treeMemoService.setLocalStorageName(SearchViewComponent.lsNameSearchTree);
    tc.options.onSelectObjects = (objects: any[], value: any) => this.selectionService.selectObjects(objects, value);
    tc.options.onNodeRightClick = (event: any, node: any) => this.onNodeRightClick(event, node);

    this.treeNodeFactory = new SearchTreeNodeFactory(tc.treeMemoService, {
      rootLabel: () => this.translateService.translateFromMap("Search results"),
      rootObject: () => {
        return {
          searchResults: this.searchService.searchResults,
          label: this.translateService.translateFromMap("Search results"),
        };
      },
      nodeKeyPrefix: () => "search-node-",
      translateLabel: (text: string) => this.translateService.translateFromMap(text),
      translateModelClassName: (text: string) => this.translateService.translateModelClassName(text),
      isTypeExtensionOfTypes: (type: string, extensions: string[]) =>
        this.metaModelService.isTypeExtensionOfTypes(type, extensions),
    });
  }

  /**
   * MVC init
   */
  public initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if ([MvcConst.MSG_END_LOADING_MODEL, MvcConst.MSG_END_SELECTING_PROJECT].includes(message.type)) {
        this.refresh();
      } else if ([MvcConst.MSG_BO_SELECTION_CHANGED].includes(message.type)) {
        this.refreshWithTempo();
      }
    });
  }

  /**
   * Refresh with delay
   */
  public refreshWithTempo() {
    clearTimeout(this.refreshTimeOut);
    this.refreshTimeOut = setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, this.refreshDelayMs);
  }

  /**
   * Context menu tool bar button
   * @param event
   */
  public onBtnMenuClicked(event: any) {
    this.showContextMenu(event, this.genericTreeComponent.clickedNode || (this.nodes.length ? this.nodes[0] : null));
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Show context menu
   * @param event The event
   * @param node The clicked node
   * @param target The event target
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
  }

  /**
   * Right click event
   * @param event The event
   * @param node The clicked node
   */
  public onNodeRightClick(event: any, node: any) {
    this.showContextMenu(event, node);
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Search in the project data
   */
  public search() {
    if (!this.lastSearch.includes(this.searchValue)) {
      this.lastSearch.push(this.searchValue);
    }
    this.searchService.search({ searchString: this.searchValue, options: this.searchOptions });
    this.refresh();
  }

  /**
   *
   * @param objects
   * @param value
   * @returns
   */
  public onSelectionSearchResult(objects: any, value: any) {
    const realObjects = [];
    for (const obj of objects) {
      const realObj = new ModelVisitor().findCB(this.model, (o: any) => {
        return o && o.id === obj.id;
      });
      realObjects.push(realObj);
    }
    console.log(realObjects);
    return this.selectionService.selectObjects(objects, value);
  }

  /**
   * Option click
   */
  public onOptionsClick() {
    const params = {
      formData: {
        caseSensitive: this.searchOptions.caseSensitive,
        namesOrPropertiesOnly: this.searchOptions.namesOrPropertiesOnly,
        filterObjectType: this.searchOptions.filterObjectType,
        filterPropertyName: this.searchOptions.filterPropertyName,
        userName: "",
        password: "",
        newPassword: "",
      },
    };
    this.modalViewService.openSearchOptionsModal(params, (result: any) => {
      this.searchOptions.caseSensitive = result.formData.caseSensitive;
      this.searchOptions.namesOrPropertiesOnly = result.formData.namesOrPropertiesOnly;
      this.searchOptions.filterObjectType = result.formData.filterObjectType;
      this.searchOptions.filterPropertyName = result.formData.filterPropertyName;
    });
  }
}
