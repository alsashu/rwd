import { IDiagramService } from "../diagram/diagram.service";

export interface ISvgObjectTemplate {}

export interface ISvgObjectLibrary {
  getSvgObjectTemplateFromId(id: string): any;
}

export class TemplateService {
  library: ISvgObjectLibrary;

  constructor(public diagramService: IDiagramService) {}

  public getSvgObjectTemplateFromId(id: string): any {
    return this.library ? this.library.getSvgObjectTemplateFromId(id) : null;
  }
}
