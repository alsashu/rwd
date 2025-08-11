import { IToolManager } from "./tool.manager";
import { ToolService } from "./tool.service";
import { IDiagramController } from "../../components/diagram/diagram.controller";
import { SvgObjectService } from "../svg-object/svg-object.service";
import { SelectionService } from "../selection/selection.service";
import { IDiagramService } from "../diagram/diagram.service";

export interface ITool {
  name: string;
  isEnabled: boolean;
  isActive: boolean;
  // diagramController: IDiagramController;
  toolManager: IToolManager;
  toolService: ToolService;

  // getDiagram(): any;

  canStart(): boolean;
  startTool(): void;
  stopTool(): void;

  doStart(): void;
  doStop(): void;

  doMouseDown(): void;
  doMouseMove(): void;
  doMouseUp(): void;
  doMouseWheel(): void;
  doKeyDown(): void;
}

export abstract class Tool implements ITool {
  public name: string;
  public isEnabled: boolean = true;
  public isActive: boolean = true;
  public draggingData: any;

  public toolManager: IToolManager;
  // public diagramController: IDiagramController;
  public toolService: ToolService;
  public diagramService: IDiagramService;
  public svgObjectService: SvgObjectService;
  public selectionService: SelectionService;

  constructor(name: string, toolManager: IToolManager) {
    this.name = name;
    this.toolManager = toolManager;
    this.toolService = this.toolManager.toolService;
    this.diagramService = this.toolService.diagramService;
    //    this.diagramController = this.diagramService.diagramController;
    this.svgObjectService = this.toolService.svgObjectService;
    this.selectionService = this.toolService.selectionService;
    this.draggingData = this.toolService.draggingData;
  }

  // public getDiagram() {
  //   return this.diagramController.diagramService.diagram;
  // }

  public abstract canStart(): boolean;

  public startTool(): void {
    this.isActive = true;
    this.diagramService.transactionService.start("Transaction " + this.name);
    this.doStart();
  }

  public stopTool(): void {
    this.isActive = false;
    this.doStop();
    this.diagramService.transactionService.commit();
    this.toolManager.stopTool(this);
  }

  public doStart(): void {}
  public doStop(): void {}
  public doMouseDown(): void {}
  public doMouseMove(): void {}
  public doMouseUp(): void {}
  public doMouseWheel(): void {}
  public doKeyDown(): void {}
}
