import { ISvgDiagramService } from "src/app/modules/svg-diagram/services/diagram/svg-diagram.service";
import { ISubTypeSvgDiagramController } from "./isvg-diagram-controller";
import { SvgViewComponent } from "../svg-view.component";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ICompareService } from "src/app/services/compare/compare.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ILayer, LayerService } from "src/app/modules/svg-diagram/services/layer/layer-service";

/**
 * Abstract class of svg digram sub controller
 */
export abstract class ASubTypeSvgDiagramController implements ISubTypeSvgDiagramController {
  /**
   * Added tool bar actions
   */
  protected addedToolBarActions = [
    {
      type: "btn-group",
      id: "tpe-toolbar-actions-group",
      visible: (item: any) => true,
      actions: [
        {
          type: "dropdown",
          html: (item: any) => "tpe.diagram.show.dropdown.action",
          icon: (item: any) => "eye",
          enabled: (item: any) => true,
          visible: (item: any) => true,
          actions: [],
        },
      ],
    },
  ];

  protected svgDiagramService: ISvgDiagramService = null;
  protected servicesService: IServicesService;
  private compareService: ICompareService;

  protected redAndYellowSeparationLayer: ILayer = {
    layerType: LayerService.layerTypes.redAndYellowSeparationLayer,
    label: "-",
    projectIndex: 0,
    isVisible: false,
    isDisplayed: true,
    type: "",
    applyToSvgObjectCB: null,
  };

  protected staticRedAndYellowLayers: ILayer[] = [
    // redAndYellowLayer:
    {
      layerType: LayerService.layerTypes.redAndYellowLayer,
      label: "All Red & Yellow data",
      projectIndex: 0,
      isVisible: true,
      isDisplayed: true,
      type: "",
      applyToSvgObjectCB: (layer: any, svgObject: any, objectLayerData: any) => {
        objectLayerData.isRedAndYellowVisible = layer.isVisible;
        return objectLayerData;
      },
    },
  ];

  /**
   * Constructor
   * @param svgViewComponent The svg ViewComponent
   */
  constructor(protected svgViewComponent: SvgViewComponent) {
    this.svgDiagramService = this.svgViewComponent.svgDiagramService;
    this.servicesService = this.svgViewComponent.servicesService;
    this.compareService = this.servicesService.getService(ServicesConst.CompareService) as ICompareService;
  }

  /**
   * Init
   */
  public init() {
    this.initLayers();
    this.initActions();
    this.applyLayerOptions();
  }

  /**
   * Init layer
   */
  protected initLayers() {
    this.initCommonLayers();
  }

  /**
   * Init layers common to controllers (common to different diagram types)
   */
  protected initCommonLayers() {
    this.refreshLayers();
  }

  /**
   * Refresh layers
   */
  public refreshLayers() {
    // Refresh red and yellow layers
    let res = this.svgDiagramService.layerService.layerOptions.layers.filter(
      (layer: ILayer) =>
        ![
          LayerService.layerTypes.redAndYellowLayer,
          LayerService.layerTypes.redLayer,
          LayerService.layerTypes.yellowLayer,
          LayerService.layerTypes.redAndYellowSeparationLayer,
        ].includes(layer.layerType)
    );
    if (this.compareService.multiVersionComparisonIsComputed) {
      res = this.getRedAndYellowLayers().concat(res);
    }
    this.svgDiagramService.layerService.layerOptions.layers = res;
  }

  /**
   * Get red and yellow layers
   * @returns
   */
  private getRedAndYellowLayers(): ILayer[] {
    let res: ILayer[] = [];
    const nbOfLayers = this.compareService.getCompareProjectList().length;
    if (nbOfLayers > 0) {
      res = res.concat(this.staticRedAndYellowLayers);
      res = res.concat(this.createNRedAndYellowLayers());
      res = res.concat([this.redAndYellowSeparationLayer]);
    }
    return res;
  }

  /**
   * Create red and yellow layers
   */
  private createNRedAndYellowLayers(): ILayer[] {
    let res: ILayer[] = [];

    const projectList = this.compareService.getCompareProjectList();
    const nbOfLayers = projectList.length;

    for (let i = 0; i < nbOfLayers - 1; i++) {
      const p1Label = projectList[i].label;
      const p2Label = projectList[i + 1].label;
      const projectLabels = p1Label + "/" + p2Label;

      const redLayer = {
        layerType: LayerService.layerTypes.redLayer,
        label: "Red " + projectLabels,
        projectIndex: i + 1,
        isVisible: true,
        isDisplayed: true,
        type: "",
        applyToSvgObjectCB: (layer: any, svgObject: any, objectLayerData: any) => {
          if (objectLayerData.projectIndex === layer.projectIndex) {
            objectLayerData.isRedVisible = layer.isVisible;
          }
          return objectLayerData;
        },
      };
      res.push(redLayer);

      const yellowLayer = {
        layerType: LayerService.layerTypes.yellowLayer,
        label: "Yellow " + projectLabels,
        projectIndex: i + 1,
        isVisible: true,
        isDisplayed: true,
        type: "",
        applyToSvgObjectCB: (layer: any, svgObject: any, objectLayerData: any) => {
          if (objectLayerData.projectIndex === layer.projectIndex) {
            objectLayerData.isYellowVisible = layer.isVisible;
          }
          return objectLayerData;
        },
      };
      res.push(yellowLayer);
    }
    return res;
  }

  /**
   * Init actions
   */
  protected initActions() {}

  /**
   * Apply layer options
   */
  public applyLayerOptions() {
    this.svgDiagramService.layerService.applyLayerOptions();
  }

  /**
   * Init diagram
   * @param diagram The diagram
   */
  public initDiagram(diagram: any) {}

  /**
   * Lazy load visualization
   * @param project The project
   * @param diagram The diagram
   */
  public testAndLazyLoadVisualization(project: any, diagram: any) {}
}
