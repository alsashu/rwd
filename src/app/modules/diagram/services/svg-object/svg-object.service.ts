import { GeometryService } from "./geometry.service";
import { DecorationService } from "./decoration.service";
import { IInitService, InitService } from "./init.service";
import { CloneService } from "./clone.service";
import { GraphService } from "./graph.service";
import { RefreshService } from "./refresh.service";
import { IDiagramService } from "../diagram/diagram.service";
import { RenderService } from "./render.service";
import { SvgService } from "./svg-service";

export interface ISvgObjectService {
  diagramService: IDiagramService;

  initService: IInitService;
  decorationService: DecorationService;
  geometryService: GeometryService;
  cloneService: CloneService;
  graphService: GraphService;
  refreshService: RefreshService;
  renderService: RenderService;
  svgService: SvgService;

  forEachCB(cb: any, svgObject?: any): any;
  findCB(cb: any, svgObject?: any): any;
  findSvgObjectWithProperty(svgObject: any, propertyName: string): any;
  findSvgObjectsFromLibraryIds(libraryIds: string[]): any[];
  findSvgObjectsWithLibraryIdAndBoId(libraryIds: string[], boId: string): any[];

  findLibrarySvgObjects(): any[];
  findSelectableSvgObjects(): any[];
}

export class SvgObjectService implements ISvgObjectService {
  public initService: IInitService = new InitService(this);
  public decorationService: DecorationService = new DecorationService(this);
  public geometryService: GeometryService = new GeometryService(this);
  public cloneService: CloneService = new CloneService(this);
  public graphService: GraphService = new GraphService(this);
  public refreshService: RefreshService = new RefreshService(this);
  public renderService: RenderService = new RenderService(this);
  public svgService: SvgService = new SvgService();

  constructor(public diagramService: IDiagramService) {}

  // ForEach / Find / (Filter)
  public forEachCB(cb: any, svgObject: any = null): any {
    svgObject = svgObject ? svgObject : this.diagramService.getRootSvgObject();
    if (cb) {
      cb(svgObject);
      if (svgObject.svgObjects) {
        svgObject.svgObjects.forEach((child: any) => {
          this.forEachCB(cb, child);
        });
      }
    }
    return svgObject;
  }

  public findCB(cb: any, svgObject: any = null): any {
    let res = null;
    svgObject = svgObject ? svgObject : this.diagramService.getRootSvgObject();
    if (cb) {
      res = cb(svgObject) ? svgObject : null;
      if (!res && svgObject && svgObject.svgObjects && svgObject.svgObjects.forEach) {
        svgObject.svgObjects.forEach((child: any) => {
          if (!res) {
            res = this.findCB(cb, child);
          }
        });
      }
    }
    return res;
  }

  public findSvgObjectWithProperty(svgObject: any, propertyName: string): any {
    return this.findCB((svg: any) => svg && svg[propertyName] != undefined, svgObject);
  }

  public findSvgObjectsFromBoId(id: string): any[] {
    const res = [];
    this.forEachCB((svgObject: any) => {
      if (svgObject.bo && svgObject.bo.id === id) {
        res.push(svgObject);
      }
    });
    return res;
  }

  public findSvgObjectsFromBos(bos: any[]): any[] {
    let res = [];
    if (bos && bos.forEach) {
      bos.forEach((bo: any) => (res = res.concat(this.findSvgObjectsFromBoId(bo.id))));
    }
    //    console.log(">> findSvgObjectsFromBos", bos, res, this.diagramService.getRootSvgObject());
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

  public findSvgObjectsFromLibraryIds(libraryIds: string[]): any[] {
    const res = [];
    this.forEachCB((svgObject: any) => {
      if (libraryIds.includes(svgObject.libraryId)) {
        res.push(svgObject);
      }
    });
    return res;
  }

  public findLibrarySvgObjects(): any[] {
    const res = [];
    this.forEachCB((svgObject: any) => {
      if (svgObject.libraryId) {
        res.push(svgObject);
      }
    });
    return res;
  }

  public findSelectableSvgObjects(): any[] {
    const res = [];
    this.forEachCB((svgObject: any) => {
      if (this.isSvgObjectSelectable(svgObject)) {
        res.push(svgObject);
      }
    });
    return res;
  }

  public isSvgObjectSelectable(svgObject: any): boolean {
    return svgObject && svgObject.libraryId && !(svgObject.isVisible === false || svgObject.isEnabled === false);
  }

  public filterSelectableSvgObjects(svgObjects: any[]): any[] {
    return svgObjects.filter((svgObject: any) => this.isSvgObjectSelectable(svgObject));
  }

  public findSvgObjectsWithLibraryIdAndBoId(libraryIds: string[], boId: string): any[] {
    const res = [];
    this.forEachCB((svgObject: any) => {
      if (libraryIds.includes(svgObject.libraryId) && svgObject.boId === boId) {
        res.push(svgObject);
      }
    });
    return res;
  }

  // bo
  public associateBoToSvgObject(svgObject: any, bo: any): any {
    if (svgObject) {
      this.diagramService.modify(svgObject, "bo", bo);
      this.diagramService.modify(svgObject, "boId", bo && bo.id ? bo.id : null);
    }
    this.refreshService.refreshSvgObjectRec(svgObject);
    return svgObject;
  }
}
