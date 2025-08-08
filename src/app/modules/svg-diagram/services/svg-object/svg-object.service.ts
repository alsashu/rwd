import { ISvgDiagramService } from "../diagram/svg-diagram.service";

/**
 * Interface of the Svg object service
 */
export interface ISvgObjectService {
  svgDiagramService: ISvgDiagramService;

  forEachCB(cb: any);
  findCB(cb: any): any;
  filterCB(cb: any): any[];

  findSvgObjectsFromBos(bos: any[]): any[];
}

/**
 * Svg object service
 */
export class SvgObjectService implements ISvgObjectService {
  /**
   * Construtor
   * @param svgDiagramService The parent svg Diagram Service
   */
  constructor(public svgDiagramService: ISvgDiagramService) {}

  /**
   * Get the list of the svg objects (including yellow objects from compared project)
   * @returns The svg objects
   */
  public getSvgObjects() {
    const res = this.svgDiagramService.getDisplayedSvgObjectList();
    return res ? res : [];
  }

  // ForEach / Find / (Filter)
  public forEachCB(cb: any) {
    if (cb) {
      this.getSvgObjects().forEach((svgObject: any) => {
        cb(svgObject);
      });
    }
  }

  public findCB(cb: any): any {
    return cb ? this.getSvgObjects().find((svgObject: any) => cb(svgObject)) : null;
  }

  public filterCB(cb: any): any[] {
    return cb ? this.getSvgObjects().filter((svgObject: any) => cb(svgObject)) : [];
  }

  public findSvgObjectWithProperty(propertyName: string): any {
    return this.findCB((svgObject: any) => svgObject && svgObject[propertyName] !== undefined);
  }

  public findSvgObjectsFromBoId(id: string): any[] {
    return this.filterCB((svgObject: any) => svgObject.getAttribute && svgObject.getAttribute("item_id") === id);
  }

  public findSvgObjectsFromBoIdAndType(id: string, type: string): any[] {
    // const searchType = type ? type.toUpperCase().replace("GENERICADM:", "") : "";
    const searchType = type ? type.toUpperCase().split(":").pop() : "";
    return this.filterCB(
      (svgObject: any) =>
        type &&
        svgObject.getAttribute &&
        svgObject.getAttribute("item_id") === id &&
        svgObject.getAttribute("object_class_name") &&
        svgObject.getAttribute("object_class_name").toUpperCase() === searchType
    );
  }

  public findSvgObjectsFromBos(bos: any[]): any[] {
    let res = [];
    if (bos && bos.forEach) {
      bos.forEach((bo: any) => (res = res.concat(this.findSvgObjectsFromBoIdAndType(bo.id, bo.type))));
    }
    return res;
  }

  public getBosFromSvgObjects(svgObjects: any[]): any[] {
    const res = [];
    if (svgObjects && svgObjects.forEach) {
      svgObjects.forEach((svgObject: any) => {
        if (svgObject.bo) {
          res.push(svgObject.bo);
        }
      });
    }
    return res;
  }
}
