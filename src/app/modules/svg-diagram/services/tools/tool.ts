import { IToolManager } from "./tool.manager";
import { ToolService } from "./tool.service";
import { ISelectionService } from "../selection/selection.service";
import { ISvgDiagramService } from "../diagram/svg-diagram.service";

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
  public isEnabled = true;
  public isActive = true;
  public draggingData: any;

  public toolManager: IToolManager;
  public toolService: ToolService;
  public svgDiagramService: ISvgDiagramService;
  public selectionService: ISelectionService;
  // public svgObjectService: SvgObjectService;

  constructor(name: string, toolManager: IToolManager) {
    this.name = name;
    this.toolManager = toolManager;
    this.toolService = this.toolManager.toolService;
    this.svgDiagramService = this.toolService.diagramService;
    //    this.diagramController = this.diagramService.diagramController;
    this.selectionService = this.toolService.selectionService;
    this.draggingData = this.toolService.draggingData;
  }

  // public getDiagram() {
  //   return this.diagramController.diagramService.diagram;
  // }

  public abstract canStart(): boolean;

  public startTool(): void {
    this.isActive = true;
    // TODO this.svgDiagramService.transactionService.start("Transaction " + this.name);
    this.doStart();
  }

  public stopTool(): void {
    this.isActive = false;
    this.doStop();
    // TODO this.svgDiagramService.transactionService.commit();
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
