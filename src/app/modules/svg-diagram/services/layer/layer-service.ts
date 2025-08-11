import { ISvgDiagramService } from "../diagram/svg-diagram.service";

/**
 * Interface of a layer
 */
export interface ILayer {
  layerType: string;
  label: string;
  projectIndex: number;
  isVisible: boolean;
  isDisplayed: boolean;
  type: string;
  applyToSvgObjectCB: any;
}

/**
 * Interface of the layer options
 */
export interface ILayerOptions {
  layers: ILayer[];
}

/**
 * Interface of the layer service
 */
export interface ILayerService {
  layerOptions: ILayerOptions;
  applySvgObjectLayerOptionsCB: any;
  applyLayerOptions();
  filterVisibleSvgObjects(svgObjects: any[]): any[];
}

// tslint:disable-next-line: max-classes-per-file
/**
 * Layer service
 */
export class LayerService implements ILayerService {
  static HiddenClass = "svg-item-hidden"; // d-none
  static RedClass = "svg-item-ray-red";
  static YellowClass = "svg-item-ray-yellow";
  static RedYellowClass = "svg-item-ray-redyellow";

  static layerTypes = {
    redAndYellowLayer: "redAndYellowLayer",
    yellowLayer: "yellowLayer",
    redLayer: "redLayer",
    redAndYellowSeparationLayer: "redAndYellowSeparationLayer",
    separationLayer: "separationLayer",
  };

  /**
   * Layer options
   */
  public layerOptions: ILayerOptions = {
    layers: [],
  };

  /**
   * Apply layer options callback
   * @param svgObject
   */
  public applySvgObjectLayerOptionsCB = (svgObject: any) => this.applySvgObjectLayerOptionsCBDefault(svgObject);

  /**
   * Constructor
   * @param svgDiagramService The Svg Diagram Service
   */
  constructor(public svgDiagramService: ISvgDiagramService) {}

  /**
   * Get the list of svg objects of the diagram
   * @returns The list of svg objects
   */
  private getSvgObjectList() {
    return this.svgDiagramService.getDisplayedSvgObjectList();
  }

  /**
   * Apply the layer options to the diagram
   */
  public applyLayerOptions() {
    this.getSvgObjectList().forEach((svgObject: any) => this.applySvgObjectLayerOptionsCB(svgObject));
    this.renderLayerOptionsToSvgObjects();
  }

  /**
   * Apply layer options callback
   * @param svgObject
   */
  public applySvgObjectLayerOptionsCBDefault(svgObject: any) {
    const objectClassName = svgObject.getAttribute("object_class_name");
    const ocnUpper = objectClassName ? objectClassName.toUpperCase() : objectClassName;

    let objectLayerData = {
      isVisible: true,
      isRedAndYellowVisible: true,
      isRedVisible: true,
      isYellowVisible: true,
      projectIndex: svgObject.projectIndex,
    };
    this.layerOptions.layers.forEach((layer: ILayer) => {
      if (layer.applyToSvgObjectCB) {
        objectLayerData = layer.applyToSvgObjectCB(layer, svgObject, objectLayerData); // TODO add some specificity with stroke-dasharray = "3,3" for archi links ???
      } else {
        if (layer.type && !layer.isVisible && [layer.type].includes(ocnUpper)) {
          objectLayerData.isVisible = false;
        }
      }
    });
    svgObject.isVisible = objectLayerData.isVisible;
    svgObject.isRedVisible = objectLayerData.isRedAndYellowVisible && objectLayerData.isRedVisible && svgObject.isRed;
    svgObject.isYellowVisible =
      objectLayerData.isRedAndYellowVisible && objectLayerData.isYellowVisible && svgObject.isYellow;

    // Hide yellow objects if yellow filter not enabled
    if (svgObject.isYellow && !svgObject.isYellowVisible) {
      svgObject.isVisible = false;
    }
  }

  /**
   * Render layer options to the svg objects
   */
  private renderLayerOptionsToSvgObjects() {
    const renderer = this.svgDiagramService.getRenderer();

    this.getSvgObjectList().forEach((svgObject: any) => {
      const classList = svgObject.classList;
      renderer.removeAttribute(svgObject, "class");
      renderer.addClass(svgObject, "svg-item");

      if (svgObject.isVisible === false) {
        renderer.addClass(svgObject, LayerService.HiddenClass);
      } else {
        // projectIndex with different colors
        const projectIndex = svgObject.projectIndex;
        const classSuffix = "-" + projectIndex;
        // const classSuffix = "-1";

        // Red and yellow classes
        if (svgObject.isRedVisible === true) {
          renderer.addClass(svgObject, LayerService.RedClass + classSuffix);
        }
        if (svgObject.isYellowVisible === true) {
          renderer.addClass(svgObject, LayerService.YellowClass + classSuffix);
        }

        // if (svgObject.isRedVisible === true && svgObject.isYellowVisible === true) {
        //   // TODO
        //   // renderer.addClass(svgObject, LayerService.RedYellowClass + classSuffix);
        //   renderer.addClass(svgObject, LayerService.YellowClass + classSuffix);
        //   renderer.addClass(svgObject, LayerService.RedClass + classSuffix);
        // } else if (svgObject.isRedVisible === true) {
        //   renderer.addClass(svgObject, LayerService.RedClass + classSuffix);
        // } else if (svgObject.isYellowVisible === true) {
        //   renderer.addClass(svgObject, LayerService.YellowClass + classSuffix);
        // }
      }
    });
  }

  // TODO: Old code
  // private renderLayerOptionsToSvgObjects() {
  //   const renderer = this.svgDiagramService.getRenderer();

  //   this.getSvgObjectList().forEach((svgObject: any) => {
  //     renderer.removeAttribute(svgObject, "class");
  //     renderer.addClass(svgObject, "svg-item");

  //     if (svgObject.isVisible === false) {
  //       renderer.addClass(svgObject, LayerService.HiddenClass);
  //     } else {
  //       // renderer.removeClass(svgObject, LayerService.HiddenClass);
  //     }

  //     // TODO projectIndex with different colors

  //     // Red and yellow classes
  //     if (svgObject.isRedVisible === true && svgObject.isYellowVisible === true) {
  //       renderer.addClass(svgObject, LayerService.RedYellowClass);
  //       // renderer.removeClass(svgObject, LayerService.RedClass);
  //       // renderer.removeClass(svgObject, LayerService.YellowClass);
  //     } else if (svgObject.isRedVisible === true) {
  //       renderer.addClass(svgObject, LayerService.RedClass);
  //       // renderer.removeClass(svgObject, LayerService.YellowClass);
  //       // renderer.removeClass(svgObject, LayerService.RedYellowClass);
  //     } else if (svgObject.isYellowVisible === true) {
  //       renderer.addClass(svgObject, LayerService.YellowClass);
  //       // renderer.removeClass(svgObject, LayerService.RedClass);
  //       // renderer.removeClass(svgObject, LayerService.RedYellowClass);
  //     } else {
  //       // renderer.removeClass(svgObject, LayerService.RedClass);
  //       // renderer.removeClass(svgObject, LayerService.YellowClass);
  //       // renderer.removeClass(svgObject, LayerService.RedYellowClass);
  //     }
  //   });
  // }

  /**
   * Filter the visible svg objects
   * @param svgObjects The svg objects
   * @returns The list of visible svg objects
   */
  public filterVisibleSvgObjects(svgObjects: any[]): any[] {
    return svgObjects ? svgObjects.filter((svgObject: any) => !(svgObject && svgObject.isVisible === false)) : [];
  }
}
