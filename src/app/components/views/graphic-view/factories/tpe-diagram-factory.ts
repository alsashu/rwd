import { GraphicViewComponent } from "../graphic-view.component";
import { ADiagramFactory } from "./adiagram-factory";

export class TPEDiagramFactory extends ADiagramFactory {
  constructor(
    protected graphicViewComponent: GraphicViewComponent,
    private params: any = {
      isRouteVisible: () => false,
      isTVDSectionVisible: () => false,
    }
  ) {
    super(graphicViewComponent);
  }

  public buildSvgObjectFromDiagram(diagram: any): any {
    return this.buildSvgObjectRec(diagram);
  }

  private buildSvgObjectRec(diagram: any, visObject: any = null, parentSvgObject: any = null): any {
    let res = null;
    if (visObject === null) {
      res = {
        type: "root",
        visObject: diagram,
        svgObjects: [],
      };
      if (diagram.lineVis) {
        this.resetMinMaxCoords();
        const lineVisSvgObject = this.buildSvgObjectRec(diagram, diagram.lineVis, res);
        this.calcDiagramOrgCoord(diagram);
      }
    } else if (visObject.forEach) {
      visObject.forEach((vo: any) => {
        this.buildSvgObjectRec(diagram, vo, parentSvgObject);
      });
    } else if (visObject.type === "lineVis") {
      res = this.buildSvgObjectFromLineVisObject(diagram, visObject, parentSvgObject);
    } else if (visObject.type === "trackVis") {
      res = this.buildSvgObjectFromTrackVisObject(diagram, visObject, parentSvgObject);
    } else if (visObject.type === "trackElementVis") {
      res = this.buildLibrarySvgObjectFromVisObject(diagram, visObject, parentSvgObject);
    } else if (visObject.type === "GenericADM:trackAreaVis") {
      if (this.params && this.params.isRouteVisible()) {
        res = this.buildLibrarySvgObjectFromTrackAreaVisObject(diagram, visObject, parentSvgObject);
      }
    } else if (visObject.type === "GenericADM:nonDXFArrow") {
      res = this.buildLibrarySvgObjectFromnonDXFArrowsObject(diagram, visObject, parentSvgObject);
    } else if (visObject.type === "GenericADM:areaVis") {
      res = this.buildLibrarySvgObjectFromTrackAreaVisObject(diagram, visObject, parentSvgObject);
    }
    return res;
  }

  private buildSvgObjectFromLineVisObject(diagram: any, visObject: any, parentSvgObject: any): any {
    let res = null;
    if (visObject && visObject.type === "lineVis") {
      res = {
        type: "group",
        visObject: diagram,
        svgObjects: [],
      };
      this.getDiagramService().addSvgObject(res, parentSvgObject);
      this.buildSvgObjectsRec(diagram, visObject.trackVis, res);
      this.buildSvgObjectsRec(diagram, visObject["GenericADM:areaVis"], res);
    }
    return res;
  }

  private buildSvgObjectFromTrackVisObject(diagram: any, visObject: any, parentSvgObject: any): any {
    let res = null;
    if (visObject && visObject.type === "trackVis") {
      res = {
        type: "group",
        visObject,
        svgObjects: [],
      };
      this.getDiagramService().addSvgObject(res, parentSvgObject);

      this.buildTrackSvgObjectFromTrackVisObject(diagram, visObject, res);
      this.buildSvgObjectsRec(diagram, visObject.trackElementVis, res);
      this.buildSvgObjectsRec(diagram, visObject["GenericADM:nonDXFBlockTexts"], res);
      this.buildSvgObjectsRec(diagram, visObject["GenericADM:trackAreaVis"], res);
    }
    return res;
  }

  protected calcPositionDataFromTPEVisObject(visObject: any): {
    coordOrg: { x: number; y: number };
    pointList: { x: number; y: number }[];
    points: string;
  } {
    const res = {
      coordOrg: { x: 0, y: 0 },
      pointList: [],
      points: "0,0 ",
    };

    if (visObject.trackElementVis) {
      const trackBeginTEVis = visObject.trackElementVis.find((tev: any) => tev.objectClassName === "trackBegin");
      const trackEndTEVis = visObject.trackElementVis.find((tev: any) => tev.objectClassName === "trackEnd");
      const vertexWithKPTEVisList = visObject.trackElementVis.filter(
        (tev: any) => tev.objectClassName === "vertexWithKP" || tev.objectClassName === "GenericADM:vertexWithKP"
      );

      if (!(trackBeginTEVis && trackEndTEVis)) {
        return null;
      }
      res.coordOrg = this.getCoordFromVisPosition(trackBeginTEVis.position);
      const coordDest = this.getCoordFromVisPosition(trackEndTEVis.position);

      res.pointList = [res.coordOrg];
      vertexWithKPTEVisList.forEach((vertexWithKPTEVis: any) => {
        res.pointList.push(this.getCoordFromVisPosition(vertexWithKPTEVis.position));
      });
      res.pointList.push(coordDest);

      res.pointList.forEach((coord: any) => {
        res.points += String(coord.x - res.coordOrg.x) + "," + String(+(coord.y - res.coordOrg.y)) + " ";
      });
    }
    return res;
  }

  private buildTrackSvgObjectFromTrackVisObject(diagram: any, visObject: any, parentSvgObject: any): any {
    let res: any = null;
    if (visObject) {
      const positionData = this.calcPositionDataFromTPEVisObject(visObject);
      if (positionData) {
        const label = visObject.refObject
          ? visObject.refObject.label || visObject.refObject.name || visObject.refObject.id
          : visObject.ref;
        const libraryId = "voie-tpe-1";
        res = {
          type: "library-object",
          libraryId,
          visObject,
          boId: visObject.ref,
          bo: visObject.refObject,
          x: positionData.coordOrg.x,
          y: positionData.coordOrg.y,
          points: positionData.points,
          label,
        };
        this.getDiagramService().addSvgObject(res, parentSvgObject);
      }
    }
    return res;
  }

  private buildSvgObjectsRec(diagram: any, visObjects: any[], parentSvgObject: any): any {
    let res = null;
    if (visObjects && visObjects.forEach && parentSvgObject && parentSvgObject.svgObjects) {
      visObjects.forEach((visObject: any) => {
        res = this.buildSvgObjectRec(diagram, visObject, parentSvgObject);
      });
    }
    return res;
  }

  private getHardCodedLibraryIdFromTPEVisObject(
    visObject: any,
    parentVisObject: any
  ): {
    libraryId: string;
    bo: any;
  } {
    const res = {
      libraryId: "tpe-default-1",
      bo: visObject ? visObject.refObject : null,
    };
    if (visObject && visObject.objectClassName) {
      let trackTopology = null;
      let trackBegin = null;
      let trackEnd = null;
      if (
        parentVisObject &&
        parentVisObject.refObject &&
        parentVisObject.refObject.type === "track" &&
        parentVisObject.refObject.trackTopology
      ) {
        trackTopology = parentVisObject.refObject.trackTopology;
        trackBegin = trackTopology.trackBegin;
        trackEnd = trackTopology.trackEnd;
      }
      if (visObject.objectClassName === "trackBegin") {
        res.libraryId = "track-connection-1";
        if (trackBegin) {
          res.bo = trackBegin;
          if (trackBegin.openEnd) {
            res.libraryId = "track-be-open-end-1";
          } else if (trackBegin.bufferStop) {
            res.libraryId = "track-be-buffer-stop-1";
          }
        }
      } else if (visObject.objectClassName === "trackEnd") {
        res.libraryId = "track-connection-1";
        if (trackEnd) {
          res.bo = trackEnd;
          if (trackEnd.openEnd) {
            res.libraryId = "track-be-open-end-1";
          } else if (trackEnd.bufferStop) {
            res.libraryId = "track-be-buffer-stop-1";
          }
        }
      } else if (
        visObject.objectClassName === "vertexWithKP" ||
        visObject.objectClassName === "GenericADM:vertexWithKP"
      ) {
        res.libraryId = "track-vertex-1";
      }
    }
    return res;
  }

  private buildLibrarySvgObjectFromVisObject(diagram: any, visObject: any, parentSvgObject: any): any {
    let res = null;

    if (visObject) {
      if (visObject.type === "trackElementVis") {
        const position = visObject["position"];
        const graphicalObjectClass = visObject["GenericADM:graphicalObjectClass"];

        if (position) {
          let libraryId = null;
          let bo = visObject.refObject;

          if (graphicalObjectClass) {
            libraryId = this.getLibraryIdFromVisObject(visObject);
          } else {
            const hcData = this.getHardCodedLibraryIdFromTPEVisObject(
              visObject,
              parentSvgObject ? parentSvgObject.visObject : null
            );
            libraryId = hcData.libraryId;
            bo = hcData.bo;
            if (!visObject.refObject) {
              visObject.refObject = hcData.bo;
            }
          }

          if (libraryId) {
            const coord = this.getCoordFromVisPosition(position);
            const label = "";

            // TODO TO BE DELETED label mapped by rule
            // const label = visObject.refObject
            //   ? visObject.refObject.label || visObject.refObject.name || visObject.refObject.id
            //   : visObject.ref;

            res = {
              type: "library-object",
              libraryId,
              visObject,
              boId: visObject.ref,
              bo,
              label,
              x: coord.x,
              y: coord.y,
              rotate: visObject.graphicalObjectAngle ? -parseInt(visObject.graphicalObjectAngle, 10) : 0,
            };

            this.getDiagramService().addSvgObject(res, parentSvgObject);

            //         if (res.ctrlData && res.ctrlData.anc) {
            //           if (res.ctrlData.anc.anchor && res.ctrlData.anc.boudingRect) {
            //             const scale = 0.1;
            //             const dx = -(res.ctrlData.anc.boudingRect.w / 2 + res.ctrlData.anc.anchor.x) * scale;
            //             const dy = -(res.ctrlData.anc.boudingRect.h / 2 + res.ctrlData.anc.anchor.y) * scale;
            // //            res.transform = "scale(" + scale + " " + scale + ") translate(100 0)";
            //             res.transform = "scale(0.1 0.1)";

            //             // res.x -= (res.ctrlData.anc.boudingRect.w / 2 + res.ctrlData.anc.anchor.x) * scale;
            //             // res.y -= (res.ctrlData.anc.boudingRect.h / 2 + res.ctrlData.anc.anchor.y) * scale;
            //           }
            //         }

            // console.log(">>>", res);        }
          }
        }
      }
    }
    return res;
  }

  protected calcPositionDataFromTPETrackAreaVisObject(
    diagram: any,
    visObject: any
  ): {
    coordOrg: { x: number; y: number };
    pointList: { x: number; y: number }[];
    points: string;
  } {
    const res = {
      coordOrg: { x: 0, y: 0 },
      pointList: [],
      points: " ",
    };
    if (visObject["GenericADM:positions"]) {
      const beginVis = visObject["GenericADM:positions"]["GenericADM:start"];
      const endVis = visObject["GenericADM:positions"]["GenericADM:end"];
      const vertexList = visObject["GenericADM:positions"]["GenericADM:vertexes"];

      if (!(beginVis && endVis)) {
        return null;
      }
      res.pointList = [this.getCoordFromVisPosition(beginVis)];
      const coordDest = this.getCoordFromVisPosition(endVis);

      // for (let index = 0; index < vertexList.length; index++) {
      //   res.pointList.push(this.getCoordFromVisPosition(vertexList[index]));
      // }

      if (vertexList && vertexList.length) {
        vertexList.forEach((vertex: any) => {
          res.pointList.push(this.getCoordFromVisPosition(vertex));
        });
      }
      res.pointList.push(coordDest);

      res.pointList.sort((a: any, b: any) => {
        if (a.x && b.x) {
          return a.x - b.x;
        }
      });

      res.coordOrg = res.pointList[0];

      res.pointList.forEach((coord: any) => {
        res.points += String(coord.x - res.coordOrg.x) + "," + String(+(coord.y - res.coordOrg.y)) + " ";
      });
      // console.log("CREATED A ROUTE HERE !!!!!!!", res);
    } else if (visObject["GenericADM:logicalPositions"] && this.params.isTVDSectionVisible) {
      const beginVis = visObject["GenericADM:logicalPositions"]["GenericADM:logicalStart"];
      const endVis = visObject["GenericADM:logicalPositions"]["GenericADM:logicalEnd"];
      const vertexList = visObject["GenericADM:logicalPositions"]["GenericADM:logicalVertexes"] || [];
      // need to find pos using elementIDRef

      if (!(beginVis && endVis)) {
        return null;
      }
      res.coordOrg = this.getCoordFromVisPosition(this.getPointsWithelementIDRef(diagram, beginVis.elementIDRef));
      const coordDest = this.getCoordFromVisPosition(this.getPointsWithelementIDRef(diagram, endVis.elementIDRef));

      res.pointList = [res.coordOrg];
      res.pointList.push(coordDest);
      // for (let index = 0; index < vertexList.length; index++) {
      //   res.pointList.push(
      //     this.getCoordFromVisPosition(this.getPointsWithelementIDRef(diagram, vertexList[index].elementIDRef))
      //   );
      // }
      if (vertexList && vertexList.length) {
        vertexList.forEach((vertex: any) => {
          res.pointList.push(
            this.getCoordFromVisPosition(this.getPointsWithelementIDRef(diagram, vertex.elementIDRef))
          );
        });
      }

      console.log("Test tvd section : ", res.pointList);
      res.pointList.forEach((coord: any) => {
        res.points += String(coord.x - res.coordOrg.x) + "," + String(+(coord.y - res.coordOrg.y)) + " ";
      });
    }
    return res;
  }

  private getPointsWithelementIDRef(diagram: any, id: string) {
    let res = null;
    const trackVis = diagram.lineVis.trackVis;
    for (const trackV of trackVis) {
      const trackElementVis = trackV.trackElementVis;
      res = res || trackElementVis.find((e) => e.ref === id);
    }
    // console.log("Test get point : ", res.position);
    return res.position;
  }

  private buildLibrarySvgObjectFromTrackAreaVisObject(diagram: any, visObject: any, parentSvgObject: any): any {
    let res = null;

    if (visObject) {
      if (visObject.type === "GenericADM:trackAreaVis") {
        const positionData = this.calcPositionDataFromTPETrackAreaVisObject(diagram, visObject);
        if (positionData) {
          const label = visObject.refObject
            ? visObject.refObject.label || visObject.refObject.name || visObject.refObject.id
            : visObject.ref;
          const libraryId = visObject.objectClassName === "route" ? "" : "tvd-section";

          res = {
            type: "library-object",
            libraryId,
            visObject,
            boId: visObject.ref,
            bo: visObject.refObject,
            label,
            x: positionData.coordOrg.x,
            y: positionData.coordOrg.y,
            points: positionData.points,
          };

          this.getDiagramService().addSvgObject(res, parentSvgObject);
        }
      }

      // --- Add logical groups from the model (project) ---(Ashu)
      if (visObject.type === "GenericADM:areaVis") {
        const positionData = this.calcPositionDataFromTPETrackAreaVisObject(diagram, visObject);
        if (positionData) {
          // Determine group type and assign style/color
          let groupType = visObject.objectClassName; // e.g., "GenericADM:alphaLogicalAreaGroup"
          let libraryId = "logical-area-group"; // Use a custom libraryId for logical groups
          let color = "black"; // Default color
  
          // Assign color based on group type
          if (groupType === "GenericADM:alphaLogicalAreaGroup") color = "red";
          else if (groupType === "GenericADM:betaLogicalAreaGroup") color = "cyan";
          else if (groupType === "GenericADM:logicalAreaGroup") color = "green";
          else if (groupType === "GenericADM:specificLogicalAreaGroup") color = "purple";
  
          // You can also extract label from visObject or its refObject
          const label = visObject.refObject
            ? visObject.refObject.label || visObject.refObject.name || visObject.refObject.id
            : visObject.ref;
  
          res = {
            type: "library-object",
            libraryId,
            visObject,
            boId: visObject.ref,
            bo: visObject.refObject,
            label,
            x: positionData.coordOrg.x,
            y: positionData.coordOrg.y,
            points: positionData.points,
            color, // Pass color for rendering
          };
  
          // Optionally, apply graphical settings
          res.stroke = color;
          res.strokeWidth = 3;
          res.lineStyle = "dashed";
  
          this.getDiagramService().addSvgObject(res, parentSvgObject);
        }
      }
      // --- Add logical groups from the model (project) ---(Ashu)

      const arrows = visObject["GenericADM:nonDXFArrows"] || [];
      for (const arrow of arrows) {
        this.buildSvgObjectRec(diagram, arrow, parentSvgObject);
      }
    }
    return res;
  }

  private buildLibrarySvgObjectFromnonDXFArrowsObject(diagram: any, visObject: any, parentSvgObject: any): any {
    let res = null;
    if (visObject) {
      if (visObject.type === "GenericADM:nonDXFArrow") {
        const coord = this.getCoordFromVisPosition(visObject.position);
        if (coord) {
          const label = visObject.refObject
            ? visObject.refObject.label || visObject.refObject.name || visObject.refObject.id
            : visObject.ref;
          const libraryId = "route-arrow-2";

          res = {
            type: "library-object",
            libraryId,
            visObject,
            boId: visObject.ref,
            bo: visObject.refObject,
            label,
            x: coord.x,
            y: coord.y,
            rotate: visObject.arrowAngle ? -parseInt(visObject.arrowAngle, 10) : 0,
          };
          this.getDiagramService().addSvgObject(res, parentSvgObject);
        }
      }
    }
    return res;
  }
}
