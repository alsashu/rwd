export class SvgService {
  constructor() {}

  public getSvgObjectsWithLibraryId(rootSvgObject: any, libraryIds: string[]): any[] {
    return rootSvgObject.svgObjects.filter((svgObject: any) => libraryIds.includes(svgObject.libraryId));
    //    return this.svgObjectService.findSvgObjectsFromLibraryIds(libraryIds);
  }

  public getSvgObjectsWithLibraryIdAndBoId(rootSvgObject: any, libraryIds: string[], boId: string): any[] {
    return rootSvgObject.svgObjects.filter(
      (svgObject: any) => libraryIds.includes(svgObject.libraryId) && svgObject.boId == boId
    );
    //    return this.svgObjectService.findSvgObjectsWithLibraryIdAndBoId(libraryIds, boId);
  }

  public visitSvgObjectRec(svgObject: any, cb: any): any {
    let res = null;
    if (svgObject) {
      if (cb) {
        res = cb(svgObject);
      }
      if (!res && svgObject.svgObjects) {
        svgObject.svgObjects.forEach((child: any) => {
          if (!res) {
            res = this.visitSvgObjectRec(child, cb);
          }
        });
      }
    }
    return res;
  }

  public getSvgObjectsConnectedToSvgObject(rootSvgObject: any, svgObjectDest: any): any {
    let list = [];
    this.visitSvgObjectRec(rootSvgObject, (svgObject: any) => {
      if (svgObject.connections) {
        svgObject.connections.forEach((c: any) => {
          if (c.svgObject2 && c.svgObject2.id == svgObjectDest.id) {
            list.push(svgObject);
          }
        });
      }
      return null;
    });
    return list;
  }

  public getSvgObjectByBoId(rootSvgObject: any, boId: any): any {
    let res: any = null;
    this.visitSvgObjectRec(rootSvgObject, (svgObject: any) => {
      if (svgObject.boId == boId) {
        res = svgObject;
        return res;
      }
      return null;
    });
    return res;
  }

  public filterSvgObjectsByBoTypes(svgObjects: any[], types: string[]): any[] {
    return svgObjects.filter((svg: any) => svg.bo && svg.bo.type && types.includes(svg.bo.type));
  }

  public getBoListFromSvgObjects(svgObjects: any[]): any[] {
    let list: any[] = [];
    if (svgObjects) {
      svgObjects.forEach((o: any) => {
        if (o.bo) {
          list.push(o.bo);
        }
      });
    }
    return list;
  }
}
