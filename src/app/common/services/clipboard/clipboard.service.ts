import { cloneDeep } from "lodash";

export class GenericClipboardService {
  private objects: any[] = [];

  constructor() {}

  public setObjects(objects: any[]) {
    this.objects = cloneDeep(objects);
  }

  public getObjects(): any[] {
    return this.objects;
  }
}

export interface IClipboardService {
  setObjects(objects: any[]);
  getObjects(): any[];
  setSvgObjects(svgObjects: any[]);
  getSvgObjects(): any[];
}

// tslint:disable-next-line: max-classes-per-file
export class ClipboardService implements IClipboardService {
  public bisObjectsClipboard: GenericClipboardService = new GenericClipboardService();
  public svgObjectsClipboard: GenericClipboardService = new GenericClipboardService();
  public libObjectsClipboard: GenericClipboardService = new GenericClipboardService();

  // interface
  public setObjects(objects: any[]) {
    this.bisObjectsClipboard.setObjects(objects);
  }

  public getObjects(): any[] {
    return this.bisObjectsClipboard.getObjects();
  }

  public setSvgObjects(svgObjects: any[]) {
    this.svgObjectsClipboard.setObjects(svgObjects);
  }

  public getSvgObjects(): any[] {
    return this.svgObjectsClipboard.getObjects();
  }
}
