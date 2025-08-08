import { ADiagramFactory } from "./adiagram-factory";

export class TypicalDiagramFactory extends ADiagramFactory {
  public buildSvgObjectFromDiagram(diagram: any): any {
    const res = {
      type: "root",
      visObject: diagram,
      svgObjects: [],
    };

    if (diagram.typicalITFDiagramVis) {
      const mainGroup = {
        type: "group",
        visObject: diagram,
        svgObjects: [],
      };
      this.getDiagramService().addSvgObject(mainGroup, res);
      this.resetMinMaxCoords();
      this.buildSvgObjectsFromVisualization(diagram, diagram.typicalITFDiagramVis, mainGroup);
      this.calcDiagramOrgCoord(diagram);
    }
    return res;
  }

  private buildSvgObjectsFromVisualization(diagram: any, visualization: any, parentSvgObject: any) {
    if (visualization) {
      this.buildSvgObjectFromComponentObjectVisList(
        diagram,
        visualization["GenericADM:componentObjectVis"],
        parentSvgObject
      );
      this.buildSvgObjectFromComponentAreaVisList(
        diagram,
        visualization["GenericADM:componentAreaVis"],
        parentSvgObject
      );
    }
  }

  // Components
  private buildSvgObjectFromComponentObjectVisList(diagram: any, visObjectList: any[], parentSvgObject: any) {
    if (visObjectList && visObjectList.forEach) {
      visObjectList.forEach((componentObjectVis: any) => {
        this.buildSvgObjectFromComponentObjectVis(diagram, componentObjectVis, parentSvgObject);
      });
    }
  }

  private buildSvgObjectFromComponentObjectVis(diagram: any, visObject: any, parentSvgObject: any): any {
    let res: any = null;
    if (visObject) {
      const position = visObject["GenericADM:position"];
      const graphicalObjectClass = visObject["GenericADM:graphicalObjectClass"];

      if (position && graphicalObjectClass) {
        const libraryId = this.getLibraryIdFromVisObject(visObject);
        if (libraryId === "error-1") {
          return null;
        }

        // Build svg object
        const coord = this.getCoordFromVisPosition(position);
        const label = "?";
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
        };

        this.applyGraphicalSettings(visObject, res);
        this.getDiagramService().addSvgObject(res, parentSvgObject);
      }
    }
    return res;
  }

  // Connections
  private buildSvgObjectFromComponentAreaVisList(diagram: any, visObjectList: any[], parentSvgObject: any) {
    if (visObjectList && visObjectList.forEach) {
      visObjectList.forEach((componentAreaVis: any) => {
        this.buildSvgObjectFromComponentAreaVis(diagram, componentAreaVis, parentSvgObject);
      });
    }
  }

  private buildSvgObjectFromComponentAreaVis(diagram: any, visObject: any, parentSvgObject: any): any {
    let res: any = null;
    if (visObject) {
      const positionData = this.calcPositionDataFromVisObject(visObject);
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
        this.applyGraphicalSettings(visObject, res, { fill: "none" });
        this.getDiagramService().addSvgObject(res, parentSvgObject);
      }
    }
    return res;
  }

  protected getLibraryIdFromVisObject(visObject: any): string {
    let libraryId = "error-1";
    // /!\ visObject.refObject.componentIDObject: specific to this type of diagram
    const componentIDObject = visObject && visObject.refObject ? visObject.refObject.componentIDObject : null;
    const libraryData = this.getLibraryDataFromObjectTypeAndSubType(componentIDObject);
    const libraryIdMapped = this.getLibraryIdFromLibraryData(libraryData, visObject);
    if (libraryIdMapped) {
      libraryId = libraryIdMapped;
    }
    return libraryId;
  }
}
