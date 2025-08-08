import { SvgObjectService } from "../svg-object/svg-object.service";
import { TemplateService } from "../template/template.service";
import { FactoryService } from "../factory/factory.service";
import { SelectionService } from "../selection/selection.service";
import { NotificationService } from "../notification/notification.service";
import { TransactionService } from "../transaction/transaction.service";
import { CommandService } from "../command/command.service";
import { CommandManager } from "../command/command.manager";
import { ClipboardService } from "../clipboard/clipboard-service";
import { IDiagramController } from "../../components/diagram/diagram.controller";
import { ZoomScrollService } from "../zoom-scroll/zoom-scroll.service";
import { ToolManager } from "../tools/tool.manager";
import { InputEventService } from "../events/input-event.service";
import { QueryService } from "../transaction/query.service";
import { LayerService, ILayer } from "../layer/layer-service";
import { IDiagramEvent } from "./diagram-event";
import { EventEmitter } from "@angular/core";
import { DiagramLayout } from "../layout/diagram/diagram.layout";
import { LayoutService } from "../layout/layout-service";
import { IChangeEvent } from "../transaction/change-event";
import { IDiagramLayout } from "../layout/diagram/idiagram.layout";
import { SearchService } from "../search/search.service";
import { IDiagram } from "../../model/diagram/idiagram";

export interface IDiagramService {
  diagram: IDiagram;

  inputEventService: InputEventService;
  svgObjectService: SvgObjectService;
  templateService: TemplateService;
  factoryService: FactoryService;
  selectionService: SelectionService;
  notificationService: NotificationService;
  transactionService: TransactionService;
  queryService: QueryService;
  commandService: CommandService;
  commandManager: CommandManager;
  clipboardService: ClipboardService;
  zoomScrollService: ZoomScrollService;
  layerService: LayerService;
  layoutService: LayoutService;
  searchService: SearchService;

  diagramController: IDiagramController;

  diagramLayout: IDiagramLayout;
  changeEventEmitter: EventEmitter<IChangeEvent>;
  diagramEventEmitter: EventEmitter<IDiagramEvent>;

  initSvgObjectCB: any;
  cloneSvgObjectCB: any;
  getBoByIdCB: any;
  getScriptContextCB: any;

  getRootSvgObjectCB: any;
  getSvgObjectCB: any;
  getSvgObjectChildrenCB: any;
  getDecorationSvgObjectsCB: any;

  refresh();
  refreshDiagram();

  initSize();

  getRootSvgObject(): any;
  getRootSvgObjects(): any[];
  getLibrarySvgObjects(): any[];
  getSelectableSvgObjects(): any[];
  getSvgObjectChildren(svgObject: any): any[];

  getOrgCoord(): { x: number; y: number };
  getLayers(): ILayer[];

  commit(cb: any, description?: string);
  modify(instance: any, property: any, value: any);
  addSvgObject(svgObject: any, parentSvgObject?: any, diagram?: any): any;
  removeSvgObject(svgObject: any, diagram?: any): any;
  addSvgObjects(svgObjects: any[], parentSvgObject?: any, diagram?: any): any[];
  removeSvgObjects(svgObjects: any[], diagram?: any): any[];

  emitChangeEvent(changeEvent: IChangeEvent);
  emitDiagramEvent(diagramEvent: IDiagramEvent);
}

export class DiagramService implements IDiagramService {
  public diagram: IDiagram;

  public diagramLayout: IDiagramLayout; // = new SigDiagramLayout(this);

  public changeEventEmitter = new EventEmitter<IChangeEvent>();
  public diagramEventEmitter = new EventEmitter<IDiagramEvent>();

  public inputEventService: InputEventService = new InputEventService(this);
  public svgObjectService: SvgObjectService = new SvgObjectService(this);
  public templateService: TemplateService = new TemplateService(this);
  public factoryService: FactoryService = new FactoryService(this);
  public selectionService: SelectionService = new SelectionService(this);
  public notificationService: NotificationService = new NotificationService(this);
  public transactionService: TransactionService = new TransactionService(this);
  public queryService: QueryService = new QueryService(this.transactionService);
  public commandService: CommandService = new CommandService(this);
  public commandManager: CommandManager = new CommandManager(this);
  public clipboardService: ClipboardService = new ClipboardService(this);
  public zoomScrollService: ZoomScrollService = new ZoomScrollService(this);
  public layerService: LayerService = new LayerService(this);
  public layoutService: LayoutService = new LayoutService(this);
  public searchService: SearchService = new SearchService(this);

  public toolManager: ToolManager = new ToolManager(this);

  public initSvgObjectCB: any = (svgObject: any) => {
    return svgObject;
  };
  public cloneSvgObjectCB: any = (svgObject: any) => {
    return svgObject;
  };
  public getBoByIdCB: any = (id: string) => {
    return null;
  };
  public getScriptContextCB: any = () => {
    return null;
  };
  public getRootSvgObjectCB: any = (diagram: IDiagram) => {
    const res = diagram && diagram.svgObject ? diagram.svgObject : { type: "root", svgObjects: [] };
    return res;
  };
  public getSvgObjectChildrenCB: any = (svgObject: any) => {
    const res = svgObject && svgObject.svgObjects ? svgObject.svgObjects : [];
    return res;
  };
  public getSvgObjectCB: any = (svgObject: any) => {
    return svgObject;
  };

  public getDecorationSvgObjectsCB: any = (svgObject: any) => {
    return [];
  };

  constructor(public diagramController: IDiagramController = null) {
    this.newDiagram();
  }

  public onDestroy() {
    this.commandManager.onDestroy();
    this.toolManager.onDestroy();
  }

  // Init
  public newDiagram() {
    this.setDiagram({
      svgObject: { type: "root", svgObjects: [] },
    });
  }

  public setDiagram(diagram: IDiagram): any {
    this.diagram = diagram;
    this.initDiagram();
    this.initSize();
    return diagram;
  }

  private initDiagram() {
    if (this.diagram && !this.diagram.orgCoord) {
      this.diagram.orgCoord = { x: 0, y: 0 };
    }
    this.svgObjectService.initService.initDiagramSvgObjects();
    this.layerService.initLayers();
    this.refreshDiagram();
  }

  public initSize() {
    this.zoomScrollService.initSize();
  }

  // SvgObjects
  public getRootSvgObject(): any {
    const res = this.getRootSvgObjectCB(this.diagram);
    return res;
  }

  public getRootSvgObjects(): any {
    const res = this.getSvgObjectChildren(this.getRootSvgObject());
    return res;
  }

  public getLibrarySvgObjects(): any {
    const res = this.svgObjectService.findLibrarySvgObjects();
    return res;
  }

  public getSelectableSvgObjects(): any {
    const res = this.svgObjectService.findSelectableSvgObjects();
    return res;
  }

  public getSvgObjectChildren(svgObject: any): any[] {
    const res = this.getSvgObjectChildrenCB(svgObject);
    return res;
  }

  public getSvgObject(svgObject: any): any {
    const res = this.getSvgObjectCB(svgObject);
    return res;
  }

  // Layers
  public getLayers(): ILayer[] {
    return this.layerService.layers;
  }

  public getOrgCoord(): { x: number; y: number } {
    return this.diagram && this.diagram.orgCoord ? this.diagram.orgCoord : { x: 0, y: 0 };
  }

  // Refresh
  public refresh() {
    if (this.diagramController) {
      this.diagramController.refresh();
    }
  }

  public refreshDiagram() {
    this.svgObjectService.refreshService.refreshAllSvgObjects();
  }

  public executeDiagramLayout() {
    this.layoutService.executeDiagramLayout();
  }

  // Clean
  public cleanDiagram(diagram: IDiagram = null) {
    diagram = diagram || this.diagram;
    this.svgObjectService.initService.cleanSvgObjectRec(this.getRootSvgObject());
    return diagram;
  }

  // Events
  public emitDiagramEvent(diagramEvent: IDiagramEvent) {
    console.log(">> diagram event", diagramEvent);
    this.diagramEventEmitter.emit(diagramEvent);
  }

  public emitChangeEvent(changeEvent: IChangeEvent) {
    console.log(">> change event", changeEvent);
    this.changeEventEmitter.emit(changeEvent);
  }

  // CRUD / queries
  public commit(cb: any, description: string = null) {
    this.queryService.commit(cb, description);
  }

  public modify(object: any, propertyName: string, value: any) {
    this.queryService.modify(object, propertyName, value);
  }

  public addSvgObject(svgObject: any, parentSvgObject: any = null, diagram: IDiagram = null): any {
    if (svgObject) {
      diagram = diagram || this.diagram;
      parentSvgObject = parentSvgObject || this.getRootSvgObject();
      if (!parentSvgObject.svgObjects) {
        parentSvgObject.svgObjects = [];
      }
      this.svgObjectService.initService.initSvgObjectRec(svgObject, parentSvgObject, diagram);
      this.queryService.add(parentSvgObject, "svgObjects", svgObject);
    }
    return svgObject;
  }

  public removeSvgObject(svgObject: any, diagram: IDiagram = null): any {
    if (svgObject) {
      diagram = diagram || this.diagram;
      const parentSvgObject = svgObject.parent ? svgObject.parent : this.getRootSvgObject();
      if (parentSvgObject && parentSvgObject.svgObjects && parentSvgObject.svgObjects.forEach) {
        this.queryService.remove(parentSvgObject, "svgObjects", svgObject);
      }
    }
    return svgObject;
  }

  public addSvgObjects(svgObjects: any[], parentSvgObject: any = null, diagram: IDiagram = null): any[] {
    if (svgObjects && svgObjects.forEach) {
      svgObjects.forEach((svgObject) => this.addSvgObject(svgObject, parentSvgObject, diagram));
    }
    return svgObjects;
  }

  public removeSvgObjects(svgObjects: any[], diagram: IDiagram = null): any[] {
    if (svgObjects && svgObjects.forEach) {
      svgObjects.forEach((svgObject) => this.removeSvgObject(svgObject, diagram));
    }
    return svgObjects;
  }
}
