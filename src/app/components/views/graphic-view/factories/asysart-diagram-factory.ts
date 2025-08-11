import { GraphicViewComponent } from "../graphic-view.component";
import { ADiagramFactory } from "./adiagram-factory";

export abstract class ASysArtDiagramFactory extends ADiagramFactory {
  constructor(
    graphicViewComponent: GraphicViewComponent,
    protected architectureVisTagName: string,
    protected defaultEquipmentLibraryId: string,
    protected graphicConfigByObjectClassNameMap: Map<
      string,
      {
        libraryId?: string;
        isARect?: boolean;
        color?: string;
        lineStyle?: string;
        strokeWidth?: string;
      }
    >,
    private page: string = null
  ) {
    super(graphicViewComponent);
  }

  public buildSvgObjectFromDiagram(diagram: any): any {
    const res = {
      type: "root",
      visObject: diagram,
      svgObjects: [],
    };
    if (diagram.lineVis) {
      this.buildSvgObjectFromLineVisObject(diagram, diagram.lineVis, res);
    }
    return res;
  }

  private buildSvgObjectFromLineVisObject(diagram: any, visObject: any, parentSvgObject: any): any {
    let res = null;
    if (visObject && visObject.type === "lineVis") {
      res = {
        type: "group",
        visObject,
        svgObjects: [],
      };
      this.getDiagramService().addSvgObject(res, parentSvgObject);
      this.resetMinMaxCoords();
      this.buildSvgObjectFromArchitectureVisList(diagram, visObject[this.architectureVisTagName], res);
      this.calcDiagramOrgCoord(diagram);
    }
    return res;
  }

  protected buildSvgObjectFromArchitectureVisList(diagram: any, visObjectList: any[], parentSvgObject: any) {
    if (visObjectList && visObjectList.forEach) {
      visObjectList.forEach((architectureVis: any) => {
        this.buildSvgObjectFromArchitectureVis(diagram, architectureVis, parentSvgObject);
      });
    }
  }

  protected buildSvgObjectFromArchitectureVis(diagram: any, architectureVis: any, parentSvgObject: any): any {
    const res: any = null;
    if (architectureVis) {
      this.buildSvgObjectFromArchitectureObjectVisList(
        diagram,
        architectureVis["architectureObjectVis"],
        parentSvgObject
      );
      this.buildSvgObjectFromArchitectureAreaVisList(diagram, architectureVis["architectureAreaVis"], parentSvgObject);
    }
    return res;
  }

  private buildSvgObjectFromArchitectureAreaVisList(diagram: any, visObjectList: any[], parentSvgObject: any) {
    if (visObjectList && visObjectList.forEach) {
      visObjectList.forEach((architectureAreaVis: any) => {
        this.buildSvgObjectFromArchitectureAreaVisAreaVis(diagram, architectureAreaVis, parentSvgObject);
      });
    }
  }

  private buildSvgObjectFromArchitectureAreaVisAreaVis(diagram: any, visObject: any, parentSvgObject: any): any {
    let res: any = null;
    if (visObject && (this.page === null || this.page === visObject.page)) {
      const graphicConfig = this.getGraphicConfigFromObjectClassName(visObject, this.graphicConfigByObjectClassNameMap);
      const isARect = graphicConfig && graphicConfig.isARect !== undefined ? graphicConfig.isARect : true;
      const positionData = this.calcPositionDataFromVisObject(visObject, isARect);
      if (positionData) {
        res = {
          type: "library-object",
          libraryId: "polyline-1",
          visObject,
          boId: visObject.ref,
          bo: visObject.refObject,
          label: "?",
          x: positionData.coordOrg.x,
          y: positionData.coordOrg.y,
          rotate: visObject.graphicalObjectAngle ? -parseInt(visObject.graphicalObjectAngle, 10) : 0,
          points: positionData.points,
        };
        this.applyHardCodedGraphicalSettings(visObject, res, this.graphicConfigByObjectClassNameMap, {
          coordOrg: positionData.coordOrg,
          pointList: positionData.pointList,
        });
        this.applyGraphicalSettings(visObject, res, { fill: "none" });
        this.getDiagramService().addSvgObject(res, parentSvgObject);
      }
    }
    return res;
  }

  private buildSvgObjectFromArchitectureObjectVisList(diagram: any, visObjectList: any[], parentSvgObject: any) {
    if (visObjectList && visObjectList.forEach) {
      visObjectList.forEach((architectureAreaVis: any) => {
        this.buildSvgObjectFromArchitectureObjectVis(diagram, architectureAreaVis, parentSvgObject);
      });
    }
  }

  private buildSvgObjectFromArchitectureObjectVis(diagram: any, visObject: any, parentSvgObject: any): any {
    let res: any = null;
    if (visObject && (this.page === null || this.page === visObject.page)) {
      const position = visObject["GenericADM:position"];
      const graphicalObjectClass = visObject["GenericADM:graphicalObjectClass"];

      if (position && graphicalObjectClass) {
        let scaleX = 17;
        let scaleY = 8;
        let libraryId = this.getLibraryIdFromVisObject(visObject);
        if (!libraryId || libraryId === "error-1") {
          libraryId = this.defaultEquipmentLibraryId;
          scaleX = 1;
          scaleY = 1;
        }

        // Build svg object
        const coord = this.getCoordFromVisPosition(position);
        const label = "?";

        if (libraryId !== this.defaultEquipmentLibraryId) {
          res = {
            type: "library-object",
            libraryId,
            visObject,
            boId: visObject.ref,
            bo: visObject.refObject,
            label,
            x: coord.x,
            y: coord.y,
            rotate: visObject.graphicalObjectAngle ? -parseInt(visObject.graphicalObjectAngle, 10) : 0,
            scaleX,
            scaleY,
          };
          this.applyGraphicalSettings(visObject, res);
          this.getDiagramService().addSvgObject(res, parentSvgObject);

          const rectSvgObject = {
            type: "library-object",
            libraryId: this.defaultEquipmentLibraryId,
            visObject,
            boId: visObject.ref,
            bo: visObject.refObject,
            label,
            x: coord.x,
            y: coord.y,
            rotate: visObject.graphicalObjectAngle ? -parseInt(visObject.graphicalObjectAngle, 10) : 0,
          };
          this.applyGraphicalSettings(visObject, rectSvgObject);
          this.getDiagramService().addSvgObject(rectSvgObject, parentSvgObject);
        } else {
          res = {
            type: "library-object",
            libraryId: this.defaultEquipmentLibraryId,
            visObject,
            boId: visObject.ref,
            bo: visObject.refObject,
            label,
            x: coord.x,
            y: coord.y,
            rotate: visObject.graphicalObjectAngle ? -parseInt(visObject.graphicalObjectAngle, 10) : 0,
          };
          this.applyGraphicalSettings(visObject, res);
          this.getDiagramService().addSvgObject(res, parentSvgObject);
        }

        // const rectSvgObject = {
        //   type: "rect",
        //   visObject,
        //   boId: visObject.ref,
        //   bo: visObject.refObject,
        //   x: coord.x,
        //   y: coord.y,
        //   rotate: visObject.graphicalObjectAngle ? -parseInt(visObject.graphicalObjectAngle, 10) : 0,
        //   width: 125,
        //   height: 100,
        //   rx: 20,
        //   ry: 20,
        //   stroke: "#aaa",
        //   strokeWidth: "2",
        //   strokeDasharray: "2,4",
        //   fill: "none",
        // };
        // this.applyGraphicalSettings(visObject, rectSvgObject);
        // this.getDiagramService().addSvgObject(rectSvgObject, parentSvgObject);

        // const iconSvgObject = {
        //   type: "library-object",
        //   libraryId,
        //   visObject,
        //   boId: visObject.ref,
        //   bo: visObject.refObject,
        //   label,
        //   x: 0,
        //   y: 0,
        //   rotate: 0,
        //   scale: 20,
        //   // scaleX,
        //   // scaleY,
        // };
        // this.applyGraphicalSettings(visObject, iconSvgObject);

        // const rectSvgObject = {
        //   type: "rect",
        //   visObject,
        //   boId: visObject.ref,
        //   bo: visObject.refObject,
        //   x: 0,
        //   y: 0,
        //   width: 125,
        //   height: 100,
        //   rx: 20,
        //   ry: 20,
        //   stroke: "#aaa",
        //   strokeWidth: "2",
        //   strokeDasharray: "2,2",
        //   fill: "none",
        // };

        // res = {
        //   type: "group",
        //   libraryId,
        //   visObject,
        //   boId: visObject.ref,
        //   bo: visObject.refObject,
        //   label,
        //   x: coord.x,
        //   y: coord.y,
        //   rotate: visObject.graphicalObjectAngle ? -parseInt(visObject.graphicalObjectAngle, 10) : 0,
        // };
        // this.getDiagramService().addSvgObject(rectSvgObject, res);
        // this.getDiagramService().addSvgObject(iconSvgObject, res);

        // this.getDiagramService().addSvgObject(res, parentSvgObject);
      }
    }
    return res;
  }
}
