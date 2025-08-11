import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
  NgZone,
  Renderer2,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CBCommand } from "../../services/command/commands/cb.cmd";
import { SvgDiagramEvent } from "../../services/diagram/svg-diagram-event";
import { ISvgDiagramService, SvgDiagramService } from "../../services/diagram/svg-diagram.service";
import { SvgDiagramTooltipComponent } from "../svg-diagram-tooltip/svg-diagram-tooltip.component";
import { SvgDiagramEventController } from "./svg-diagram-event.controller";

export interface ISvgFileModel {
  svgData: string;
  svgObjectList: any[];
}

export interface ISvgModel {
  svgRootGroup: any;
  svgObjectList: any[];
  svgYellowObjectList: any[];
  svgObjectListCompareProject: any[];
}

/**
 * Interface of the svg diagram component
 */
export interface ISvgDiagramComponent {
  svgDiagramService: ISvgDiagramService;

  renderer: Renderer2;

  svgProperties: any;
  config: any;
  previewData: any;

  setSvgData(svgData: string);
  refresh();
  detectChanges();

  getSvgDiagramComponentNativeElement(): any;

  getSvgContainerElement(): any;
  getSvgElement(): any;

  getSvgCompareContainerElement(): any;
  getSvgCompareElement(projectId: string): any;
  setSvgCompareData(svgData: string, project: any);

  getSvgModel(): ISvgModel;

  updateSelectionRect(isVisible: boolean, rect?: any);
}

@Component({
  selector: "app-svg-diagram",
  templateUrl: "./svg-diagram.component.html",
  styleUrls: ["./svg-diagram.component.css"],
})
/**
 * Component that displays a diagram using a svg file
 */
export class SvgDiagramComponent implements OnInit, OnDestroy, ISvgDiagramComponent {
  private svgAddonDef = ""; // refer to "svg-def.component.html", common to all diagrams
  private svgAddonBottomLayer = "<rect id='grid-rect' x='0' y='0' width='100%' height='100%' fill='url(#grid)'></rect>";
  private svgAddonTopLayer = "<path id='sel-rect' class='selection-rect d-none' d='M0 0 Z'></path>";

  @ViewChild("svgContainer", { static: true })
  public svgContainerRef: ElementRef;

  @ViewChild("svgCompareContainer", { static: true })
  public svgCompareContainerRef: ElementRef;

  @ViewChild("svgTooltipComponent", { static: true })
  public svgTooltipComponent: SvgDiagramTooltipComponent;

  public svgModel: ISvgModel = {
    svgRootGroup: null,
    svgObjectList: [],
    svgYellowObjectList: [],
    svgObjectListCompareProject: [],
  };

  public svgProperties = {
    svgWidth: 200000,
    svgHeight: 12000,
    zoom: 1.0,
    zoomK: 1.2,
    viewBox: "0 0 200000 12000",
    width: 200000 * 1,
    height: 12000 * 1,
  };

  public config: any = {
    mode: "diagram",
    width: 200000,
    height: 12000,
    center: false,
    grid: {
      isVisible: true,
      isActive: true,
      rnd: 10,
    },
    display: {
      speedMode: false,
      priorityLevel: 0,
      isTooltipVisible: true,
    },
    selection: {
      isVisible: false,
      path: "M10 10 h200 v100 h-200 v-100 Z",
    },
  };

  public previewData = null;

  public svgDiagramService: ISvgDiagramService;
  public svgDiagramEventController: SvgDiagramEventController = new SvgDiagramEventController(this);

  private pinchActive = false;
  private pinchOrgZoom = 1.0;
  private pinchOrgCoord = { x: 0, y: 0 };

  private panActive = false;
  private panOrgZoom = 1.0;
  private panOrgCoord = { x: 0, y: 0 };
  private panOrgScrollPos = { x: 0, y: 0 };

  public _hasFocus = false;
  public get hasFocus(): boolean {
    return this._hasFocus;
  }
  public set hasFocus(value: boolean) {
    this._hasFocus = value;
    this.svgDiagramService.emitDiagramEvent(
      new SvgDiagramEvent({
        type: value ? SvgDiagramEvent.GainedFocus : SvgDiagramEvent.LostFocus,
        object: this.svgDiagramService.diagram,
      })
    );
  }

  public set tooltipTemplateCB(value: any) {
    if (this.svgTooltipComponent) {
      this.svgTooltipComponent.tooltipTemplateCB = value;
    }
  }

  public set tooltipDataCB(value: any) {
    if (this.svgTooltipComponent) {
      this.svgTooltipComponent.tooltipDataCB = value;
    }
  }

  /**
   * Constructor
   * @param el Element ref
   * @param changeDetectorRef Change detector ref
   * @param ngZone ngZoen
   * @param sanitizer Sanitizer
   * @param renderer Renderer
   */
  constructor(
    public el: ElementRef,
    public changeDetectorRef: ChangeDetectorRef,
    public ngZone: NgZone,
    public sanitizer: DomSanitizer,
    public renderer: Renderer2
  ) {
    this.svgDiagramService = new SvgDiagramService(this);
  }

  /**
   * OnInit function
   */
  public ngOnInit() {
    this.initTestCommands();
  }

  /**
   * OnDestroy function
   */
  public ngOnDestroy() {
    this.svgDiagramEventController.onDestroy();
    this.svgDiagramService.onDestroy();
  }

  /**
   * Component native element getter
   * @returns The Component native element
   */
  public getSvgDiagramComponentNativeElement(): any {
    return this.el.nativeElement;
  }

  /**
   * Svg Container Element getter
   * @returns The Svg Container Element
   */
  public getSvgContainerElement(): any {
    return this.svgContainerRef ? this.svgContainerRef.nativeElement : null;
  }

  /**
   * Svg Element getter
   * @returns The Svg Element
   */
  public getSvgElement(): any {
    const el = this.getSvgContainerElement();
    const svgElement = el ? el.querySelector("svg") : null;
    return svgElement;
  }

  /**
   * Svg Comparison Container Element getter
   * @returns The Svg Container Element for comparison
   */
  public getSvgCompareContainerElement(): any {
    return this.svgCompareContainerRef ? this.svgCompareContainerRef.nativeElement : null;
  }

  /**
   * Get the svg element of a compare project
   * @param projectId
   * @returns
   */
  public getSvgCompareElement(projectId: string): any {
    const el = this.getSvgCompareContainerElement();
    const svgElement = el ? el.querySelector("#svg-" + projectId) : null;
    return svgElement;
  }

  /**
   * Get the svg diagram model (list of svgObjects)
   * @returns The svg diagram model
   */
  public getSvgModel(): ISvgModel {
    return this.svgModel;
  }

  /**
   * Svg Object List getter
   * @returns The list of svg objects
   */
  public getSvgObjectList() {
    return this.svgModel.svgObjectList;
  }

  /**
   * Svg Object List getter for compare projects
   * @returns The list of svg objects
   */
  public getSvgObjectListCompare(project: any) {
    return this.svgModel.svgObjectListCompareProject; // TODO: for now only one compare project
  }

  /**
   * Set the data of the svg file
   * @param svgData The string value of the svg
   */
  public setSvgData(svgData: string) {
    this.initSvgModel(svgData);
    this.svgDiagramService.zoomScrollService.initZoom();
    this.svgDiagramEventController.initEventListeners();
    this.svgDiagramService.commandManager.execute("ScrollToFirstElement");
  }

  /**
   * Set the data of the svg file
   * @param svgData The string value of the svg
   * @param project The project of the svg
   */
  public setSvgCompareData(svgData: string, project: any) {
    this.initSvgCompareModel(svgData, project);
  }

  /**
   * Init test commands
   */
  private initTestCommands() {
    // TODO delete (tests)
    this.svgDiagramService.commandManager.addCommands([
      //   new CBCommand(
      //     this.svgDiagramService,
      //     "ScrollToTestElement",
      //     "ScrollToTestElement",
      //     () => true,
      //     () => {
      //       const el =
      //         this.svgDiagramService.searchService.searchElement({
      //           objectClassName: "tunnel",
      //           id: "1",
      //         }) ||
      //         this.svgDiagramService.searchService.searchElement({
      //           objectClassName: "*",
      //           id: "bec665c9-9593-4424-8a82-4ee3c471b7a6",
      //         });
      //       this.svgDiagramService.zoomScrollService.scrollElementIntoView(el);
      //       return true;
      //     },
      //     () => {}
      //   ),

      new CBCommand(
        this.svgDiagramService,
        "ScrollToFirstElement",
        "ScrollToFirstElement",
        () => true,
        () => {
          const firstElement =
            this.svgModel.svgObjectList && this.svgModel.svgObjectList.length ? this.svgModel.svgObjectList[0] : null;
          this.svgDiagramService.zoomScrollService.scrollElementIntoView(firstElement);
          return true;
        },
        () => {}
      ),
    ]);
  }

  /**
   * Init the model related to a svg file
   * @param svgData The svg data
   */
  private initSvgModel(svgData: string) {
    const svgContainerElement = this.getSvgContainerElement();
    if (svgContainerElement) {
      // Inject svg into html element
      const preparedSvgData = this.prepareSvgData(svgData);
      this.renderer.setProperty(svgContainerElement, "innerHTML", preparedSvgData);
      // Fetch svg objects and init
      this.svgModel.svgRootGroup = this.getSvgRootGroupFromSvgContainerElement(svgContainerElement);
      this.svgModel.svgObjectList = this.getSvgObjectListFromSvgContainerElement(svgContainerElement);
      this.initSvgClassAndAddons(this.svgModel.svgObjectList);
      this.refreshGrid();
    }
  }

  /**
   * Copy a svgObject (used for red and yellow)
   * @param svgObject The svgObject
   * @param parentNode The parent of the svgObject
   * @returns The cloned svg object
   */
  public copySvgObject(svgObject: any, parentNode: any = null): any {
    let svgObjectCopy = null;
    const svgContainerElement = this.getSvgContainerElement();
    if (svgContainerElement && svgObject && svgObject.cloneNode) {
      svgObjectCopy = this.renderer.createElement("g", "http://www.w3.org/2000/svg");
      svgObjectCopy = svgObject.cloneNode(true);
      svgObjectCopy.bo = svgObject.bo;
      if (!parentNode) {
        parentNode = svgObject.parentNode;
      }
      if (parentNode && parentNode.appendChild) {
        parentNode.appendChild(svgObjectCopy);
      }
    }
    return svgObjectCopy;
  }

  /**
   * Copy svg objects from compare diagram to new one
   * @param svgObjectList The list of svg objects
   * @returns The list of cloned svg objects
   */
  public copySvgObjectsToMainSvg(svgObjectList: any[]): any[] {
    const copySvgObjects = [];
    if (svgObjectList && svgObjectList.length && this.svgModel.svgRootGroup) {
      svgObjectList.forEach((svgObject: any) => {
        const svgClone = this.copySvgObject(svgObject, this.svgModel.svgRootGroup);
        if (svgClone) {
          copySvgObjects.push(svgClone);
        }
      });
    }
    return copySvgObjects;
  }

  // /**
  //  * Copy a DOM element
  //  * @param cmp
  //  */
  // private copyDomElement(cmp: ElementRef) {
  //   this.el.nativeElement = cmp;
  //   let element = document.createElement("div");
  //   element = this.el.nativeElement.cloneNode(true);
  //   element.style.position = "absolute";
  //   element.style.top = this.el.nativeElement.offsetTop + "px";
  //   element.style.left = this.el.nativeElement.offsetLeft + "px";
  //   let parent = document.getElementById("parent");
  //   parent.appendChild(element);
  // }

  /**
   * Get svg objects from svg
   * @param svgContainerElement svg container element
   * @returns The list of svg objects
   */
  private getSvgObjectListFromSvgContainerElement(svgContainerElement: any): any[] {
    const svgObjectList = [];
    if (svgContainerElement) {
      // Get svg elements
      const svgElementQueryList = svgContainerElement.querySelectorAll("g[item_id][object_class_name]");
      svgElementQueryList.forEach((element: any) => {
        svgObjectList.push(element);
      });
    }
    return svgObjectList;
  }

  /**
   * Get svg root group with id="root"
   * @param svgContainerElement svg container element
   * @returns The group node
   */
  private getSvgRootGroupFromSvgContainerElement(svgContainerElement: any): any {
    return svgContainerElement ? svgContainerElement.querySelector("g[id='root']") : null;
  }

  /**
   * Prepare svg data (remove title, add some addons)
   * @param svgData The string svg data
   * @returns The string prepared svg data
   */
  private prepareSvgData(svgData: string): string {
    // Cleaning and insertion of right viewer objects (grid, selection rectangle)
    svgData = this.removeTag(svgData, "title");
    svgData = this.removeTag(svgData, "desc");
    svgData = svgData.replace("</defs>", this.svgAddonDef + "</defs>" + this.svgAddonBottomLayer);
    svgData = svgData.replace("</svg>", this.svgAddonTopLayer + "</svg>");
    return svgData;
  }

  /**
   * Init the model related to a svg file
   * @param svgData The svg data
   * @param project The project of the svg
   */
  private initSvgCompareModel(svgData: string, project: any) {
    const svgCompareContainerElement = this.getSvgCompareContainerElement();
    if (svgCompareContainerElement && project && project.id) {
      // // old code with 2 projects
      // svgData = svgData.replace("<svg", "<svg id='svg-" + project.id + "' ");
      // // TODO: more than 1 compare project: add instead of replacing html content
      // this.renderer.setProperty(svgCompareContainerElement, "innerHTML", svgData);

      // // Fetch svg objects and init
      // this.svgModel.svgObjectListCompareProject =
      //   this.getSvgObjectListFromSvgContainerElement(svgCompareContainerElement);
      // this.initSvgClassAndAddons(this.svgModel.svgObjectListCompareProject);

      // TODO multi versions
      // If no exists yet, add it to svg compare element
      const svgCompareElement = this.getSvgCompareElement(project.id);
      if (!svgCompareElement) {
        svgData = svgData.replace("<svg", "<svg id='svg-" + project.id + "' ");
        const innerHTML = svgCompareContainerElement.innerHTML;
        this.renderer.setProperty(svgCompareContainerElement, "innerHTML", innerHTML + svgData);

        // Fetch svg objects and init
        this.svgModel.svgObjectListCompareProject =
          this.getSvgObjectListFromSvgContainerElement(svgCompareContainerElement);
        this.initSvgClassAndAddons(this.svgModel.svgObjectListCompareProject);
      }
    }
  }

  /**
   * Remove tag from html
   * @param html Html string value
   * @param tagName The tag to be remove
   * @returns The html
   */
  private removeTag(html: string, tagName: string): string {
    const htmlUpper = html.toUpperCase();
    const tagUpper = tagName.toUpperCase();
    const ps = htmlUpper.indexOf("<" + tagUpper + ">");
    const pe = htmlUpper.indexOf("</" + tagUpper + ">");
    if (ps > -1 && pe > ps) {
      html = html.substring(0, ps) + html.substring(pe + 8);
    }
    return html;
  }

  /**
   * Set a specific class to svgObjects
   */
  private initSvgClassAndAddons(svgObjectList: any[]) {
    svgObjectList.forEach((svgElement: any) => {
      this.renderer.addClass(svgElement, "svg-item");
      svgElement.isRedVisible = false;
      svgElement.isYellowVisible = false;
      svgElement.isRed = false;
      svgElement.isYellow = false;
      svgElement.projectIndex = 0;
    });
  }

  /**
   * Refresh the diagram
   */
  public refresh() {}

  /**
   * Detect changes
   */
  public detectChanges() {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Do focus
   */
  public doFocus() {
    const svgElement = this.getSvgElement();
    if (svgElement) {
      svgElement.focus();
    }
  }

  /**
   * KeyDownEvent listener
   * @param event The event
   */
  @HostListener("window:keydown", ["$event"])
  public onKeyDownEvent(event: KeyboardEvent) {
    this.svgDiagramEventController.onKeyDown(event);
  }

  /**
   * Update the selection rectangle
   * @param isVisible Is visible bool value
   * @param rect The rect coords
   */
  public updateSelectionRect(isVisible: boolean, rect = null) {
    const svgElement = this.getSvgElement();
    const selRectElement = svgElement.querySelector("#sel-rect");
    if (selRectElement) {
      this.config.selection.isVisible = isVisible;
      if (isVisible) {
        this.renderer.removeClass(selRectElement, "d-none");
      } else {
        this.renderer.addClass(selRectElement, "d-none");
      }
      if (rect) {
        this.config.selection.path =
          "M" +
          String(rect.x) +
          " " +
          String(rect.y) +
          " h" +
          String(rect.width) +
          " v" +
          String(rect.height) +
          " h" +
          String(-rect.width) +
          " v" +
          String(-rect.height) +
          " ";
        selRectElement.setAttribute("d", this.config.selection.path);
      }
    }
  }

  /**
   * Show the tooltip related to an svgObject
   * @param event The event
   * @param svgObject The related svgObject
   */
  public showTooltip(event: any, svgObject: any) {
    this.svgTooltipComponent.showTooltip(event, svgObject);
  }

  /**
   * Hide the tooltip related to an svgObject
   * @param event The event
   * @param svgObject The related svgObject
   */
  public hideTooltip(event: any, svgObject: any) {
    this.svgTooltipComponent.hideTooltip(event, svgObject);
  }

  /**
   * is grid visible getter
   * @returns Boolean value
   */
  public isGridVisible() {
    return this.config.grid.isVisible;
  }

  /**
   * is grid visible setter
   * @param value Boolean value
   */
  public setIsGridVisible(value: boolean) {
    this.config.grid.isVisible = value;
    this.refreshGrid();
  }

  /**
   * Refresh the grid according to its visibility
   */
  private refreshGrid() {
    const svgElement = this.getSvgElement();
    const gridElement = svgElement ? svgElement.querySelector("#grid-rect") : null;
    if (gridElement) {
      if (this.config.grid.isVisible) {
        this.renderer.removeClass(gridElement, "d-none");
      } else {
        this.renderer.addClass(gridElement, "d-none");
      }
    }
  }

  // public onHeaderDblClick(event: Event) {
  //   console.log("onHeaderDblClick");
  //   alert("onHeaderDblClick");
  // }

  // public onSwipeLeft(event: Event) {
  //   console.log("onSwipeLeft");
  //   alert("onSwipeLeft");
  // }

  // public onSwipeRight(event: Event) {
  //   console.log("onSwipeRight");
  //   alert("onSwipeRight");
  // }

  // public onPinch(event: Event) {
  //   console.log("onPinch");
  //   alert("onPinch");
  // }

  // TODO DRA DEV
  public onHammerEvent(e: any) {
    const eventMsg =
      e && e.type
        ? e.type +
          " gesture detected.  <br>" +
          (e.srcEvent && e.srcEvent.clientX ? e.srcEvent.clientX + "," + e.srcEvent.clientY : "")
        : "";
    console.log(eventMsg);
    // alert(eventMsg);
  }

  public onPinchStart(e: any) {
    this.pinchActive = true;
    this.pinchOrgZoom = this.svgDiagramService.zoomScrollService.getZoom();
    // if (e && e.type && e.srcEvent && e.srcEvent.clientX) {
    //   this.pinchOrgCoord = { x: e.srcEvent.clientX, y: e.srcEvent.clientY };
    // }
    console.log("onPinchStart", this.pinchOrgZoom);
  }

  public onPinchEnd(e: any) {
    this.pinchActive = false;
    console.log("onPinchEnd");
  }

  public onPinch(e: any) {
    if (this.pinchActive) {
      if (e && e.type && e.srcEvent && e.srcEvent.clientX) {
        console.log("pinch", e.scale);
        this.svgDiagramService.zoomScrollService.setZoom(this.pinchOrgZoom * e.scale);
        // this.svgDiagramService.zoomScrollService.scroll({
        //   x: -(e.srcEvent.clientX - this.pinchOrgCoord.x),
        //   y: -(e.srcEvent.clientY - this.pinchOrgCoord.y),
        // });
      }
    }
  }

  public onPanStart(e: any) {
    this.panActive = true;
    if (e && e.type && e.srcEvent && e.srcEvent.clientX) {
      this.panOrgCoord = { x: e.srcEvent.clientX, y: e.srcEvent.clientY };
      this.panOrgScrollPos = this.svgDiagramService.zoomScrollService.getScrollPos();
    }
    console.log("onPanStart", this.panOrgCoord);
  }

  public onPanEnd(e: any) {
    this.panActive = false;
    console.log("onPanEnd");
  }

  public onPan(e: any) {
    if (this.panActive) {
      if (e && e.type && e.srcEvent && e.srcEvent.clientX) {
        console.log("pan");
        const zoom = 1.0; // this.svgDiagramService.zoomScrollService.getZoom();
        this.svgDiagramService.zoomScrollService.scroll({
          x: this.panOrgScrollPos.x - (e.srcEvent.clientX - this.panOrgCoord.x) * zoom,
          y: this.panOrgScrollPos.y - (e.srcEvent.clientY - this.panOrgCoord.y) * zoom,
        });
      }
    }
  }
}
