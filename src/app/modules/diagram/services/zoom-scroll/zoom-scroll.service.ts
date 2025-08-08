import { IDiagramService } from "../diagram/diagram.service";
import { IDiagramController } from "../../components/diagram/diagram.controller";

export class ZoomScrollService {
  constructor(public diagramService: IDiagramService) {}

  public getDiagramController(): IDiagramController {
    return this.diagramService.diagramController;
  }

  public getDiagramComponentNativeElement(): any {
    return this.getDiagramController() ? this.getDiagramController().getDiagramComponentNativeElement() : null;
  }

  public getSvgProperties() {
    return this.getDiagramController() ? this.getDiagramController().diagramComponent.svgProperties : null;
  }

  public getConfig(): any {
    return this.getDiagramController() ? this.getDiagramController().diagramComponent.config : null;
  }

  public getPreviewData(): any {
    return this.getDiagramController() ? this.getDiagramController().diagramComponent.previewData : null;
  }

  private getOrgCoord() {
    return this.diagramService.getOrgCoord();
  }

  public initSize() {
    const svgProperties = this.getSvgProperties();
    const config = this.getConfig();
    const diagram = this.diagramService.diagram;
    if (svgProperties && config && diagram) {
      if (diagram.width && diagram.height) {
        config.width = diagram.width;
        config.height = diagram.height;

        svgProperties.svgWidth = config.width;
        svgProperties.svgHeight = config.height;
        this.setZoom(config.zoom ? config.zoom : 1.0, false);
      }
    }
  }

  public refresh() {
    const diagramController = this.getDiagramController();
    if (diagramController) {
      diagramController.refresh();
    }
  }

  // Zoom
  public getZoom(): number {
    return this.getSvgProperties().zoom;
  }

  public setZoom(zoom: number, keepCenter: boolean = true, refresh: boolean = true) {
    const t1 = new Date();

    zoom = Math.max(Math.min(zoom, 20), 0.01);
    const config = this.getConfig();
    if (config) {
      const centerCoord = this.getCenterCoord();

      const svgProperties = this.getSvgProperties();
      svgProperties.zoom = zoom;
      svgProperties.width = svgProperties.svgWidth * svgProperties.zoom;
      svgProperties.height = svgProperties.svgHeight * svgProperties.zoom;

      if (config.center) {
        svgProperties.viewBox =
          "" +
          -svgProperties.svgWidth / 2 +
          " " +
          -svgProperties.svgHeight / 2 +
          " " +
          svgProperties.svgWidth +
          " " +
          svgProperties.svgHeight;
      } else {
        const orgCoord = this.getOrgCoord();
        svgProperties.viewBox =
          orgCoord.x + " " + orgCoord.y + " " + svgProperties.svgWidth + " " + svgProperties.svgHeight;
      }

      if (keepCenter) {
        this.scrollCenter({ x: centerCoord.x * zoom, y: centerCoord.y * zoom });
      }
    }

    if (refresh) {
      this.refresh();
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

  public autoScroll() {
    const minMaxCoords = {
      max: {
        x: -1000000,
        y: -1000000,
      },
      min: {
        x: 1000000,
        y: 1000000,
      },
    };
    let minXObject: any = null;
    let minYObject: any = null;

    this.diagramService.svgObjectService.forEachCB((svgObjectChild: any) => {
      if (
        svgObjectChild.x !== undefined &&
        svgObjectChild.y !== undefined &&
        svgObjectChild.type === "library-object"
      ) {
        const svgPos = {
          x: parseInt(svgObjectChild.x, 10),
          y: parseInt(svgObjectChild.y, 10),
        };

        minMaxCoords.max.x = Math.max(minMaxCoords.max.x, svgPos.x);
        minMaxCoords.max.y = Math.max(minMaxCoords.max.y, svgPos.y);
        minMaxCoords.min.x = Math.min(minMaxCoords.min.x, svgPos.x);
        minMaxCoords.min.y = Math.min(minMaxCoords.min.y, svgPos.y);

        if (minMaxCoords.min.x === svgPos.x) {
          if (!minXObject || minXObject.x > svgPos.x) {
            minXObject = svgObjectChild;
          }
        }
        if (minMaxCoords.min.y === svgPos.y) {
          if (!minYObject || minYObject.y > svgPos.y) {
            minYObject = svgObjectChild;
          }
        }
      }
    }, null);
    // console.log("autozoom", minMaxCoords);
    // if (minMaxCoords.min.x !== 1000000 && minMaxCoords.min.y !== 1000000) {
    //   this.centerOnSvgObject(minMaxCoords.min, true);
    // }

    // if (minXObject) {
    //   this.centerOnSvgObject(minXObject, true);
    // }
    if (minYObject) {
      this.centerOnSvgObject(minYObject, true);
    }
  }

  public getScrollPos(): any {
    const dcne = this.getDiagramComponentNativeElement();
    return { x: dcne.scrollLeft, y: dcne.scrollTop };
  }

  public scroll(coord: { x: number; y: number }) {
    const dcne = this.getDiagramComponentNativeElement();
    dcne.scroll(coord.x, coord.y);
  }

  public getClientWidth() {
    return this.getDiagramComponentNativeElement().clientWidth;
  }

  // Coord
  public screenToClient(coord: { x: number; y: number }): { x: number; y: number } {
    let res = { x: coord.x, y: coord.y };
    const svgProperties = this.getSvgProperties();
    const config = this.getConfig();
    if (svgProperties && config) {
      let x0 = 0;
      let y0 = 0;
      if (config.center) {
        x0 = -svgProperties.svgWidth / 2;
        y0 = -svgProperties.svgHeight / 2;
      }
      res = { x: coord.x / svgProperties.zoom + x0, y: coord.y / svgProperties.zoom + y0 };
    }
    return res;
  }

  public getMousePositionForDrop(event: any): { x: number; y: number } {
    const dcne = this.getDiagramComponentNativeElement();
    const sp = this.getScrollPos();
    const coord = {
      x: event.clientX - dcne.offsetLeft + sp.x,
      y: event.clientY - dcne.offsetTop + sp.y,
    };
    //    console.log(">> getMousePositionForDrop", coord, sp, svgcne.offsetLeft, svgcne.offsetTop, event)
    return coord;
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
      const orgCoord = this.getOrgCoord();
      res.x = (scrollPos.x + pd.visibleWidth / 2) / zoom + orgCoord.x;
      res.y = (scrollPos.y + pd.visibleHeight / 2) / zoom + orgCoord.y;
    }
    return res;
  }

  public scrollCenter(coord: { x: number; y: number }, topLeft = false) {
    const previewData = this.getPreviewData();
    const pd = previewData ? previewData : this.calcPreviewData();
    if (pd) {
      const orgCoord = this.getOrgCoord();
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

  public centerOnSvgObject(svgObject: any, topLeft = false) {
    if (svgObject) {
      const zoom = this.getZoom();
      this.scrollCenter({ x: svgObject.x * zoom, y: svgObject.y * zoom }, topLeft);
    }
  }

  public calcPreviewData(): any {
    let previewData = this.getPreviewData();
    const dcne = this.getDiagramComponentNativeElement();
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
    this.centerOnSvgObject(this.diagramService.selectionService.getFirstSelectedSvgObjects());
  }

  // Round
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

  public setDisplaySpeedMode(value: boolean) {
    const config = this.getConfig();
    if (config && config.display.speedMode !== value) {
      config.display.speedMode = value;
      if (value) {
        this.getDiagramController().diagramComponent.changeDetectorRef.detach();
      } else {
        this.getDiagramController().diagramComponent.changeDetectorRef.reattach();
      }
    }
  }
}
