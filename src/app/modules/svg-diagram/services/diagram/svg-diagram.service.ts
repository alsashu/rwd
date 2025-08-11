import { IZoomScrollService, ZoomScrollService } from "../zoom-scroll/zoom-scroll.service";
import { ISvgDiagramComponent, ISvgModel } from "../../components/svg-diagram/svg-diagram.component";
import { InputEventService } from "../events/input-event.service";
import { IDiagramEvent } from "./svg-diagram-event";
import { EventEmitter, Renderer2 } from "@angular/core";
import { ISvgDiagram } from "../../model/diagram/isvg-diagram";
import { CommandService, ICommandService } from "../command/command.service";
import { CommandManager, ICommandManager } from "../command/command.manager";
import { ToolManager } from "../tools/tool.manager";
import { ISelectionService, SelectionService } from "../selection/selection.service";
import { ISvgObjectService, SvgObjectService } from "../svg-object/svg-object.service";
import { ISearchService, SearchService } from "../search/search.service";
import { ILayerService, LayerService } from "../layer/layer-service";

/**
 * Interface fo the Svg diagram service
 */
export interface ISvgDiagramService {
  instanceId: number;

  svgDiagramComponent: ISvgDiagramComponent;

  diagram: ISvgDiagram;
  inputEventService: InputEventService;
  commandService: ICommandService;
  commandManager: ICommandManager;
  zoomScrollService: IZoomScrollService;
  selectionService: ISelectionService;
  svgObjectService: ISvgObjectService;
  searchService: ISearchService;
  layerService: ILayerService;
  toolManager: ToolManager;

  diagramEventEmitter: EventEmitter<IDiagramEvent>;
  onDestroy();

  getSvgModel(): ISvgModel;
  getSvgObjectList(): any[];
  getDisplayedSvgObjectList(): any[];
  getSelectableSvgObjects(): any[];
  getRenderer(): Renderer2;

  emitDiagramEvent(diagramEvent: IDiagramEvent);
}

/**
 * Svg diagram service
 */
export class SvgDiagramService implements ISvgDiagramService {
  private static instanceIdCptr = -1;
  public instanceId = -1;

  public diagram: ISvgDiagram;

  public diagramEventEmitter = new EventEmitter<IDiagramEvent>();

  public inputEventService: InputEventService = new InputEventService(this);
  public commandService: ICommandService = new CommandService(this);
  public commandManager: ICommandManager = new CommandManager(this);
  public zoomScrollService: IZoomScrollService = new ZoomScrollService(this);
  public selectionService: ISelectionService = new SelectionService(this);
  public svgObjectService: ISvgObjectService = new SvgObjectService(this);
  public searchService: ISearchService = new SearchService(this);
  public layerService: ILayerService = new LayerService(this);

  public toolManager: ToolManager = new ToolManager(this);

  /**
   * Constructor
   * @param svgDiagramComponent The svg Diagram Component
   */
  constructor(public svgDiagramComponent: ISvgDiagramComponent = null) {
    SvgDiagramService.instanceIdCptr++;
    this.instanceId = SvgDiagramService.instanceIdCptr;
    this.newDiagram();
  }

  /**
   * On destroy event
   */
  public onDestroy() {
    this.commandManager.onDestroy();
    this.toolManager.onDestroy();
  }

  /**
   * New diagram
   */
  public newDiagram() {
    this.setDiagram({});
  }

  /**
   * Set the diagram
   * @param diagram The diagram
   * @returns The diagram
   */
  public setDiagram(diagram: ISvgDiagram): any {
    this.diagram = diagram;
    return diagram;
  }

  /**
   * Get the svg model
   * @returns The svg model
   */
  public getSvgModel(): ISvgModel {
    return this.svgDiagramComponent.getSvgModel();
  }

  /**
   * Get the selectable svg objects
   * @returns List of selectable svg objects
   */
  public getSelectableSvgObjects(): any {
    return this.layerService.filterVisibleSvgObjects(this.getDisplayedSvgObjectList());
  }

  /**
   * Get the svg objects of the current diagram
   * @returns The list of svg objects
   */
  public getSvgObjectList() {
    return this.getSvgModel().svgObjectList;
  }

  /**
   * Get displayed svg object list including yellow elements when comparing projects
   * @returns The list of svg objects
   */
  public getDisplayedSvgObjectList() {
    return this.getSvgObjectList().concat(this.getSvgModel().svgYellowObjectList);
  }

  /**
   * Emit a diagram event
   * @param diagramEvent The diagram event
   */
  public emitDiagramEvent(diagramEvent: IDiagramEvent) {
    // if (diagramEvent && diagramEvent.type !== "ViewportBoundsChanged") {
    //   console.log(">> diagram event", diagramEvent, this.instanceId, this);
    // }
    this.diagramEventEmitter.emit(diagramEvent);
  }

  /**
   * Get the svg diagram component renderer
   * @returns The renderer
   */
  public getRenderer(): Renderer2 {
    return this.svgDiagramComponent.renderer;
  }
}
