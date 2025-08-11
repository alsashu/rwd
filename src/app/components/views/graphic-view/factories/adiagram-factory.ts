import { DiagramService } from "src/app/modules/diagram/services/diagram/diagram.service";
import { GraphicViewComponent } from "../graphic-view.component";
import { IDiagramFactory } from "./idiagram-factory";

export abstract class ADiagramFactory implements IDiagramFactory {
  protected lineStyleStrokeDasharrayMap = new Map([["dash", "5,5"]]);
  protected minMaxCoords = this.resetMinMaxCoords();

  constructor(protected graphicViewComponent: GraphicViewComponent) {}

  protected getDiagramService(): DiagramService {
    return this.graphicViewComponent.diagramService;
  }

  protected resetMinMaxCoords() {
    this.minMaxCoords = {
      max: {
        x: -1000000,
        y: -1000000,
      },
      min: {
        x: 1000000,
        y: 1000000,
      },
    };
    return this.minMaxCoords;
  }

  protected getCoordFromVisPosition(visPosition: any): any {
    const res = { x: 0, y: 0 };
    if (visPosition) {
      const visPos = {
        x: parseInt(visPosition.x, 10),
        y: parseInt(visPosition.y, 10),
      };

      this.minMaxCoords.max.x = Math.max(this.minMaxCoords.max.x, visPos.x);
      this.minMaxCoords.max.y = Math.max(this.minMaxCoords.max.y, -visPos.y);
      this.minMaxCoords.min.x = Math.min(this.minMaxCoords.min.x, visPos.x);
      this.minMaxCoords.min.y = Math.min(this.minMaxCoords.min.y, -visPos.y);

      res.x = visPos.x;
      res.y = -visPos.y;
    }
    return res;
  }

  protected calcDiagramOrgCoord(diagram: any): any {
    if (diagram) {
      diagram.orgCoord =
        this.minMaxCoords.min.x === 1000000
          ? { x: 0, y: 0 }
          : {
              x: Math.floor(this.minMaxCoords.min.x / 10000) * 10000,
              y: Math.floor(this.minMaxCoords.min.y / 100 - 1) * 100,
            };
      diagram.orgCoord.x -= 200;
      diagram.orgCoord.y -= 200;
    }
  }

  protected calcPositionDataFromVisObject(
    visObject: any,
    shouldCloseIfVertexes = false
  ): {
    coordOrg: { x: number; y: number };
    pointList: { x: number; y: number }[];
    points: string;
  } {
    const res = {
      coordOrg: { x: 0, y: 0 },
      pointList: [],
      points: "",
    };

    const positions = visObject["GenericADM:positions"];
    if (positions) {
      const start = positions["GenericADM:start"];
      const vertexes = positions["GenericADM:vertexes"];
      const end = positions["GenericADM:end"];

      if (!(start && end)) {
        return null;
      }

      // Position & polyline points
      res.coordOrg = this.getCoordFromVisPosition(start);
      res.pointList.push(res.coordOrg);
      if (vertexes) {
        vertexes.forEach((v: any) => res.pointList.push(this.getCoordFromVisPosition(v)));
      }
      res.pointList.push(this.getCoordFromVisPosition(end));

      if (shouldCloseIfVertexes && vertexes) {
        res.pointList.push(res.coordOrg);
      }

      res.pointList.forEach((coord: any) => {
        res.points += String(coord.x - res.coordOrg.x) + "," + String(+(coord.y - res.coordOrg.y)) + " ";
      });
    }
    return res;
  }

  protected getLibraryIdFromLibraryData(libraryData: any, visObject: any): string {
    let res = null;
    if (libraryData) {
      res = libraryData.libraryDefaultId;
      if (libraryData.libraryId && visObject && visObject["GenericADM:graphicalObjectClass"]) {
        const graphicalObjectClass = visObject["GenericADM:graphicalObjectClass"];
        if (
          graphicalObjectClass["GenericADM:autocadBlockDynamicProperties"] &&
          graphicalObjectClass["GenericADM:autocadBlockDynamicProperties"].length
        ) {
          const autocadBlockDynamicProperties = graphicalObjectClass["GenericADM:autocadBlockDynamicProperties"][0];
          if (autocadBlockDynamicProperties.dXFVisibilityState) {
            res = libraryData.libraryId + "_" + autocadBlockDynamicProperties.dXFVisibilityState;
          } else if (autocadBlockDynamicProperties.displayText && autocadBlockDynamicProperties.implantation) {
            res =
              libraryData.libraryId +
              "_" +
              autocadBlockDynamicProperties.displayText.toUpperCase() +
              "_" +
              autocadBlockDynamicProperties.implantation.toUpperCase();
          }
        } else {
          res = libraryData.libraryId + "_NO_VISIBILITY";
        }
      }
    }
    return res;
  }

  protected applyGraphicalSettings(visObject: any, svgObject: any, options: any = null): any {
    if (visObject && svgObject) {
      const settings = visObject.graphicalSettings
        ? visObject.graphicalSettings
        : visObject["GenericADM:graphicalObjectClass"];
      if (settings) {
        if (settings.color) {
          svgObject.stroke = settings.color;
        }
        if (settings.width) {
          svgObject.strokeWidth = settings.width;
        }
        if (settings.lineStyle) {
          const strokeDasharray = this.lineStyleStrokeDasharrayMap.get(settings.lineStyle);
          if (strokeDasharray) {
            svgObject.strokeDasharray = strokeDasharray;
          }
        }
      }
    }
    if (visObject && svgObject && options) {
      if (options.fill) {
        svgObject.fill = options.fill;
      }
    }
    return svgObject;
  }

  protected getGraphicConfigFromObjectClassName(visObject: any, graphicConfigByObjectClassNameMap: any): any {
    let graphicConfig = null;
    if (visObject && visObject.objectClassName) {
      const objectClassName = visObject.objectClassName ? visObject.objectClassName.toUpperCase() : "";
      graphicConfig = graphicConfigByObjectClassNameMap.get(objectClassName);
    }
    return graphicConfig;
  }

  protected applyHardCodedGraphicalSettings(
    visObject: any,
    svgObject: any,
    graphicConfigByObjectClassNameMap: any,
    options: { coordOrg?: any; pointList?: any[] } = {}
  ): any {
    if (visObject && visObject.objectClassName && svgObject) {
      const graphicConfig = this.getGraphicConfigFromObjectClassName(visObject, graphicConfigByObjectClassNameMap);
      if (graphicConfig) {
        if (graphicConfig.isARect && options.coordOrg && options.pointList && options.pointList.length >= 3) {
          const pts = options.pointList;
          svgObject.libraryId = "rect-1";
          svgObject.width = Math.abs((pts[1].x !== pts[0].x ? pts[1].x : pts[2].x) - pts[0].x);
          svgObject.height = Math.abs((pts[1].y !== pts[0].y ? pts[1].y : pts[2].y) - pts[0].y);
          svgObject.rx = 20;
          svgObject.ry = 20;
        }
        if (graphicConfig.libraryId) {
          svgObject.libraryId = graphicConfig.libraryId;
        }
        if (graphicConfig.color) {
          svgObject.stroke = graphicConfig.color;
        }
        if (graphicConfig.strokeWidth) {
          svgObject.strokeWidth = graphicConfig.strokeWidth;
        }
        if (graphicConfig.lineStyle) {
          const strokeDasharray = this.lineStyleStrokeDasharrayMap.get(graphicConfig.lineStyle);
          if (strokeDasharray) {
            svgObject.strokeDasharray = strokeDasharray;
          }
        }

        // Back bones
        if (
          visObject.refObject &&
          visObject.refObject.physicalLinkCharacteristic &&
          visObject.refObject.physicalLinkCharacteristic.subnetColor
        ) {
          svgObject.stroke = visObject.refObject.physicalLinkCharacteristic.subnetColor.toLowerCase();
          if (visObject.graphicalSettings && visObject.graphicalSettings.color) {
            delete visObject.graphicalSettings.color;
          }
        }
      }
    }
    return svgObject;
  }

  protected getLibraryDataFromObjectTypeAndSubType(object: any): any {
    const res = {
      libraryId: this.graphicViewComponent.graphicConfigService.getAutocadBlockNameFromTypeAndSubtype(
        object ? object.type : null,
        object
      ),
    };
    return res;
  }

  protected getLibraryIdFromVisObject(visObject: any): string {
    const refObject = visObject ? visObject.refObject : null;
    const libraryData = this.getLibraryDataFromObjectTypeAndSubType(refObject);
    const libraryIdMapped = this.getLibraryIdFromLibraryData(libraryData, visObject);
    return libraryIdMapped ? libraryIdMapped : "error-1";
  }
}
