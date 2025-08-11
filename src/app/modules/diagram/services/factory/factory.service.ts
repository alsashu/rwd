import { IDiagramService } from "../diagram/diagram.service";
import { cloneDeep } from "lodash";
import { SvgConstService } from "../svg-object/svg-const.service";

export interface IFactory {
  type: string;
  build(params: any): any;
}

export abstract class AFactory implements IFactory {
  constructor(public diagramService: IDiagramService, public type: string) {}
  abstract build(params: any): any;
}

export class FactoryService {
  private factoryByTypeMap: Map<string, IFactory> = new Map();

  constructor(public diagramService: IDiagramService) {
    this.addFactories([new DiagramFactory(this.diagramService), new SvgObjectFactory(this.diagramService)]);
  }

  public addFactories(factories: IFactory[]) {
    factories.forEach((factory: any) => this.factoryByTypeMap.set(factory.type, factory));
  }

  // type, ...
  public build(type: string, ...params: any[]): any {
    let res = null;
    let factory = this.factoryByTypeMap.get(type);
    if (factory) {
      res = factory.build(params);
      console.log(">> build", res);
    } else {
      console.error("No factory found for type", type, params);
    }
    return res;
  }

  public buildFromSvgData(params: any): any {
    return this.build(SvgConstService.SVG_OBJECT_TYPE, params);
  }
}

export class DiagramFactory extends AFactory {
  constructor(diagramService: IDiagramService) {
    super(diagramService, SvgConstService.DIAGRAM_OBJECT_TYPE);
  }
  public build(params: any): any {
    let diagram = {
      type: "diagram",
    };
    return diagram;
  }
}

export class SvgObjectFactory extends AFactory {
  constructor(diagramService: IDiagramService) {
    super(diagramService, SvgConstService.SVG_OBJECT_TYPE);
  }

  public build(params: any): any {
    let svgObject = null;
    if (params && params.length) {
      svgObject = cloneDeep(params[0]);
    }
    return svgObject;
  }
}
