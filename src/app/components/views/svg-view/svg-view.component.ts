import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { IViewComponent } from "../../../services/view/iview.component";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { SvgViewActionsService } from "./svg-view-actions.service";
import { DomSanitizer } from "@angular/platform-browser";
import { IView } from "src/app/services/view/iview";
import { SvgDiagramComponent } from "src/app/modules/svg-diagram/components/svg-diagram/svg-diagram.component";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IModelPropertiesService } from "src/app/services/model/model-properties.service";
import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";
import { IModelService } from "src/app/services/model/model.service";
import { IRightsService } from "src/app/services/rights/rights.service";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { ISvgDiagramService } from "src/app/modules/svg-diagram/services/diagram/svg-diagram.service";
import { SvgDiagramEvent } from "src/app/modules/svg-diagram/services/diagram/svg-diagram-event";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { VerificationTool } from "./tools/verification.tool";
import { RightsConst } from "src/app/services/rights/rights.const";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { TrackPlanSvgDiagramController } from "./controllers/track-plan-svg-diagram-controller";
import { ISubTypeSvgDiagramController } from "./controllers/isvg-diagram-controller";
import { OnBoardPhysicalArchitectureSvgDiagramController } from "./controllers/onboard-physical-arch-svg-diagram-controller";
import { TracksidePhysicalArchitectureSvgDiagramController } from "./controllers/trackside-physical-arch-svg-diagram-controller";
import { LogicalInterfaceSvgDiagramController } from "./controllers/logical-interface-svg-diagram-controller";
import { AViewComponent } from "../base/aview.component";
import { CompareService, ICompareService } from "src/app/services/compare/compare.service";
import { WiringSvgDiagramController } from "./controllers/wiring-svg-diagram-controller";

@Component({
  selector: "app-svg-view",
  templateUrl: "./svg-view.component.html",
  styleUrls: ["./svg-view.component.css"],
})
/**
 * Diagram view component that displays diagrams using a svg file
 */
export class SvgViewComponent extends AViewComponent implements OnInit, OnDestroy, IViewComponent {
  public static viewType = "svg-view";

  @ViewChild(SvgDiagramComponent, { static: true })
  public svgDiagramComponent: SvgDiagramComponent;

  @ViewChild(GenericContextMenuComponent, { static: true })
  public mainContextMenuComponent: GenericContextMenuComponent;

  @ViewChild("tooltipTemplateVerification", { static: true })
  public tooltipTemplateVerificationRef: TemplateRef<any>;

  @Input()
  public config: any = {
    viewComponent: null,
  };

  public viewActionsService: SvgViewActionsService = new SvgViewActionsService(this, this.servicesService);

  public diagram: any;
  public project: any;

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
  private isDirty = true;

  private lockDiagramChangedSelectionEvent = false;
  private lockBOChangedSelectionEvent = false;
  private mvcEventSubscription: any;
  private subTypeDiagramController: ISubTypeSvgDiagramController;

  public svgDiagramService: ISvgDiagramService;

  private selectionService: ISelectionService;
  private modelService: IModelService;
  private rightsService: IRightsService;
  private modelPropertiesService: IModelPropertiesService;
  private modelVerificationService: IModelVerificationService;
  private compareService: ICompareService;

  /**
   * Constructor
   */
  constructor(public servicesService: ServicesService, private sanitizer: DomSanitizer) {
    super(SvgViewComponent.viewType, servicesService);

    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as IRightsService;
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as IModelPropertiesService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.compareService = this.servicesService.getService(ServicesConst.CompareService) as ICompareService;
  }

  /**
   * OnInit function
   */
  public ngOnInit() {
    this.config.viewComponent = this;
    this.svgDiagramService = this.svgDiagramComponent.svgDiagramService;

    this.mvcService.emit({ type: MvcConst.MSG_BEGIN_INIT_SVG_DIAGRAM_VIEW, view: this });
    this.initSvgDiagramComponent();
    this.initMvc();
    this.initView();
    this.mvcService.emit({ type: MvcConst.MSG_END_INIT_SVG_DIAGRAM_VIEW, view: this });
  }

  /**
   * OnDestroy function
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
      view &&
      SvgViewComponent &&
      view.type === SvgViewComponent.viewType &&
      view.config &&
      view.config.diagramId === this.config.diagramId &&
      view.config.projectId === this.config.projectId &&
      view.config.page === this.config.page &&
      view.config.diagramVisId === this.config.diagramVisId &&
      view.config.visType === this.config.visType
    );
  }

  /**
   * Get the view title
   * @returns The title
   */
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

  /**
   * Init the MVC messages subsciption
   */
  private initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if (
        [MvcConst.MSG_END_SELECTING_PROJECT, MvcConst.MSG_END_LOADING_PROJECT_FOR_COMPARISON].includes(message.type)
      ) {
        this.initView(true);
      } else if (
        [MvcConst.MSG_END_LOADING_PROJECT_COMPARISON_FILE, MvcConst.MSG_RESET_COMPARISON].includes(message.type)
      ) {
        setTimeout(() => {
          this.initView(true);
        }, 100);
      } else if (
        [MvcConst.MSG_COMMAND_EXECUTE, MvcConst.MSG_COMMAND_UNDO, MvcConst.MSG_COMMAND_REDO].includes(message.type)
      ) {
        // TODO: refresh only on verif commands for more efficiency
        this.refreshDiagram(true);
      } else if (message.type === MvcConst.MSG_VIEW_SELECTION_CHANGED) {
        if (this.isThisView(message.view)) {
          // Refresh delay, wait for the view to be visible...
          setTimeout(() => {
            this.refreshDiagram();
          }, 100);
        }
      } else if (message.type === MvcConst.MSG_BO_SELECTION_CHANGED) {
        this.onBOSelectionChange();
      } else if (message.type === MvcConst.MSG_FREEZE_SELECTION) {
        this.svgDiagramComponent.svgDiagramService.selectionService.setIsSelectionFrozzen(message.value);
      }
    });
  }

  /**
   * Init the svg diagram component
   */
  private initSvgDiagramComponent() {
    // Subscriptions to events
    this.svgDiagramService.diagramEventEmitter.subscribe((event: any) => {
      if (event.type === SvgDiagramEvent.ChangedSelection) {
        this.onGOSelectionChange(event.subject);
      } else if (event.type === SvgDiagramEvent.ObjectContextClicked) {
        setTimeout(() => {
          this.showContextMenu(event.params.event);
        });
      }
    });

    // Tooltips
    this.svgDiagramComponent.tooltipTemplateCB = () =>
      this.options.verifyMode ? this.tooltipTemplateVerificationRef : null;
    this.svgDiagramComponent.tooltipDataCB = this.getTooltipDataCB;

    // Specific tools
    this.svgDiagramService.toolManager.addTool(new VerificationTool(this.svgDiagramService.toolManager, this));
  }

  /**
   * Init the view
   * @param force Force to init the view even if the diagram was previously set
   */
  private initView(force = false) {
    if (!this.diagram || force) {
      let diagram = null;
      this.project = this.modelService.getProject(this.config.projectId);
      if (this.project) {
        diagram = this.modelService.getDiagram(this.config.projectId, this.config.diagramId);
      }
      this.initDiagram(diagram);
    }
  }

  /**
   * Init the diagram of the view
   * @param diagram The diagram
   */
  private initDiagram(diagram: any) {
    if (diagram) {
      this.diagram = diagram;
      if (!this.subTypeDiagramController) {
        this.subTypeDiagramController = this.buildSubTypeDiagramController(this.diagram);
      }
      if (this.subTypeDiagramController) {
        this.subTypeDiagramController.testAndLazyLoadVisualization(this.project, this.diagram);

        // Comparison: loading svg diagrams of other projects
        if (this.compareService.comparisonIsComputed()) {
          const selectedProject = this.modelService.getSelectedProject();
          this.compareService.getCompareProjectList().forEach((compareProject: any) => {
            if (compareProject !== selectedProject) {
              this.subTypeDiagramController.testAndLazyLoadVisualization(compareProject, this.diagram);
            }
          });
        }
        this.subTypeDiagramController.refreshLayers();
        this.subTypeDiagramController.initDiagram(diagram);
      }
      this.refreshDiagram(true);
    }
  }

  /**
   * Function called after loading the svg file from the server
   * @param svgData The svg data from the svg file
   * @param project The related project
   */
  public onSvgDataLoaded(svgData: any, project: any) {
    const selectedProject = this.modelService.getSelectedProject();
    // Svg diagram of opened project?
    if (project && project === selectedProject) {
      this.svgDiagramComponent.setSvgData(svgData);
      this.svgDiagramComponent.svgModel.svgYellowObjectList = [];
      this.initBoAssociation(project, this.svgDiagramComponent.getSvgObjectList());
      if (this.subTypeDiagramController) {
        this.subTypeDiagramController.initDiagram(this.diagram);
      }
      
      // Debug logical group associations
      this.debugLogicalGroupAssociations(project);
      
      // this.doTest(); // TODO
    } else {
      // Loading svg of a comparison project
      this.svgDiagramComponent.setSvgCompareData(svgData, project);
      this.initBoAssociation(project, this.svgDiagramComponent.getSvgObjectListCompare(project));
      this.computeRedAndYellow(project);
    }
    this.refreshDiagram(true);
  }

  // private doTest() {
  //   const selectedProject = this.modelService.getSelectedProject();
  //   const svgObjectList = this.svgDiagramComponent.getSvgObjectList();
  //   const svgObjectSignal3038 = svgObjectList.find(
  //     (svgObject: any) => svgObject.bo && svgObject.bo.label === "3038" && svgObject.bo.type === "signal"
  //   );
  //   this.svgDiagramComponent.copySvgObject(svgObjectSignal3038);
  // }

  /**
   * Compute red and yellow
   * @param comparisonProject Comparison project
   */
  private computeRedAndYellow(comparisonProject: any) {
    this.copyYellowSvgObjectsToMainSvg(comparisonProject);
    this.setToRedSvgObjectsInMainSvg(comparisonProject);
    // Reset event listeners for red and yellow new svg objects
    this.svgDiagramComponent.svgDiagramEventController.initEventListeners();
  }

  /**
   * Copy svg objects of comparison project to main diagram
   * @param comparisonProject The comparison project
   */
  private setToRedSvgObjectsInMainSvg(comparisonProject: any) {
    if (comparisonProject) {
      const svgObjects = this.svgDiagramComponent.getSvgObjectList();
      const svgObjectsFiltered = svgObjects.filter((svgObject: any) =>
        this.filterRedSvgObject(svgObject, comparisonProject)
      );
      svgObjectsFiltered.forEach((svgElement: any) => {
        svgElement.isRed = true;
        svgElement.versionId = comparisonProject.id;
        svgElement.projectName = comparisonProject.label;
        svgElement.projectIndex = this.compareService.getCompareProjectIndex(comparisonProject);
      });
    }
  }

  /**
   * Copy svg objects of comparison project to main diagram
   * @param comparisonProject The comparison project
   */
  private copyYellowSvgObjectsToMainSvg(comparisonProject: any) {
    if (comparisonProject) {
      const svgObjects = this.svgDiagramComponent.getSvgObjectListCompare(comparisonProject);
      const svgObjectsFiltered = svgObjects.filter((svgObject: any) =>
        this.filterYellowSvgObject(svgObject, comparisonProject)
      );
      const svgClones = this.svgDiagramComponent.copySvgObjectsToMainSvg(svgObjectsFiltered);
      svgClones.forEach((svgElement: any) => {
        svgElement.isYellow = true;
        svgElement.versionId = comparisonProject.id;
        svgElement.projectName = comparisonProject.label;
        svgElement.projectIndex = this.compareService.getCompareProjectIndex(comparisonProject);
      });
      this.svgDiagramComponent.svgModel.svgYellowObjectList =
        this.svgDiagramComponent.svgModel.svgYellowObjectList.concat(svgClones);
    }
  }

  /**
   * Filter yellow (removed) objet
   * @param svgObject svg object
   * @param compareProject compare project
   * @returns boolean value
   */
  private filterYellowSvgObject(svgObject: any, compareProject: any): boolean {
    return this.filterSvgObject(
      svgObject,
      [
        CompareService.CompareState.deleted,
        CompareService.CompareState.modified,
        CompareService.CompareState.graphicalModifiedOnly,
      ],
      compareProject
    );
  }

  /**
   * Filter red (added) objets
   * @param svgObject svg object
   * @param compareProject compare project
   * @returns boolean value
   */
  private filterRedSvgObject(svgObject: any, compareProject: any): boolean {
    return this.filterSvgObject(
      svgObject,
      [
        CompareService.CompareState.new,
        CompareService.CompareState.modified,
        CompareService.CompareState.graphicalModifiedOnly,
      ],
      compareProject
    );
  }

  /**
   * Filter svgObject from comparison project
   * @param svgObject The svgObject of compaison project
   * @returns Boolean value
   */
  private filterSvgObject(svgObject: any, states: any[], compareProject: any): boolean {
    let res = false;
    if (svgObject && svgObject.bo) {
      const compareMap = this.compareService.getCompareObjectsDataMap(svgObject.bo);
      if (compareMap) {
        // console.log(compareMap);
        if (compareMap && compareMap.dataPerVersionList) {
          // Validated old code with 2 projects comparison
          if (compareMap.dataPerVersionList.length === 2) {
            const dataNewVersion = compareMap.dataPerVersionList[1];
            if (dataNewVersion && states.includes(dataNewVersion.compareState)) {
              res = true;
              if (dataNewVersion.compareState === CompareService.CompareState.modified) {
                // console.log(dataNewVersion);
              }
            }
          }
          // TODO n projects comparison
          else {
            // n projects comparison
            const dataNewVersion = compareMap.dataPerVersionList.find(
              (dpvl: any) => dpvl.version && compareProject && dpvl.version.id === compareProject.id
            );
            if (dataNewVersion && states.includes(dataNewVersion.compareState)) {
              res = true;
              if (dataNewVersion.compareState === CompareService.CompareState.modified) {
                // console.log(dataNewVersion);
              }
            }
          }
        }
      }
    }
    return res;
  }

  /**
   * Init the link between the graphical objects of the diagram and the business objects from the model
   */
  public initBoAssociation(project: any, svgObjectList: any[]) {
    if (project && svgObjectList) {
      const idAndTypeBoMap = this.modelService.createIdAndTypeBoMap(project);
      let projectIndex = this.compareService.getCompareProjectIndex(project);
      svgObjectList.forEach((svgObject: any) => {
        const bo = this.modelService.getObjectByItemIdAndObjectClassNameAndMap(
          {
            itemId: svgObject.getAttribute("item_id"),
            objectClassName: svgObject.getAttribute("object_class_name"),
          },
          idAndTypeBoMap
        );
        svgObject.bo = bo;
        svgObject.projectId = project.id;
        svgObject.projectName = project.label;
        svgObject.projectIndex = projectIndex;
        
        // Enhanced logical group association
        if (bo && bo.type) {
          this.associateLogicalGroups(svgObject, bo, project);
        }
      });
    }
  }

  /**
   * Associate logical groups with SVG objects
   * @param svgObject The SVG object
   * @param bo The business object
   * @param project The project
   */
  private associateLogicalGroups(svgObject: any, bo: any, project: any) {
    const logicalElements = project["GenericADM:logicalElements"];
    if (logicalElements) {
      // Check if this object belongs to any logical group
      const groupTypes = [
        "GenericADM:alphaLogicalAreaGroups",
        "GenericADM:betaLogicalAreaGroups", 
        "GenericADM:logicalAreaGroups",
        "GenericADM:specificLogicalAreaGroups"
      ];

      groupTypes.forEach(groupTypeKey => {
        const groups = logicalElements[groupTypeKey];
        if (Array.isArray(groups)) {
          groups.forEach((group: any) => {
            // Check GenericADM:LinkedLogicalAreas for references
            const linkedAreas = group["GenericADM:LinkedLogicalAreas"];
            if (Array.isArray(linkedAreas)) {
              const foundLink = linkedAreas.find((link: any) => 
                link.elementIDRef === bo.id || 
                link.elementIDRef === bo.itemId ||
                link.elementtypeRef === bo.type
              );
              if (foundLink) {
                svgObject.logicalGroup = group;
                svgObject.logicalGroupType = groupTypeKey;
                console.log(`Associated SVG object ${bo.id} with logical group: ${group.name || group.label} (${groupTypeKey})`);
              }
            }
          });
        }
      });
    }
  }

  /**
   * Refresh the diagram after model modifications
   */
  private refreshDiagram(isDirty = false) {
    // Test visibility of the view because impossible to display verification decoration if the view is hidden
    if ((isDirty || this.isDirty) && this.viewService.isViewComponentSelected(this)) {
      this.refreshDiagramVerificationStatus();
      this.isDirty = false;
    } else {
      this.isDirty = isDirty;
    }
    this.svgDiagramService.layerService.applyLayerOptions();
  }

  /**
   * Refresh the svg objects appearance according to the verification states
   */
  private refreshDiagramVerificationStatus() {
    this.svgDiagramService.svgObjectService.forEachCB((svgObject: any) => {
      this.refreshSvgObjectVerificationStatus(svgObject);
    });
  }

  /**
   * Refresh the verification status of a svg object
   * @param svgObject The svg object
   */
  private refreshSvgObjectVerificationStatus(svgObject: any) {
    const bo = svgObject.bo;
    if (bo && bo.metaData && bo.metaData.elementVerification) {
      this.setSvgObjectDecorationForVerificationStatus(svgObject, bo.metaData.elementVerification);
    }
  }

  /**
   * Set svgObject decoration according to verification status
   * @param svgObject The svg object
   * @param elementVerification The verification value
   */
  private setSvgObjectDecorationForVerificationStatus(svgObject: any, elementVerification: any) {
    const renderer = this.svgDiagramComponent.renderer;
    if (renderer) {
      this.removeSelectionDecorationElement(svgObject);

      if (elementVerification.verificationToBeVerified) {
        let className = "svg-item-verif-deco-tobeverified";
        if (elementVerification.verificationState === ModelVerificationService.verificationStateValues.verifiedOK) {
          className = "svg-item-verif-deco-ok";
        } else if (
          elementVerification.verificationState === ModelVerificationService.verificationStateValues.verifiedNOK
        ) {
          className = "svg-item-verif-deco-nok";
        }
        this.addSelectionDecorationElement(svgObject, className);
      }
    }
  }

  /**
   * Remove if exists the selection element
   * @param svgObject The svg object
   */
  private removeSelectionDecorationElement(svgObject: any) {
    if (svgObject) {
      const renderer = this.svgDiagramService.svgDiagramComponent.renderer;
      let lastElementChild = svgObject.lastElementChild;
      if (renderer && lastElementChild && lastElementChild.classList && lastElementChild.classList.contains) {
        if (lastElementChild.classList.contains("svg-item-verif-deco")) {
          renderer.removeChild(svgObject, lastElementChild);
        }
      }
    }
  }

  /**
   * Add a selection element
   * @param svgObject The svg object
   */
  private addSelectionDecorationElement(svgObject: any, className: string) {
    const renderer = this.svgDiagramService.svgDiagramComponent.renderer;
    if (renderer && svgObject) {
      const rect = this.getSvgObjectBBoxRect(svgObject);
      if (rect.width && rect.height) {
        const decorationElement = renderer.createElement("g", "http://www.w3.org/2000/svg");
        renderer.appendChild(svgObject, decorationElement);
        renderer.addClass(decorationElement, "svg-item-verif-deco");
        renderer.addClass(decorationElement, className);
        // const dashArray = "6,10";
        const dashArray = "10, 6";
        let html = `<path d="M${rect.x},${rect.y} h${rect.width} v${rect.height} h-${rect.width} z" stroke-dasharray="${dashArray}" />`;
        renderer.appendChild(svgObject, decorationElement);
        if (className === "svg-item-verif-deco-nok") {
          html = html + `<text x="${rect.x + 5}" y="${rect.y + 5}" class="svg-item-verif-text">X</text>`;
        }
        renderer.setProperty(decorationElement, "innerHTML", html);
      }
    }
  }

  /**
   * Get svg object bouding box
   * @param svgObject The svg object
   * @returns The bouding box rectangle
   */
  private getSvgObjectBBoxRect(svgObject: any): any {
    const rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    const renderer = this.svgDiagramService.svgDiagramComponent.renderer;
    if (renderer && svgObject && svgObject.getBBox) {
      // /!\ Error when refreshing when diagram is hidden... => bbox=0,0,0,0
      const d = 5;
      const bbox = svgObject.getBBox();
      rect.x = bbox.x;
      rect.y = bbox.y;
      rect.width = bbox.width;
      rect.height = bbox.height;
      rect.x -= d;
      rect.y -= d;
      rect.width += d * 2;
      rect.height += d * 2;
    }
    return rect;
  }

  /**
   * Builds a sub controller according of the type of diagram
   * @param diagram The diagram
   * @returns The sub controller
   */
  private buildSubTypeDiagramController(diagram: any): any {
    let res = null;
    if (diagram) {
      if (diagram.type === ModelConstService.VISUALIZATION_TYPE) {
        if (diagram.viewType === ModelConstService.TRACKSIDE_PHYSICAL_ARCHITECTURE_DIAGRAM_TYPE) {
          res = new TracksidePhysicalArchitectureSvgDiagramController(this);
        } else if (diagram.viewType === ModelConstService.ONBOARD_PHYSICAL_ARCHITECTURE_DIAGRAM_TYPE) {
          res = new OnBoardPhysicalArchitectureSvgDiagramController(this);
        } else if (diagram.viewType === ModelConstService.LOGICAL_INTERFACE_DIAGRAM_TYPE) {
          res = new LogicalInterfaceSvgDiagramController(this);
        } else if (
          [
            ModelConstService.TYPICAL_ITF_DIAGRAMS_TYPE,
            ModelConstService.INSTANTIATED_ITF_DIAGRAMS_TYPE,
            ModelConstService.TYPICAL_FRAME_DIAGRAMS_TYPE,
            ModelConstService.INSTANTIATED_FRAME_DIAGRAMS_TYPE,
          ].includes(diagram.viewType)
        ) {
          res = new WiringSvgDiagramController(this);
        } else {
          res = new TrackPlanSvgDiagramController(this);
        }
      }
      if (res) {
        res.init();
      }
    }
    return res;
  }

  /**
   * Function called when the selection of svg objects has changed
   * @param selectedSvgObjects The list of selected svg objects
   */
  private onGOSelectionChange(selectedSvgObjects: any[]) {
    this.lockBOChangedSelectionEvent = true;
    if (!this.lockDiagramChangedSelectionEvent) {
      const boDataList = [];
      const boDataListDeleted = [];
      if (selectedSvgObjects && selectedSvgObjects.forEach) {
        selectedSvgObjects.forEach((svgObject: any) => {
          const boData = {
            itemId: svgObject.getAttribute("item_id"),
            objectClassName: svgObject.getAttribute("object_class_name"),
          };
          if (svgObject.isYellow === true) {
            boDataListDeleted.push(boData);
          } else {
            boDataList.push(boData);
          }
        });
      }

      // Get business objects linked to graphical objects
      let bos = this.modelService.getObjectsByItemIdAndObjectClassNameList(
        this.modelService.getSelectedProject(),
        boDataList
      );
      // Deleted objects are in comparison project, not any more in the selected project:
      if (boDataListDeleted.length) {
        if (this.compareService.getCompareProjectList().length === 2) {
          bos = bos.concat(
            this.modelService.getObjectsByItemIdAndObjectClassNameList(
              this.compareService.getCompareProjectList()[1],
              boDataListDeleted
            )
          );
        }
        // TODO n projects comparison
        else {
          // TODO add project id to svgObject
          // svgObject.versionId added to svgObject.isYellow = true => get the project that owns the object
        }
      }

      this.selectionService.selectObjects(bos);
    }
    this.lockBOChangedSelectionEvent = false;
  }

  /**
   * Function called when the selection of business objects has changed
   */
  public onBOSelectionChange() {
    if (
      this.options.synchroBOSelection &&
      !this.lockBOChangedSelectionEvent
      // && this.viewService.isViewComponentSelected(this)
    ) {
      this.lockDiagramChangedSelectionEvent = true;

      // Clear previous logical group highlighting
      this.clearAllLogicalGroupHighlighting();

      // TODO DEBUG
      // const sbo = this.selectionService.getSelectedObjects();
      // const svg = this.svgDiagramService.svgObjectService.findSvgObjectsFromBos(sbo);
      // const sso1 = this.svgDiagramService.layerService.filterVisibleSvgObjects(svg);
      // console.log(sbo, svg, sso1);

      const selectedObjects = this.selectionService.getSelectedObjects();
      let sso = this.svgDiagramService.layerService.filterVisibleSvgObjects(
        this.svgDiagramService.svgObjectService.findSvgObjectsFromBos(selectedObjects)
      );

      // Enhanced selection for logical groups
      selectedObjects.forEach((bo: any) => {
        console.log(`DEBUG: Selected object type: ${bo.type}, name: ${bo.name || bo.label}, id: ${bo.id}`);
        
        if (bo.type && (bo.type.includes('LogicalAreaGroup') || bo.type.includes('logicalAreaGroup') || bo.type.includes('AreaGroup'))) {
          console.log(`DEBUG: Processing logical group: ${bo.name || bo.label}`);
          const logicalGroupSvgObjects = this.findSvgObjectsForLogicalGroupByLinkedAreas(bo);
          sso = sso.concat(logicalGroupSvgObjects);
          console.log(`Found ${logicalGroupSvgObjects.length} SVG objects for logical group: ${bo.name || bo.label}`);
          
          // Apply color highlighting to logical group objects
          if (logicalGroupSvgObjects.length > 0) {
            const color = this.getLogicalGroupColor(this.project, bo);
            this.applyLogicalGroupHighlighting(logicalGroupSvgObjects, color);
            console.log(`Applied color ${color} to logical group: ${bo.name || bo.label}`);
          }
        }
      });

      this.svgDiagramService.selectionService.selectSvgObjects(sso);
      this.lockDiagramChangedSelectionEvent = false;
      this.svgDiagramService.zoomScrollService.centerOnSelection();
    }
  }

  /**
   * Find SVG objects for a logical group
   * @param logicalGroup The logical group business object
   * @returns Array of SVG objects
   */
  private findSvgObjectsForLogicalGroup(logicalGroup: any): any[] {
    const svgObjects: any[] = [];
    this.svgDiagramService.svgObjectService.forEachCB((svgObject: any) => {
      if (svgObject.logicalGroup && svgObject.logicalGroup.id === logicalGroup.id) {
        svgObjects.push(svgObject);
      }
    });
    return svgObjects;
  }

  /**
   * Find SVG objects for a logical group by linked areas
   * @param logicalGroup The logical group business object
   * @returns Array of SVG objects
   */
  private findSvgObjectsForLogicalGroupByLinkedAreas(logicalGroup: any): any[] {
    const svgObjects: any[] = [];
    const linkedAreas = logicalGroup["GenericADM:LinkedLogicalAreas"];
    
    console.log(`DEBUG: Logical group ${logicalGroup.label} has linked areas:`, linkedAreas);
    
    if (Array.isArray(linkedAreas)) {
      console.log(`DEBUG: Processing ${linkedAreas.length} linked areas for group ${logicalGroup.label}`);
      
      this.svgDiagramService.svgObjectService.forEachCB((svgObject: any) => {
        if (svgObject.bo) {
          // Match by exact ID AND type for precision
          const foundLink = linkedAreas.find((link: any) => {
            const idMatch = link.elementIDRef === svgObject.bo.id || 
                           link.elementIDRef === svgObject.bo.itemId;
            
            // Handle type matching with and without GenericADM: prefix
            const svgObjectType = svgObject.bo.type;
            const linkType = link.elementtypeRef;
            const typeMatch = svgObjectType === linkType || 
                             svgObjectType === `GenericADM:${linkType}` ||
                             svgObjectType.endsWith(`:${linkType}`);
            
            if (idMatch || typeMatch) {
              console.log(`DEBUG: Checking match - SVG object ID:${svgObject.bo.id}, type:${svgObjectType} vs Link ID:${link.elementIDRef}, type:${linkType} - idMatch:${idMatch}, typeMatch:${typeMatch}`);
            }
            
            // Both ID and type must match for precise filtering
            return idMatch && typeMatch;
          });
          
          if (foundLink) {
            svgObjects.push(svgObject);
            console.log(`Matched SVG object for logical group ${logicalGroup.label}: ${svgObject.bo.type} ${svgObject.bo.label} (ID: ${svgObject.bo.id})`);
          }
        }
      });
    }
    
    console.log(`Found ${svgObjects.length} SVG objects for logical group: ${logicalGroup.label}`);
    return svgObjects;
  }

  /**
   * Displays the context menu
   * @param event The event
   * @param element The selected element
   * @param target The html target
   */
  public showContextMenu(event: any, element: any = null, target: any = null) {
    this.mainContextMenuComponent.showContextMenu(event, element);
  }

  /**
   * Function called when the menu button is clicked
   * @param event The event
   */
  public onBtnMenuClicked(event: any) {
    this.showContextMenu(event);
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Search and select svg objects according to a text
   * @param value The search string value
   */
  public searchAndSelect(value: any) {
    if (!this.lastSearch.includes(value)) {
      this.lastSearch.push(value);
    }
    const searchResult = this.svgDiagramService.searchService.search(value);
    this.svgDiagramService.selectionService.selectSvgObjects(searchResult.foundSvgObjects);
    this.svgDiagramService.zoomScrollService.centerOnSelection();
  }

  /**
   * Function called when displaying a tooltip
   * @param svgObject The svg object
   * @returns The tooltip string value
   */
  private getTooltipDataCB(svgObject: any): any {
    let res = null;
    if (svgObject) {
      const bo = svgObject.bo;
      if (bo) {
        res = `${bo.type} ${bo.label} (id: ${bo.id})`;
      }
    }
    return res;
  }

  /**
   * Function called when displaying a tooltip in verification mode
   * @param svgObject The svg object
   * @returns The tooltip data
   */
  public getVerificationTooltipData(svgObject: any): any {
    const res = {
      svgObject,
      bo: svgObject ? svgObject.bo : null,
      label: null,
      projectName: null,
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
      res.projectName = svgObject && svgObject.projectName ? svgObject.projectName : null;
    }
    return res;
  }

  /**
   * Function that returns the boolean : the user can make verification
   * @returns boolean
   */
  public canVerify(): boolean {
    return this.rightsService.canWrite(RightsConst.VERIFICATION);
  }

  /**
   * Function that returns the boolean : the user can answer verification
   * @returns boolean
   */
  public canAnswerVerify(): boolean {
    return this.rightsService.canWrite(RightsConst.VERIFICATION_ANSWER);
  }

  /**
   * Function that returns the boolean : the user can open verification modal dialog
   * @returns boolean
   */
  public canOpenVerifyDialog(): boolean {
    return this.canVerify() || this.canAnswerVerify();
  }

  /**
   * Get the layer options
   * @returns
   */
  public getLayerOptions(): any {
    return this.svgDiagramService ? this.svgDiagramService.layerService.layerOptions : null;
  }

  /**
   * On layer change event
   * @param layerOptions The layer options
   */
  public layerChangedEvent(layerOptions: any) {
    console.log('DEBUG: Layer changed event triggered', layerOptions);
    this.svgDiagramService.layerService.applyLayerOptions();
    console.log('DEBUG: Layer options applied');
  }

  /**
   * Get color configuration for logical groups from visualization
   * @param project The project
   * @param logicalGroup The logical group
   * @returns color string or null
   */
  private getLogicalGroupColor(project: any, logicalGroup: any): string | null {
    // Check if project has infrastructure visualizations
    const infrastructureVisualizations = project["infrastructureVisualizations"];
    if (infrastructureVisualizations && Array.isArray(infrastructureVisualizations)) {
      // Find track layout visualization
      const trackLayoutViz = infrastructureVisualizations.find((viz: any) => 
        viz.viewType === "TrackLayout" || viz.viewType === "trackLayout"
      );
      
      if (trackLayoutViz && trackLayoutViz.lineVis) {
        // Search through lineVis for area visualizations
        const lineVisList = Array.isArray(trackLayoutViz.lineVis) ? trackLayoutViz.lineVis : [trackLayoutViz.lineVis];
        
        for (const lineVis of lineVisList) {
          if (lineVis["GenericADM:areaVis"]) {
            const areaVisList = Array.isArray(lineVis["GenericADM:areaVis"]) ? 
              lineVis["GenericADM:areaVis"] : [lineVis["GenericADM:areaVis"]];
            
            for (const areaVis of areaVisList) {
              if (areaVis["GenericADM:graphicalObjectClass"]) {
                const graphicalObjects = Array.isArray(areaVis["GenericADM:graphicalObjectClass"]) ?
                  areaVis["GenericADM:graphicalObjectClass"] : [areaVis["GenericADM:graphicalObjectClass"]];
                
                for (const graphObj of graphicalObjects) {
                  // Check if this graphical object matches our logical group
                  if (graphObj.objectClass === logicalGroup.type || 
                      graphObj.objectClassRef === logicalGroup.id ||
                      graphObj.name === logicalGroup.name) {
                    return graphObj.color || null;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Default colors for different logical group types if no visualization config found
    const defaultColors: { [key: string]: string } = {
      'GenericADM:alphaLogicalAreaGroup': '#FF6B6B',  // Red
      'GenericADM:betaLogicalAreaGroup': '#4ECDC4',   // Teal
      'GenericADM:logicalAreaGroup': '#45B7D1',       // Blue
      'GenericADM:specificLogicalAreaGroup': '#96CEB4' // Green
    };
    
    return defaultColors[logicalGroup.type] || '#FFD93D'; // Default yellow
  }

  /**
   * Apply color highlighting to selected logical group objects
   * @param svgObjects Array of SVG objects to highlight
   * @param color Color to apply
   */
  private applyLogicalGroupHighlighting(svgObjects: any[], color: string) {
    svgObjects.forEach((svgObject: any) => {
      if (svgObject && svgObject.style) {
        // Store original colors for restoration
        if (!svgObject.originalStroke) {
          svgObject.originalStroke = svgObject.style.stroke || svgObject.getAttribute('stroke');
          svgObject.originalFill = svgObject.style.fill || svgObject.getAttribute('fill');
        }
        
        // Apply highlighting color
        svgObject.style.stroke = color;
        svgObject.style.strokeWidth = '3';
        svgObject.style.fill = color;
        svgObject.style.fillOpacity = '0.3';
        svgObject.classList.add('logical-group-highlighted');
      }
    });
  }

  /**
   * Remove logical group highlighting
   * @param svgObjects Array of SVG objects to unhighlight
   */
  private removeLogicalGroupHighlighting(svgObjects: any[]) {
    svgObjects.forEach((svgObject: any) => {
      if (svgObject && svgObject.classList.contains('logical-group-highlighted')) {
        // Restore original colors
        if (svgObject.originalStroke !== undefined) {
          svgObject.style.stroke = svgObject.originalStroke;
          svgObject.style.fill = svgObject.originalFill;
        }
        svgObject.style.strokeWidth = '';
        svgObject.style.fillOpacity = '';
        svgObject.classList.remove('logical-group-highlighted');
      }
    });
  }

  /**
   * Clear all logical group highlighting from all SVG objects
   */
  private clearAllLogicalGroupHighlighting() {
    this.svgDiagramService.svgObjectService.forEachCB((svgObject: any) => {
      if (svgObject && svgObject.classList.contains('logical-group-highlighted')) {
        // Restore original colors
        if (svgObject.originalStroke !== undefined) {
          svgObject.style.stroke = svgObject.originalStroke;
          svgObject.style.fill = svgObject.originalFill;
        }
        svgObject.style.strokeWidth = '';
        svgObject.style.fillOpacity = '';
        svgObject.classList.remove('logical-group-highlighted');
      }
    });
  }

  /**
   * Debug method to check logical group associations
   * @param project The project
   */
  public debugLogicalGroupAssociations(project: any) {
    console.log("=== Debugging Logical Group Associations ===");
    const logicalElements = project["GenericADM:logicalElements"];
    
    if (logicalElements) {
      const groupTypes = [
        "GenericADM:alphaLogicalAreaGroups",
        "GenericADM:betaLogicalAreaGroups", 
        "GenericADM:logicalAreaGroups",
        "GenericADM:specificLogicalAreaGroups"
      ];

      groupTypes.forEach(groupTypeKey => {
        const groups = logicalElements[groupTypeKey];
        if (Array.isArray(groups)) {
          console.log(`\n${groupTypeKey}:`);
                      groups.forEach((group: any) => {
              console.log(`  Group: ${group.name || group.label} (ID: ${group.id}, Type: ${group.type})`);
              const linkedAreas = group["GenericADM:LinkedLogicalAreas"];
              if (Array.isArray(linkedAreas)) {
                console.log(`    Linked Areas: ${linkedAreas.length}`);
                linkedAreas.forEach((link: any) => {
                  console.log(`      - ${link.elementtypeRef} (ID: ${link.elementIDRef})`);
                });
              } else {
                console.log(`    No linked areas found for group ${group.name || group.label}`);
              }
            });
        }
      });
    }
    
    // Check SVG object associations
    let associatedCount = 0;
    this.svgDiagramService.svgObjectService.forEachCB((svgObject: any) => {
      if (svgObject.logicalGroup) {
        associatedCount++;
        console.log(`SVG Object ${svgObject.bo?.id} associated with ${svgObject.logicalGroup.name}`);
      }
    });
    console.log(`\nTotal SVG objects with logical group associations: ${associatedCount}`);
  }
}
