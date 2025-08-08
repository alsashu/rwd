import { IDiagramService } from "../diagram/diagram.service";
import { SvgConstService } from "../svg-object/svg-const.service";
import { ModelConstService } from "src/app/services/model/model-const.service";

export interface ILayer {
  id: string;
  svgObjects: any[];
}

export class Layer implements ILayer {
  public svgObjects: any[] = [];

  constructor(public id: string, public getSvgObjectsCB = null, public isSelectionLayer: boolean = false) {}

  public getSvgObjects(): any[] {
    return this.getSvgObjectsCB ? this.getSvgObjectsCB() : this.svgObjects;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class LayerService {
  public layers: ILayer[] = [];

  public gridLayer = new Layer("GridLayer");
  public objectsLayer = new Layer("DiagramLayer", () => this.getSvgObjects());
  public selectionLayer = new Layer("SelectionLayer", () => this.getSvgObjects(), true);
  // public objectsLayer = new Layer("DiagramLayer");
  // public selectionLayer = new Layer("SelectionLayer", undefined, true);
  public toolLayer = new Layer("ToolLayer");

  constructor(public diagramService: IDiagramService) {
    this.toolLayer.svgObjects = [
      // { type:"text", x: 50, y: 150, text: "grid !", background: "#a66" },
    ];
  }

  private getSvgObjects() {
    return this.diagramService.getRootSvgObjects();
  }

  public initLayers() {
    // this.objectsLayer.svgObjects = this.getSvgObjects();
    // this.selectionLayer.svgObjects = this.getSvgObjects();
    // this.layers = [this.gridLayer, this.objectsLayer, this.selectionLayer, this.toolLayer];
    this.layers = [this.objectsLayer, this.selectionLayer];
  }

  public applyLayerOptions(layerOptions: any) {
    // console.log(">> applyLayerOptions", layerOptions);

    layerOptions.visibleLibraryIds = [];
    layerOptions.enabledLibraryIds = [];

    layerOptions.libraryIdFilters.forEach((libraryIdFilter: any) => {
      if (libraryIdFilter.id === "*") {
        layerOptions.allVisible = libraryIdFilter.isVisible;
        layerOptions.allEnabled = libraryIdFilter.isEnabled;
      } else {
        if (libraryIdFilter.isVisible) {
          layerOptions.visibleLibraryIds = layerOptions.visibleLibraryIds.concat(libraryIdFilter.ids);
        }
        if (libraryIdFilter.isEnabled) {
          layerOptions.enabledLibraryIds = layerOptions.enabledLibraryIds.concat(libraryIdFilter.ids);
        }
      }
    });

    this.applyFilterVisibility(this.getSvgObjects(), layerOptions);
  }

  public applyFilterVisibility(svgObjects: any[], filterData: any) {
    // TODO svgObjectService.forEachCB for n>2 level model

    svgObjects.forEach((svgObject) => {
      if (svgObject && svgObject.type === SvgConstService.LIBRARY_OBJECT_TYPE) {
        svgObject.isVisible =
          (filterData.allVisible || filterData.visibleLibraryIds.includes(svgObject.libraryId)) &&
          !(svgObject.visible === false || svgObject.visible === "false");
        svgObject.isVisible =
          svgObject.isVisible && ((filterData.isRAYVisible && filterData.isYellowVisible) || !svgObject.isYellowObject);
        svgObject.isVisible =
          svgObject.isVisible &&
          !(
            filterData.isRAYVisible &&
            !filterData.isRedVisible &&
            filterData.isYellowVisible &&
            (svgObject.rayStatus === ModelConstService.CHANGE_STATUS_NEW ||
              (svgObject.rayStatus === ModelConstService.CHANGE_STATUS_MODIFIED && !svgObject.isYellowObject))
          );

        svgObject.isEnabled =
          (filterData.allEnabled || filterData.enabledLibraryIds.includes(svgObject.libraryId)) &&
          !(svgObject.isVisible === false);
      }
    });
  }
}
