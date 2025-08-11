import { ModelService } from "../model/model.service";
import { ModelConstService } from "../model/model-const.service";
import { ISvgObjectLibrary } from "src/app/modules/diagram/services/template/template.service";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";

export class LibraryConstService {
  static ERROR_LIB_ID = "error-1";
}

export interface ILibraryService {
  getLibrary();
  getLibraryObjectByCb(libraryObject: any, cb: any): any;
  getLibraryObjectById(id: string): any;
  getDiagramById(id: string);
  getScriptById(id: string);
  getLibrarySvgObjectIdFromBoType(type: string): any;
  getBoTypeFromLibrarySvgObjectId(loId: string): any;
  getSvgObjectTemplateFromId(id: string): any;

  getPrototypeDiagrams();

  getCheckRuleFolder();
  getBusinessRuleFolder();
}

// tslint:disable-next-line: max-classes-per-file
export class LibraryService implements ILibraryService, ISvgObjectLibrary {
  private modelService: ModelService;

  constructor(public servicesService: IServicesService) {}

  public initService() {
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
  }

  public getLibrary() {
    return this.modelService.getLibrary();
  }

  public getLibraryObjectByCb(libraryObject: any, cb: any): any {
    let res = null;
    if (cb && cb(libraryObject)) {
      res = libraryObject;
    }
    if (!res && libraryObject.libraryObjects) {
      libraryObject.libraryObjects.forEach((libraryObjectI: any) => {
        if (!res) {
          res = this.getLibraryObjectByCb(libraryObjectI, cb);
        }
      });
    }
    return res;
  }

  public getLibraryObjectById(id: string): any {
    return id ? this.getLibraryObjectByCb(this.getLibrary(), (o: any) => o && o.id === id) : null;
  }

  // TODO REMOVE (MOCKUP CODE)
  public getDiagramById(id: string) {
    if (id) {
      const lo = this.getLibraryObjectByCb(this.getLibrary(), (o: any) => o.diagram && o.diagram.id === id);
      if (lo) {
        return lo.diagram;
      }
    }
    return null;
  }

  public getScriptById(id: string) {
    if (id) {
      const lo = this.getLibraryObjectByCb(
        this.getLibrary(),
        (o: any) => o.controlerData && o.controlerData.script && o.controlerData.script.id === id
      );
      if (lo) {
        return lo.controlerData.script;
      }
    }
    return null;
  }

  public getLibrarySvgObjectIdFromBoType(type: string): any {
    const library = this.getLibrary();
    const boSvg = library.boSvgObjectTypeMap.get(type);
    let loId = boSvg ? boSvg.loId : LibraryConstService.ERROR_LIB_ID;
    const lo = this.getLibraryObjectByCb(
      library,
      (o: any) => o && o.controlerData && o.controlerData.boTypes && o.controlerData.boTypes.includes(type)
    );
    if (lo) {
      loId = lo.id;
    }
    return loId;
  }

  public getBoTypeFromLibrarySvgObjectId(loId: string): any {
    let res = null;
    if (loId) {
      const library = this.getLibrary();
      library.boSvgObjectTypeMap.forEach((value: any, key: any) => {
        if (!res && value.loId === loId) {
          res = key;
        }
      });
    }
    return res;
  }

  public getSvgObjectTemplateFromId(id: string): any {
    let librarySvgObject = this.getLibraryObjectById(id);
    if (!librarySvgObject) {
      librarySvgObject = this.getLibraryObjectById(LibraryConstService.ERROR_LIB_ID);
    }
    return librarySvgObject;
  }

  public getPrototypeDiagrams() {
    const res = [];
    this.getLibraryObjectByCb(this.getLibrary(), (o: any) => {
      if (o.type === ModelConstService.DIAGRAM_PROTOTYPE_TYPE) {
        res.push(o);
      }
      return false;
    });
    return res;
  }

  public getCheckRuleFolder() {
    const lo = this.getLibraryObjectByCb(this.getLibrary(), (o: any) => o.folderType === "check-rule-folder");
    if (lo) {
      return lo;
    }
    return null;
  }

  public getBusinessRuleFolder() {
    const lo = this.getLibraryObjectByCb(this.getLibrary(), (o: any) => o.folderType === "business-rule-folder");
    if (lo) {
      return lo;
    }
    return null;
  }
}
