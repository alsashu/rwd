import { ISvgObjectService } from "./svg-object.service";
import { cloneDeep } from "lodash";
import { v4 as uuid } from "uuid";
import { DiagramEvent } from "../diagram/diagram-event";

export class CloneService {
  constructor(private svgObjectService: ISvgObjectService) {}

  // Clone
  public cloneSvgObjects(svgObjects: any[]): any[] {
    const res = [];
    if (svgObjects && svgObjects.forEach) {
      svgObjects.forEach((svgObject) => {
        const clone = this.getSvgObjectClone(svgObject);
        if (clone && svgObject.parent) {
          this.svgObjectService.diagramService.addSvgObject(clone, svgObject.parent);
          res.push(clone);
        }
      });
    }
    return res;
  }

  public getSvgObjectClone(svgObject: any): any {
    let clone = cloneDeep(svgObject);
    clone.id = uuid();
    clone.parent = svgObject.parent;
    clone.diagram = svgObject.diagram;
    clone.bo = svgObject.bo;

    const params = { resultClone: clone, doClone: true, svgObject };
    this.svgObjectService.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: DiagramEvent.CloningSvgObject,
        subject: clone,
        params,
      })
    );

    if (params.doClone) {
      clone = params.resultClone;
    }

    // TODO links
    return clone;
  }
}
