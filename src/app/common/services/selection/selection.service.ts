import { MvcService } from "../../../services/mvc/mvc.service";
import { MvcConst } from "src/app/services/mvc/mvc.const";

/**
 * Interface of the selection service
 */
export interface ISelectionService {
  getSelectedObjects(): any[];
  selectObjects(objects: any[], value?: any, pOptions?: any): any[];
  deselectAllObjects(pOptions?: any): any[];
  getSelectedLibraryObjects(): any[];
  selectLibraryObjects(objects: any[], value?: any, pOptions?: any): any[];
  deselectAllLibraryObjects(pOptions?: any): any[];
  getSelectedSvgObjects(): any[];
  selectSvgObjects(objects: any[], value?: any, pOptions?: any): any[];
  deselectAllSvgObjects(pOptions?: any): any[];
  updateSelectionFrozzenStatus();
  isFrozzen();
}

/**
 * Service managing objects selection
 */
export class SelectionService implements ISelectionService {
  private static BO_TYPE = 1;
  private static LIB_TYPE = 2;
  private static SVG_TYPE = 3;
  private selectionFrozzen = false;

  private dataMap = new Map([
    [SelectionService.BO_TYPE, { selectedObjects: [], type: MvcConst.MSG_BO_SELECTION_CHANGED }],
    [SelectionService.LIB_TYPE, { selectedObjects: [], type: MvcConst.MSG_LIB_SELECTION_CHANGED }],
    [SelectionService.SVG_TYPE, { selectedObjects: [], type: MvcConst.MSG_SVG_SELECTION_CHANGED }],
  ]);

  constructor(public mvcService: MvcService) {}

  public getSelectedObjects(): any[] {
    return this.getSelectedObjectsByType(SelectionService.BO_TYPE);
  }

  public selectObjects(objects: any[], value: any = true, pOptions: any = null): any[] {
    return this.selectObjectsImpl(SelectionService.BO_TYPE, objects, value, pOptions);
  }

  public deselectAllObjects(pOptions = null): any[] {
    return this.deselectAllImpl(SelectionService.BO_TYPE, pOptions);
  }

  public getSelectedLibraryObjects(): any[] {
    return this.getSelectedObjectsByType(SelectionService.LIB_TYPE);
  }

  public selectLibraryObjects(objects: any[], value: any = true, pOptions: any = null): any[] {
    return this.selectObjectsImpl(SelectionService.LIB_TYPE, objects, value, pOptions);
  }

  public deselectAllLibraryObjects(pOptions: any = null): any[] {
    return this.deselectAllImpl(SelectionService.LIB_TYPE, pOptions);
  }

  public getSelectedSvgObjects(): any[] {
    return this.getSelectedObjectsByType(SelectionService.SVG_TYPE);
  }

  public selectSvgObjects(objects: any[], value: any = true, pOptions: any = null): any[] {
    return this.selectObjectsImpl(SelectionService.SVG_TYPE, objects, value, pOptions);
  }

  public deselectAllSvgObjects(pOptions: any = null): any[] {
    return this.deselectAllImpl(SelectionService.SVG_TYPE, pOptions);
  }

  private getDataByType(selType: number): any {
    return this.dataMap.get(selType);
  }

  private getSelectedObjectsByType(selType: number): any[] {
    return this.dataMap.get(selType).selectedObjects;
  }

  private selectObjectsImpl(selType: number, objects: any[], value: any = true, pOptions: any = null): any[] {
    if (this.selectionFrozzen) {
      return;
    }
    let res = [];
    if (objects && objects.forEach) {
      const options = {
        deselectAll: true,
        notify: true,
      };
      if (pOptions) {
        if (pOptions.deselectAll !== undefined) {
          options.deselectAll = pOptions.deselectAll;
        }
        if (pOptions.notify !== undefined) {
          options.notify = pOptions.notify;
        }
      }
      const data = this.getDataByType(selType);
      const theSelectedObjects = data.selectedObjects;
      if (options.deselectAll && value != null) {
        theSelectedObjects.forEach((o: any) => (o.isSelected = false));
      }
      objects.forEach((o: any) => {
        if (value == null) {
          o.isSelected = o.isSelected ? false : true;
          if (o.isSelected) {
            theSelectedObjects.push(o);
          } else {
            theSelectedObjects.splice(theSelectedObjects.indexOf(o), 1);
          }
        } else {
          o.isSelected = value;
        }
      });
      const newSelectedObjects = value == null ? theSelectedObjects : objects;
      res = this.setSelectedObjectsImpl(selType, newSelectedObjects, options.notify);
    }
    return res;
  }

  private deselectAllImpl(selType: number, pOptions: any = null): any[] {
    const options = {
      deselectAll: true,
      notify: true,
    };
    if (pOptions) {
      if (pOptions.notify !== undefined) {
        options.notify = pOptions.notify;
      }
    }
    return this.selectObjectsImpl(selType, [], false, options);
  }

  private setSelectedObjectsImpl(selType: number, selectedObjects: any[], notify: boolean = true): any[] {
    // We prevent modification if selection is frozzen
    if (this.selectionFrozzen) {
      return;
    }
    let res = [];
    const data = this.getDataByType(selType);
    if (data && data.selectedObjects && selectedObjects && selectedObjects.forEach) {
      //      data.selectedObjects.forEach(o => o.isSelected = false);
      data.selectedObjects = selectedObjects;
      data.selectedObjects.forEach((o: any) => (o.isSelected = true));
      if (notify) {
        this.doNotify(data);
      }
      res = data.selectedObjects;
      // console.log(">> setSelectedObjectsImpl", selType, selectedObjects, data.selectedObjects, data);
    }
    return res;
  }

  public updateSelectionFrozzenStatus() {
    this.selectionFrozzen = !this.selectionFrozzen;
    // change status in diagram service too
    this.mvcService.emit({ type: MvcConst.MSG_FREEZE_SELECTION, value: this.selectionFrozzen });
  }

  public isFrozzen() {
    return this.selectionFrozzen;
  }

  private doNotify(data: any) {
    this.mvcService.emit({
      type: data.type,
      data: data.selectedObjects,
    });
  }
}
