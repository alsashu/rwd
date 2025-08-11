import { ISvgDiagramComponent } from "../../components/svg-diagram/svg-diagram.component";
import { ISvgDiagramService } from "../diagram/svg-diagram.service";

export interface IZoomScrollService {
  initZoom();

  getZoom(): number;
  zoomPlus();
  zoomMinus();
  resetZoom();

  setZoom(zoom: number, keepCenter?: boolean, refresh?: boolean);

  scrollElementIntoView(element: any);
  centerOnSelection();

  getMousePositionFromClient(event: any): { x: number; y: number };
  getMousePositionFromLayer(event: any): { x: number; y: number };
  getScrollPos(): any;
  scroll(coord: { x: number; y: number });

  screenToClient(coord: { x: number; y: number }): { x: number; y: number };
  getClientCoordFromScreenCoord(coord: { x: number; y: number }): { x: number; y: number };
}

export class ZoomScrollService implements IZoomScrollService {
  constructor(public svgDiagramService: ISvgDiagramService) {}

  public getSvgDiagramComponentNativeElement(): any {
    return this.getSvgDiagramComponent() ? this.getSvgDiagramComponent().getSvgDiagramComponentNativeElement() : null;
  }

  public getSvgDiagramComponent(): ISvgDiagramComponent {
    return this.svgDiagramService.svgDiagramComponent;
  }

  public getSvgProperties() {
    return this.getSvgDiagramComponent() ? this.getSvgDiagramComponent().svgProperties : null;
  }

  public getConfig(): any {
    return this.getSvgDiagramComponent() ? this.getSvgDiagramComponent().config : null;
  }

  public getPreviewData(): any {
    return this.getSvgDiagramComponent() ? this.getSvgDiagramComponent().previewData : null;
  }

  public initZoom() {
    this.setZoom(1.0, false);
  }

  public refresh() {
    // const diagramController = this.getSvgDiagramComponent();
    // if (diagramController) {
    //   diagramController.refresh();
    // }
  }

  // Zoom

  public getZoom(): number {
    return this.getSvgProperties().zoom;
  }

  public setZoom(zoom: number, keepCenter: boolean = true, refresh: boolean = true) {
    zoom = Math.max(Math.min(zoom, 20), 0.01);
    const centerCoord = this.getCenterCoord();
    const orgCoord = { x: 0, y: 0 };
    const svgProperties = this.getSvgProperties();
    svgProperties.zoom = zoom;
    svgProperties.width = svgProperties.svgWidth * svgProperties.zoom;
    svgProperties.height = svgProperties.svgHeight * svgProperties.zoom;
    svgProperties.viewBox =
      orgCoord.x + " " + orgCoord.y + " " + svgProperties.svgWidth + " " + svgProperties.svgHeight;
    this.refreshSvgViewZone();
    if (keepCenter) {
      this.scrollCenter({ x: centerCoord.x * zoom, y: centerCoord.y * zoom });
    }
    // console.log("setZoom", svgProperties, centerCoord);
  }

  public refreshSvgViewZone() {
    const svgElement = this.getSvgDiagramComponent().getSvgElement();
    if (svgElement) {
      const svgProperties = this.getSvgProperties();
      // const viewBox = svgProperties.viewBox;
      // const transform = "scale(" + svgProperties.zoom + ")";
      try {
        svgElement.setAttribute("width", svgProperties.width);
        svgElement.setAttribute("height", svgProperties.height);
        // svgEl.setAttribute("viewBox", svgProperties.viewBox);
        // this.getSvgDiagramComponent().renderer.setStyle(svgEl, "transform", transform);
      } catch (e) {
        console.error(e);
      }
      // console.log("zoom", svgProperties.zoom, svgElement, this.svgDiagramService.instanceId);
    }
  }

  public zoomPlus() {
    const svgProperties = this.getSvgProperties();
    this.setZoom(svgProperties.zoom * svgProperties.zoomK);
  }

  public zoomMinus() {
    const svgProperties = this.getSvgProperties();
    this.setZoom(svgProperties.zoom / svgProperties.zoomK);
  }

  public resetZoom() {
    this.setZoom(1);
  }

  public getScrollPos(): any {
    const dcne = this.getSvgDiagramComponentNativeElement();
    return { x: dcne.scrollLeft, y: dcne.scrollTop };
  }

  public scroll(coord: { x: number; y: number }) {
    const dcne = this.getSvgDiagramComponentNativeElement();
    dcne.scroll(coord.x, coord.y);
  }

  public getClientWidth() {
    return this.getSvgDiagramComponentNativeElement().clientWidth;
  }

  public screenToClient(coord: { x: number; y: number }): { x: number; y: number } {
    let res = { x: coord.x, y: coord.y };
    const svgProperties = this.getSvgProperties();
    if (svgProperties) {
      res = { x: coord.x / svgProperties.zoom, y: coord.y / svgProperties.zoom };
    }
    return res;
  }

  public getMousePositionForDrop(event: any): { x: number; y: number } {
    const dcne = this.getSvgDiagramComponentNativeElement();
    const sp = this.getScrollPos();
    const coord = {
      x: event.clientX - dcne.offsetLeft + sp.x,
      y: event.clientY - dcne.offsetTop + sp.y,
    };
    return coord;
  }

  public getClientCoordFromScreenCoord(coord: { x: number; y: number }): { x: number; y: number } {
    const dcne = this.getSvgDiagramComponentNativeElement();
    const sp = this.getScrollPos();
    const clientCoord = {
      x: coord.x - dcne.offsetLeft + sp.x,
      y: coord.y - dcne.offsetTop + sp.y,
    };
    return this.screenToClient(clientCoord);
  }

  public getMousePositionFromLayer(event: any): { x: number; y: number } {
    return this.screenToClient(this.getMousePositionForDrop(event));
  }

  public getMousePositionFromClient(event: any): { x: number; y: number } {
    return this.screenToClient({ x: event.clientX, y: event.clientY });
  }

  public getCenterCoord(): { x: number; y: number } {
    const res = { x: 0, y: 0 };
    const previewData = this.getPreviewData();
    const pd = previewData ? previewData : this.calcPreviewData();
    if (pd) {
      const svgProperties = this.getSvgProperties();
      const zoom = svgProperties.zoom;
      const scrollPos = this.getScrollPos();
      const orgCoord = { x: 0, y: 0 };
      res.x = (scrollPos.x + pd.visibleWidth / 2) / zoom + orgCoord.x;
      res.y = (scrollPos.y + pd.visibleHeight / 2) / zoom + orgCoord.y;
    }
    return res;
  }

  public scrollCenter(coord: { x: number; y: number }, topLeft = false) {
    const previewData = this.getPreviewData();
    const pd = previewData ? previewData : this.calcPreviewData();
    if (pd) {
      const orgCoord = { x: 0, y: 0 };
      const zoom = this.getZoom();
      const scrollPos = {
        x: coord.x - orgCoord.x * zoom,
        y: coord.y - orgCoord.y * zoom,
      };
      if (!topLeft) {
        scrollPos.x -= pd.visibleWidth / 2;
        scrollPos.y -= pd.visibleHeight / 2;
      } else {
        scrollPos.x -= 50;
        scrollPos.y -= 50;
      }
      this.scroll(scrollPos);
    }
  }

  public calcPreviewData(): any {
    let previewData = this.getPreviewData();
    const dcne = this.getSvgDiagramComponentNativeElement();
    // dcne.clientWidth = 0 when view is hidden
    if (dcne && dcne.clientWidth) {
      previewData = {
        visibleLeft: dcne.scrollLeft,
        visibleTop: dcne.scrollTop,
        visibleWidth: dcne.clientWidth,
        visibleHeight: dcne.clientHeight,
        canvasWidth: dcne.scrollWidth,
        canvasHeight: dcne.scrollHeight,
      };
    }
    return previewData;
  }

  public centerOnSelection() {
    this.scrollElementIntoView(this.svgDiagramService.selectionService.getFirstSelectedSvgObject());
  }

  public searchAndScrollToElement(elementData: { objectClassName: string; id: string }) {
    this.scrollElementIntoView(this.svgDiagramService.searchService.searchElement(elementData));
  }

  public scrollElementIntoView(element: any) {
    try {
      if (element) {
        //console.log("scrollElementIntoView", window, window["chrome"], window["firefox"], element);

        if (window["chrome"]) {
          // This is just to deal with a chrome bug
          element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

          // element.scrollIntoView({ behavior: "smooth" });
          // setTimeout(() => {
          //   element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          //   setTimeout(() => {
          //     // if (toHighlight) { Highlighter.HighlightElement(theJQElement); }
          //   }, 500);
          // }, 500);
        } else {
          // Firfox won't navigate to a group element.
          // element = element.children().first()[0]; // TODO test android
          element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

          // setTimeout(() => {
          //   // if (toHighlight) { Highlighter.HighlightElement(theJQElement); }
          // }, 500);
        }
        // const centerCoord = this.getCenterCoord();
        // console.log("scrollToElement", element, centerCoord);
      }
    } catch (e) {
      console.error(e);
    }
  }

  public roundCoord(coord: { x: number; y: number }, disableRound = false): { x: number; y: number } {
    const config = this.getConfig();
    if (config && config.grid.isActive && !disableRound) {
      const rnd = config.grid.rnd;
      coord.x = Math.round(coord.x / rnd) * rnd;
      coord.y = Math.round(coord.y / rnd) * rnd;
    }
    return coord;
  }

  public roundCoordValue(value: number, disableRound: boolean = false): number {
    const config = this.getConfig();
    if (config && config.grid.isActive && !disableRound) {
      const rnd = config.grid.rnd;
      value = Math.round(value / rnd) * rnd;
    }
    return value;
  }

  // public autoScroll() {
  // const minMaxCoords = {
  //   max: {
  //     x: -1000000,
  //     y: -1000000,
  //   },
  //   min: {
  //     x: 1000000,
  //     y: 1000000,
  //   },
  // };
  // let minXObject: any = null;
  // let minYObject: any = null;
  // this.svgDiagramService.svgObjectService.forEachCB((svgObjectChild: any) => {
  //   if (
  //     svgObjectChild.x !== undefined &&
  //     svgObjectChild.y !== undefined &&
  //     svgObjectChild.type === "library-object"
  //   ) {
  //     const svgPos = {
  //       x: parseInt(svgObjectChild.x, 10),
  //       y: parseInt(svgObjectChild.y, 10),
  //     };
  //     minMaxCoords.max.x = Math.max(minMaxCoords.max.x, svgPos.x);
  //     minMaxCoords.max.y = Math.max(minMaxCoords.max.y, svgPos.y);
  //     minMaxCoords.min.x = Math.min(minMaxCoords.min.x, svgPos.x);
  //     minMaxCoords.min.y = Math.min(minMaxCoords.min.y, svgPos.y);
  //     if (minMaxCoords.min.x === svgPos.x) {
  //       if (!minXObject || minXObject.x > svgPos.x) {
  //         minXObject = svgObjectChild;
  //       }
  //     }
  //     if (minMaxCoords.min.y === svgPos.y) {
  //       if (!minYObject || minYObject.y > svgPos.y) {
  //         minYObject = svgObjectChild;
  //       }
  //     }
  //   }
  // }, null);
  // // console.log("autozoom", minMaxCoords);
  // // if (minMaxCoords.min.x !== 1000000 && minMaxCoords.min.y !== 1000000) {
  // //   this.centerOnSvgObject(minMaxCoords.min, true);
  // // }
  // // if (minXObject) {
  // //   this.centerOnSvgObject(minXObject, true);
  // // }
  // if (minYObject) {
  //   this.centerOnSvgObject(minYObject, true);
  // }
  // }
}
