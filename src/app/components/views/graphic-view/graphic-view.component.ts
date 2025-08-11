import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, TemplateRef } from "@angular/core";
import { DiagramComponent } from "src/app/modules/diagram/components/diagram/diagram.component";
import { GraphicViewActionsService } from "./graphic-view-actions.service";
import { IViewComponent } from "../../../services/view/iview.component";
import { IViewService } from "../../../services/view/view.service";
import { ModelService } from "../../../services/model/model.service";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { DiagramController } from "src/app/modules/diagram/components/diagram/diagram.controller";
import { DiagramService } from "src/app/modules/diagram/services/diagram/diagram.service";
import { SvgObjectService } from "src/app/modules/diagram/services/svg-object/svg-object.service";
import { LibraryService } from "src/app/services/library/library.service";
import { ICommandService } from "src/app/common/services/command/command.service";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { MvcService } from "src/app/services/mvc/mvc.service";
import { ServicesService } from "src/app/services/services/services.service";
import { QueryService } from "src/app/services/transaction/query.service";
import { CloneService } from "src/app/common/services/clone/clone.service";
import { IBoFactoryService } from "src/app/common/services/bo-factory/bo-factory.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { TrackPlanDiagramController } from "./controllers/track-plan-diagram-controller";
import { TranslateService } from "src/app/services/translate/translate.service";
import { ModelPropertiesService } from "src/app/services/model/model-properties.service";
import { IModelCommandsService } from "src/app/services/model/model-commands.service";
import { IDiagram } from "src/app/modules/diagram/model/diagram/idiagram";
import { IView } from "src/app/services/view/iview";
import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";
import { DiagramEvent } from "src/app/modules/diagram/services/diagram/diagram-event";
import { VerificationTool } from "./tools/verification.tool";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { TypicalDiagramController } from "./controllers/typical-diagram-controller";
import { IGraphicConfigService } from "src/app/services/config/graphic-config.service";
import { ModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ISubTypeDiagramController } from "./controllers/idiagram-controller";
import { TracksidePhysicalArchitectureDiagramController } from "./controllers/trackside-physical-arch-diagram-controller";
import { OnBoardPhysicalArchitectureDiagramController } from "./controllers/onboard-physical-arch-diagram-controller";
import { RightsService } from "src/app/services/rights/rights.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { SvgConstService } from "src/app/modules/diagram/services/svg-object/svg-const.service";
import { LogicalInterfaceDiagramController } from "./controllers/logical-interface-diagram-controller";

@Component({
  selector: "app-graphic-view",
  templateUrl: "./graphic-view.component.html",
  styleUrls: ["./graphic-view.component.css"],
})
export class GraphicViewComponent implements OnInit, OnDestroy, IViewComponent {
  @ViewChild(DiagramComponent, { static: true })
  public diagramComponent: DiagramComponent;

  @ViewChild(GenericContextMenuComponent, { static: true })
  public mainContextMenuComponent: GenericContextMenuComponent;

  @ViewChild("toolTipTemplateVerification", { static: true })
  public toolTipTemplateVerificationRef: TemplateRef<any>;

  // config: { diagramId: bo.id, projectId: bo.projectId, }
  @Input()
  public config: any = {
    viewComponent: null,
  };

  public viewActionsService: GraphicViewActionsService = new GraphicViewActionsService(this, this.servicesService);

  public subTypeDiagramController: ISubTypeDiagramController;

  public diagramController: DiagramController;
  public diagramService: DiagramService;
  public svgObjectService: SvgObjectService;

  public diagram: any;
  public project: any;
  public boRoot: any;

  public options = {
    autoPlace: true,
    isSidePanelVisible: false,
    synchroBOSelection: true,
    centerOnSelection: true,
    useOptimLib: false,
    verifyMode: true,
  };

  public getViewTitleCB = null;

  public searchValue = "...";
  public lastSearch = [];

  private lockDiagramChangedSelectionEvent = false;
  private lockBOChangedSelectionEvent = false;

  public viewControllerOverlay: any;

  public mvcEventSubscription: any;

  public commandService: ICommandService;
  public boFactoryService: IBoFactoryService;
  public selectionService: ISelectionService;
  public queryService: QueryService;
  public cloneService: CloneService;
  public libraryService: LibraryService;
  public modelService: ModelService;
  public rightsService: RightsService;
  public mvcService: MvcService;
  public viewService: IViewService;
  public translateService: TranslateService;
  public modelPropertiesService: ModelPropertiesService;
  public modelCommandsService: IModelCommandsService;
  public modelVerificationService: IModelVerificationService;
  public graphicConfigService: IGraphicConfigService;
  public modelLoadSaveService: ModelLoadSaveService;

  constructor(public servicesService: ServicesService) {
    this.commandService = this.servicesService.getService(ServicesConst.CommandService) as ICommandService;
    this.boFactoryService = this.servicesService.getService(ServicesConst.BoFactoryService) as IBoFactoryService;
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.queryService = this.servicesService.getService(ServicesConst.QueryService) as QueryService;
    this.cloneService = this.servicesService.getService(ServicesConst.CloneService) as CloneService;
    this.libraryService = this.servicesService.getService(ServicesConst.LibraryService) as LibraryService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as MvcService;
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as RightsService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as TranslateService;
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as ModelPropertiesService;
    this.modelCommandsService = this.servicesService.getService(
      ServicesConst.ModelCommandsService
    ) as IModelCommandsService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.graphicConfigService = this.servicesService.getService(
      ServicesConst.GraphicConfigService
    ) as IGraphicConfigService;
    this.modelLoadSaveService = this.servicesService.getService(
      ServicesConst.ModelLoadSaveService
    ) as ModelLoadSaveService;
  }

  public ngOnInit() {
    this.config.viewComponent = this;

    this.mvcService.emit({ type: MvcConst.MSG_BEGIN_INIT_GRAPHIC_VIEW, view: this });
    this.initDiagramComponent();
    this.initMvc();
    this.initView();
    this.mvcService.emit({ type: MvcConst.MSG_END_INIT_GRAPHIC_VIEW, view: this });
  }

  public ngOnDestroy() {
    if (this.mvcEventSubscription) {
      this.mvcEventSubscription.unsubscribe();
    }
  }

  public translateFromMap(text: string): string {
    return this.translateService.translateFromMap(text);
  }

  public getViewTitle() {
    let title = this.translateService.translateFromMap("Visualization");
    if (this.diagram) {
      if (this.diagram.viewType) {
        title = this.translateService.translateFromMap(this.diagram.viewType);
      } else {
        if (this.diagram.label) {
          title = this.diagram.label;
        }
      }
    }
    if (this.getViewTitleCB) {
      title = this.getViewTitleCB();
    }
    return title;
  }

  private initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if (message.type === MvcConst.MSG_REFRESH_VIEW) {
        this.refreshDiagram();
      } else if ([MvcConst.MSG_END_SELECTING_PROJECT].includes(message.type)) {
        this.initView(true);
      } else if (message.type === MvcConst.MSG_END_LAZY_LOADING) {
        if (message.object && this.diagram && message.object.id === this.diagram.id) {
          this.initDiagram(this.diagram, false);
        }
      } else if (
        [MvcConst.MSG_COMMAND_EXECUTE, MvcConst.MSG_COMMAND_UNDO, MvcConst.MSG_COMMAND_REDO].includes(message.type)
      ) {
        this.refreshDiagram();
      } else if (message.type === MvcConst.MSG_BO_SELECTION_CHANGED) {
        this.onBOSelectionChange();
      } else if (message.type === MvcConst.MSG_FREEZE_SELECTION) {
        this.diagramService.selectionService.frozzenSelectionStatus = message.value;
      }
    });
  }

  private initDiagramComponent() {
    this.diagramController = this.diagramComponent.diagramController;
    this.diagramService = this.diagramController.diagramService;
    this.svgObjectService = this.diagramService.svgObjectService;

    // Diagram service customization
    this.diagramService.templateService.library = this.libraryService;

    this.diagramController.getToolTipTemplateCB = () =>
      this.options.verifyMode ? this.toolTipTemplateVerificationRef : null;

    this.diagramService.initSvgObjectCB = (svgObject: any) => {
      if (svgObject.boId && this.project) {
        const foundBo = this.modelService.getObjectById(this.project, svgObject.boId);
        svgObject.bo = foundBo ? foundBo : svgObject && svgObject.visObject ? svgObject.visObject.refObject : null;
      }
      return svgObject;
    };

    this.diagramService.getBoByIdCB = (id: any) => {
      return this.modelService.getObjectById(this.project, id);
    };

    this.diagramService.getScriptContextCB = () => {
      return {
        servicesService: this.servicesService,
        boRoot: this.project,
        rootSvgObject: this.diagram ? this.diagram.svgObject : null,
      };
    };

    this.diagramService.getDecorationSvgObjectsCB = (svgObject: any) => {
      // TODO use service
      const svgObjects = [];
      if (
        svgObject &&
        svgObject.bo &&
        svgObject.bo.metaData &&
        svgObject.bo.metaData.elementVerification &&
        svgObject.bo.metaData.elementVerification.verificationToBeVerified
      ) {
        // svgObjects.push({ type: SvgConstService.VERIFICATION_HANDLE, x: 0, y: 0 });

        if (svgObject && svgObject.ctrlData && svgObject.ctrlData.anc && svgObject.ctrlData.anc.boudingRect) {
          const scale = 0.15;
          const k = (0.27 * scale) / 0.2; // = 77/219 = 101/286
          const dx = -svgObject.ctrlData.anc.anchor.x * k;
          const dy = -svgObject.ctrlData.anc.anchor.y * k;
          const w = svgObject.ctrlData.anc.boudingRect.w * k;
          const h = svgObject.ctrlData.anc.boudingRect.h * k;

          let color = "gray";
          if (
            svgObject.bo.metaData.elementVerification.verificationState ===
            ModelVerificationService.verificationStateValues.verifiedOK
          ) {
            color = "green";
          } else if (
            svgObject.bo.metaData.elementVerification.verificationState ===
            ModelVerificationService.verificationStateValues.verifiedNOK
          ) {
            color = "red";
          }

          svgObjects.push({
            type: SvgConstService.RECT_OBJECT_TYPE,
            x: dx,
            y: dy,
            width: w,
            height: h,
            fill: "none",
            strokeWidth: "4",
            stroke: color,
            // style: "stroke-width:4; fill:none; stroke:" + color + ";",
            opacity: 0.2,
          });
        }

        this.diagramService.svgObjectService.decorationService.initDecorationSvgObjects(svgObjects);
      }
      return svgObjects;
    };

    this.diagramService.diagramEventEmitter.subscribe((event: any) => {
      // Select bos from go selection
      if (event.type === "ChangedSelection") {
        this.lockBOChangedSelectionEvent = true;
        const selectedSvgObjects = event.subject;
        // console.log("svg selection", selectedSvgObjects, this.diagram);
        // this.selectionService.selectSvgObjects(selectedSvgObjects);
        if (!this.lockDiagramChangedSelectionEvent) {
          const bos = this.diagramService.svgObjectService.getBosFromSvgObjects(selectedSvgObjects);
          this.selectionService.selectObjects(bos);
        }
        this.lockBOChangedSelectionEvent = false;
      } else if (event.type === DiagramEvent.ObjectContextClicked) {
        setTimeout(() => {
          this.showContextMenu(event.params.event);
        });
      }
    });

    // Tools
    this.diagramService.toolManager.addTool(new VerificationTool(this.diagramService.toolManager, this));
  }

  private initView(force = false) {
    if (!this.diagram || force) {
      let diagram = null;
      this.project = this.modelService.getProject(this.config.projectId);
      if (this.project) {
        diagram = this.modelService.getDiagram(this.config.projectId, this.config.diagramId);
      } else {
        diagram = this.libraryService.getDiagramById(this.config.diagramId);
      }
      this.initDiagram(diagram);
    }
  }

  public reinitDiagram() {
    this.initDiagram(this.diagram);
  }

  private initDiagram(diagram: IDiagram, testAndlazyLoad: boolean = true) {
    if (diagram) {
      this.diagram = this.diagramService.setDiagram(diagram);

      if (!this.subTypeDiagramController) {
        this.subTypeDiagramController = this.buildSubTypeDiagramController(this.diagram);
      }
      if (this.subTypeDiagramController) {
        if (testAndlazyLoad) {
          this.subTypeDiagramController.testAndLazyLoadVisualization(this.project, this.diagram);
        }
        this.subTypeDiagramController.initDiagram(diagram);
      }
      this.refreshDiagram();
      this.diagramService.commandManager.execute("ResetZoomCommand");
    } else {
      this.diagram = this.diagramService.diagram;
    }
  }

  private buildSubTypeDiagramController(diagram: any): any {
    let res = null;
    if (diagram) {
      if (diagram.type === ModelConstService.VISUALIZATION_TYPE) {
        if (diagram.viewType === ModelConstService.TRACKSIDE_PHYSICAL_ARCHITECTURE_DIAGRAM_TYPE) {
          res = new TracksidePhysicalArchitectureDiagramController(this);
        } else if (diagram.viewType === ModelConstService.ONBOARD_PHYSICAL_ARCHITECTURE_DIAGRAM_TYPE) {
          res = new OnBoardPhysicalArchitectureDiagramController(this);
        } else if (diagram.viewType === ModelConstService.LOGICAL_INTERFACE_DIAGRAM_TYPE) {
          res = new LogicalInterfaceDiagramController(this);
        } else {
          res = new TrackPlanDiagramController(this);
        }
      } else if (diagram.type === ModelConstService.TYPICAL_ITF_DIAGRAM_TYPE) {
        res = new TypicalDiagramController(this);
      }
      if (res) {
        res.init();
      }
    }
    return res;
  }

  public isThisView(view: IView) {
    return (
      view.type === "graphic-view" &&
      view.config.diagramId === this.config.diagramId &&
      view.config.projectId === this.config.projectId &&
      view.config.page === this.config.page
    );
  }

  public refreshDiagram() {
    this.diagramService.refreshDiagram();
  }

  public showContextMenu(event: any, node: any = null, target: any = null) {
    this.mainContextMenuComponent.showContextMenu(event, node);
  }

  public onBtnMenuClicked(event: any) {
    this.showContextMenu(event);
    event.preventDefault();
    event.stopPropagation();
  }

  public getLayerOptions(): any {
    return this.diagram.layerOptions;
  }

  public layerChangedEvent(layerOptions: any) {
    this.diagramService.layerService.applyLayerOptions(this.diagramService.diagram.layerOptions);
  }

  public resetLayerOptions() {
    this.diagramService.diagram.layerOptions = this.boFactoryService.buildBOFromType("layerOptions");
  }

  public onDragOver(event: any) {
    event.preventDefault();
  }

  public onDrop(event: any) {
    event.preventDefault();
  }

  public onBOSelectionChange() {
    if (
      this.options.synchroBOSelection &&
      !this.lockBOChangedSelectionEvent
      // && this.viewService.isViewComponentSelected(this)
    ) {
      this.lockDiagramChangedSelectionEvent = true;
      const sso = this.diagramService.svgObjectService.findSvgObjectsFromBos(
        this.selectionService.getSelectedObjects()
      );
      this.diagramService.selectionService.selectSvgObjects(sso);
      this.lockDiagramChangedSelectionEvent = false;
      this.diagramService.zoomScrollService.centerOnSelection();
    }
  }

  public searchAndSelect(value: any) {
    if (!this.lastSearch.includes(value)) {
      this.lastSearch.push(value);
    }
    const searchResult = this.diagramService.searchService.search(value);
    this.diagramService.selectionService.selectSvgObjects(searchResult.foundSvgObjects);
    this.diagramService.zoomScrollService.centerOnSelection();
  }

  public getVerificationTooltipData(svgObject: any): any {
    const res = {
      svgObject,
      bo: svgObject ? svgObject.bo : null,
      label: null,
      type: null,
      state: null,
      verificationToBeVerified: null,
      verificationState: null,
      verificationComment: null,
      verificationCR: null,
      verificationInputDocument: null,
    };
    const bo = svgObject ? svgObject.bo : null;
    if (bo) {
      const vd = this.modelVerificationService.getObjectVerificationData(bo);
      this.modelVerificationService.copyProperties(vd, res);

      res.label = bo.name || bo.label;
      res.type = this.modelPropertiesService.getObjectTypeLabel(bo);
      res.state = this.modelVerificationService.getObjectStateLabel(bo);
    }
    return res;
  }

  public refreshMode() {}

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
   * @returns
   */
  public canOpenVerifyDialog() {
    return this.canVerify() || this.canAnswerVerify();
  }
}
