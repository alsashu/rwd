import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from "@angular/core";
import { ContextMenuComponent } from "ngx-contextmenu";
import { ContextMenuService } from "ngx-contextmenu";
import { LibraryViewActionsService } from "./library-view-actions.service";
import { GenericContextMenuComponent } from "../../../components/app/generic-context-menu/generic-context-menu.component";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";
import { ServicesService } from "src/app/services/services/services.service";
import { IViewComponent } from "../../../services/view/iview.component";
import { IViewService } from "../../../services/view/view.service";
import { ModelMetadataService } from "../../../services/model/model-metadata.service";
import { ModelService } from "../../../services/model/model.service";
import { ModelConstService } from "../../../services/model/model-const.service";
import { ScriptService } from "../../../services/script/script.service";
import { ICommandService } from "../../../common/services/command/command.service";
import { MvcService } from "../../../services/mvc/mvc.service";
import { ISelectionService } from "../../../common/services/selection/selection.service";
import { IBoFactoryService } from "../../../common/services/bo-factory/bo-factory.service";
import { ModelMapNodeFactory } from "../../app/generic-tree/tree-factories/model-map.node-factory/model-map.node-factory";
import { ServicesConst } from "src/app/services/services/services.const";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { TranslateService } from "src/app/services/translate/translate.service";
import { IRuleService } from "src/app/services/rule/rule.service";
import { IWikiService } from "src/app/services/wiki/wiki.service";

@Component({
  selector: "app-library-view",
  templateUrl: "./library-view.component.html",
  styleUrls: ["./library-view.component.css"],
})
export class LibraryViewComponent implements OnInit, OnDestroy, IViewComponent {
  @ViewChildren(ContextMenuComponent)
  public contextMenus: QueryList<ContextMenuComponent>;
  @ViewChild("genericContextMenu", { static: true })
  public contextMenu: ContextMenuComponent;
  @ViewChild(GenericContextMenuComponent, { static: true })
  public genericContextMenuComponent: GenericContextMenuComponent;
  @ViewChild(GenericTreeComponent, { static: true })
  public genericTreeComponent: GenericTreeComponent;

  public viewActionsService = new LibraryViewActionsService(this);

  public nodes: any[] = [];
  public modelNodeFactory: ModelMapNodeFactory;

  public mvcEventSubscription: any;

  public commandService: ICommandService;
  public boFactoryService: IBoFactoryService;
  public selectionService: ISelectionService;
  public modelMetadataService: ModelMetadataService;
  public modelService: ModelService;
  public viewService: IViewService;
  public scriptService: ScriptService;
  public mvcService: MvcService;
  public translateService: TranslateService;
  public ruleService: IRuleService;
  public wikiService: IWikiService;

  constructor(private contextMenuService: ContextMenuService, public servicesService: ServicesService) {
    this.commandService = this.servicesService.getService(ServicesConst.CommandService) as ICommandService;
    this.boFactoryService = this.servicesService.getService(ServicesConst.BoFactoryService) as IBoFactoryService;
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.modelMetadataService = this.servicesService.getService(
      ServicesConst.ModelMetadataService
    ) as ModelMetadataService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
    this.scriptService = this.servicesService.getService(ServicesConst.ScriptService) as ScriptService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as MvcService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as TranslateService;
    this.ruleService = this.servicesService.getService(ServicesConst.RuleService) as IRuleService;
    this.wikiService = this.servicesService.getService(ServicesConst.WikiService) as IWikiService;
  }

  public ngOnInit() {
    this.initTree();
    this.initMvc();
    this.initView();
  }

  public initTree() {
    const tc = this.genericTreeComponent;
    tc.treeMemoService.setLocalStorageName("rvw-library-tree");
    tc.options.onSelectObjects = (objects: any[], value: any) =>
      this.selectionService.selectLibraryObjects(objects, value);
    tc.options.onNodeMouseDown = (event: any, node: any) => this.onNodeMouseDown(event, node);
    tc.options.onNodeDoubleClick = (event: any, node: any) => this.onNodeDoubleClick(event, node);
    tc.options.onNodeRightClick = (event: any, node: any) => this.onNodeRightClick(event, node);

    const library = this.modelService.getLibrary();
    this.modelNodeFactory = new ModelMapNodeFactory(tc.treeMemoService, {
      rootObjects: () =>
        this.modelService.getLibrary() && this.modelService.getLibrary().libraryObjects
          ? this.modelService.getLibrary().libraryObjects
          : [],
      modelMap: this.modelMetadataService.modelConfig.modelMap,
      buildNodeOverlay: (node: any) => {
        return node && node.object && node.object.isVisible === false ? null : node;
      },
      translateLabel: (text: string) => this.translateService.translateFromMap(text),
      translateModelClassName: (text: string) => this.translateService.translateModelClassName(text),
    });
  }

  /**
   * Init MVC
   */
  public initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if ([MvcConst.MSG_MODEL_CHANGED, MvcConst.MSG_PROJECT_CLOSED].includes(message.type)) {
        this.refresh();
      }
    });
  }

  public ngOnDestroy() {
    if (this.mvcEventSubscription) {
      this.mvcEventSubscription.unsubscribe();
    }
  }

  public translateFromMap(text: string): string {
    return this.translateService.translateFromMap(text);
  }

  public isThisView(view: any) {
    return view.type === "library-view";
  }

  public initView() {
    this.refresh();
  }

  public refresh() {
    this.nodes = this.modelNodeFactory.buildNodes();
  }

  // Events
  public onNodeMouseDown(event: any, node: any) {}

  public onNodeDoubleClick(event: any, node: any) {
    //    if (!(node.nodes && node.nodes.length || !node.nodesLoaded)) {
    if (node && node.object) {
      if (event.ctrlKey) {
        // this.onBtnEditScriptClick(node.object);
      } else {
        if (node.object.type === ModelConstService.RULE_PROTOTYPE_TYPE) {
          // this.onBtnExecScriptClick(node.object);
          this.onBtnAddRuleClick(node.object);
        } else {
          // this.onBtnEditClick(node.object);
        }
      }
    }
  }

  public onNodeRightClick(event: any, node: any) {
    this.showContextMenu(event, node);
    event.preventDefault();
    event.stopPropagation();
  }

  // Menus
  public showContextMenu(event: any, node: any, target: any = null) {
    if (node) {
      this.genericContextMenuComponent.showContextMenu(event, node);
    }
  }

  public onBtnMenuClicked(event: any) {
    this.showContextMenu(event, this.genericTreeComponent.clickedNode || (this.nodes.length ? this.nodes[0] : null));
    event.preventDefault();
    event.stopPropagation();
  }

  // Actions
  public onBtnSave() {
    // this.modelService.saveLibrariesToServer();
  }

  public onBtnAddRuleClick(object: any) {
    if (object && object.type === ModelConstService.RULE_PROTOTYPE_TYPE) {
      this.ruleService.insertRuleFromLibrary(object, null);
    }
  }

  public canAddRuleClick(object: any): boolean {
    return object && object.type === ModelConstService.RULE_PROTOTYPE_TYPE;
  }

  public onBtnRuleWikiPageClick(object: any) {
    if (object && object.type === ModelConstService.RULE_PROTOTYPE_TYPE && object.wikiPage) {
      this.viewService.openWikiViewPage(object.wikiPage);
    }
  }

  public canRuleWikiPageClick(object: any): boolean {
    return object && object.type === ModelConstService.RULE_PROTOTYPE_TYPE && object.wikiPage;
  }

  public onBtnEditClick(object: any) {
    // this.viewService.openViewFromBo(object);
  }

  public onBtnEditScriptClick(object: any) {
    // if (object && object.controlerData && object.controlerData.script) {
    //   this.viewService.openViewFromBo(object.controlerData.script);
    // }
  }

  public onBtnExecScriptClick(object: any) {
    // if (
    //   object &&
    //   object.controlerData &&
    //   object.controlerData.script &&
    //   object.type == ModelConstService.RULE_PROTOTYPE_TYPE
    // ) {
    //   const script = object.controlerData.script;
    //   const code = script.code;
    //   this.scriptService.executeCode(code);
    // }
  }

  public onBtnInstanciateDiagramClick(object: any) {
    // if (object && object.type == ModelConstService.DIAGRAM_PROTOTYPE_TYPE) {
    //   let cmds = this.modelExeService.getInstanciateDiagramCommands(this.modelService.getSelectedVersion(), this.selectionService.getSelectedObjects(), object);
    //   this.commandService.executeCommands(cmds, "Instanciation schéma");
    // }
  }

  public onBtnNewClick(selectedObject: any, params: any) {
    // if (
    //   selectedObject &&
    //   [ModelConstService.LIBRARY_FOLDER_TYPE, ModelConstService.LIBRARY_TYPE].includes(selectedObject.type)
    // ) {
    //   const newObject = this.boFactoryService.buildBOFromType(params.type, params);
    //   if (newObject) {
    //     if (selectedObject.libraryObjects === undefined) {
    //       selectedObject.libraryObjects = [];
    //     }
    //     // TODO Command
    //     selectedObject.libraryObjects.push(newObject);
    //     this.refresh();
    //   }
    // }
  }
}
