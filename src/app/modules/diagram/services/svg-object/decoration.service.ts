import { ISvgObjectService } from "./svg-object.service";
import { SvgConstService } from "./svg-const.service";
import { UtilsService } from "../utils/utils.service";

export class DecorationService {
  constructor(private svgObjectService: ISvgObjectService) {}

  public updateSvgObjectDecorationSvgObjects(svgObject: any) {
    if (svgObject) {
      if (this.svgObjectService.diagramService && this.svgObjectService.diagramService.getDecorationSvgObjectsCB) {
        svgObject.decorationSvgObjects = this.svgObjectService.diagramService.getDecorationSvgObjectsCB(svgObject);
      }
      svgObject.selectionDecorationSvgObjects = this.getSelectionDecorationSvgObjects(svgObject, true);
    }
  }

  public getSelectionDecorationSvgObjects(svgObject: any, forceSelection = false): any[] {
    let svgObjects = [];
    let showSingleObjectHandles = true;

    if (svgObject) {
      let params = {
        selectionHandle: { type: SvgConstService.SELECTION_HANDLE, x: 0, y: 0 },
        translateHandle: { type: SvgConstService.TRANSLATE_HANDLE, x: 0, y: 0 },
        rotateHandle: { type: SvgConstService.ROTATE_HANDLE, x: 50, y: 0 },
        plusHandle: { type: SvgConstService.PLUS_HANDLE, x: -10, y: -10, isMouseDownHandle: true },
        linkHandle: { type: SvgConstService.LINK_HANDLE, x: 10, y: -10 },
        showSingleObjectHandles,
      };

      // Selected objects decoration
      if (svgObject.isSelected || forceSelection) {
        // Disabled code for viewer
        // let selType = svgObject.selType || SvgConstService.POINT_SEL_TYPE;
        // if (SvgConstService.POLYLINE_SEL_TYPE === selType) {
        //   svgObjects = this.getPolyLineSelectionDecorationSvgObjects(svgObject, params);
        // } else if (SvgConstService.RECTANGLE_SEL_TYPE === selType) {
        //   svgObjects = this.getRectangleSelectionDecorationSvgObjects(svgObject, params);
        // } else if (SvgConstService.PATH_SEL_TYPE === selType) {
        //   svgObjects = this.getPathSelectionDecorationSvgObjects(svgObject, params);
        // } else {
        //   svgObjects = this.getDefaultSelectionDecorationSvgObjects(svgObject, params);
        // }

        // if (svgObject.isNode) {
        //   svgObjects.push(params.linkHandle);
        // }

        svgObjects = this.getDefaultSelectionDecorationSvgObjects(svgObject, params);
        // svgObjects = svgObjects.concat(this.getAdditionnalSelectionDecorationSvgObjects(svgObject, params));
      }

      // svgObjects = svgObjects.concat(this.getSpecificDecorationSvgObjects(svgObject, params));

      this.initDecorationSvgObjects(svgObjects);
    }

    return svgObjects;
  }

  public initDecorationSvgObjects(svgObjects: any[]) {
    svgObjects.forEach((svgObject: any) => this.initDecorationSvgObject(svgObject));
  }

  public initDecorationSvgObject(svgObject: any) {
    if (svgObject && svgObject.type && svgObject.type.indexOf("handle") > -1) {
      svgObject.isAHandle = true;
      svgObject.href = "#def-" + svgObject.type;
    }
    this.svgObjectService.renderService.updateSvgObjectTransform(svgObject);
    this.svgObjectService.renderService.updateSvgObjectSafeStyle(svgObject);
  }

  public getSvgObjectTranslateHandlePoint(svgObject: any): { x: number; y: number } {
    let point = this.getSvgObjectTranslatePoint(svgObject);
    if (svgObject && svgObject.type === SvgConstService.LIBRARY_OBJECT_TYPE) {
      point.x = 0;
      point.y = 0;
    }
    return point;
  }

  public getSvgObjectTranslatePoint(svgObject: any): { x: number; y: number } {
    let v = { x: svgObject.x, y: svgObject.y };
    if (
      svgObject &&
      [SvgConstService.CIRCLE_OBJECT_TYPE, SvgConstService.ELLIPSE_OBJECT_TYPE].includes(svgObject.type)
    ) {
      v.x = svgObject.cx;
      v.y = svgObject.cy;
    }
    let point = { x: v.x, y: v.y };
    return point;
  }

  public getDefaultSelectionDecorationSvgObjects(svgObject: any, params: any): any[] {
    let svgObjects = [];

    // if (svgObject && svgObject.ctrlData && svgObject.ctrlData.anc && svgObject.ctrlData.anc.boudingRect) {
    //   const scale = 0.15;
    //   const k = (0.27 * scale) / 0.2; // = 77/219 = 101/286
    //   const dx = -svgObject.ctrlData.anc.anchor.x * k;
    //   const dy = -svgObject.ctrlData.anc.anchor.y * k;
    //   const w = svgObject.ctrlData.anc.boudingRect.w * k;
    //   const h = svgObject.ctrlData.anc.boudingRect.h * k;
    //   svgObjects.push({
    //     type: SvgConstService.RECT_OBJECT_TYPE,
    //     x: dx,
    //     y: dy,
    //     width: w,
    //     height: h,
    //     fill: "none",
    //     strokeWidth: "2",
    //     // stroke: "var(--svg-object-selected)",
    //     stroke: "red",
    //     strokeDasharray: "5,5",
    //     opacity: 0.2,
    //   });
    // }

    svgObjects.push(params.selectionHandle);
    this.initDecorationSvgObjects(svgObjects);
    return svgObjects;
  }

  public getPolyLineSelectionDecorationSvgObjects(svgObject: any, params: any) {
    let svgObjects = [];
    if (params.showSingleObjectHandles) {
      svgObjects = [params.plusHandle];
      let points = this.svgObjectService.geometryService.getPointsFromPolylineSvgObject(svgObject);
      points.forEach((point, i) => {
        if (i == 0) {
          svgObjects.push({ type: SvgConstService.TRANSLATE_HANDLE, x: point.x - 10, y: point.y - 10 });
          svgObjects.push({ type: SvgConstService.POLYLINE_HANDLE, x: point.x, y: point.y, indexes: [i] });
        } else {
          svgObjects.push({ type: SvgConstService.POLYLINE_HANDLE, x: point.x, y: point.y, indexes: [i] });
        }
      });
    } else {
      svgObjects = [params.translateHandle, params.plusHandle];
    }
    return svgObjects;
  }

  public initSafeStyle(svgObject: any): any {
    if (svgObject.style && svgObject.style !== "") {
      svgObject.safeStyle = UtilsService.instance.sanitizer.bypassSecurityTrustStyle(svgObject.style);
    }
    return svgObject;
  }

  public getPathSelectionDecorationSvgObjects(svgObject: any, params: any) {
    let svgObjects = [params.translateHandle];
    if (params.showSingleObjectHandles) {
      svgObjects = [];
      let sD = this.svgObjectService.geometryService.getDFromPathSvgObject(svgObject);
      let points = this.svgObjectService.geometryService.getPointsFromD(sD);
      let i = 0;
      let exPoint = null;
      points.forEach((point, i) => {
        if (i == 0) {
          svgObjects.push({ type: SvgConstService.TRANSLATE_HANDLE, x: point.x - 10, y: point.y - 10 });
          svgObjects.push({ type: SvgConstService.PATH_HANDLE, x: point.x, y: point.y, indexes: [i] });
        } else {
          let im3 = (i - 1) % 3;
          svgObjects.push({
            type: SvgConstService.PATH_HANDLE,
            x: point.x,
            y: point.y,
            indexes: im3 === 2 ? [i, i - 1, i + 1] : [i],
          });
          if (im3 === 0 || im3 === 2) {
            svgObjects.push({
              type: "line",
              x1: exPoint.x,
              y1: exPoint.y,
              x2: point.x,
              y2: point.y,
              stroke: "var(--svg-handle-stroke)",
              strokeWidth: "1",
              strokeDasharray: "5,5",
            });
          }
        }
        exPoint = point;
      });
    }
    return svgObjects;
  }

  public getRectangleSelectionDecorationSvgObjects(svgObject: any, params: any) {
    let svgObjects = [];
    let width = svgObject.width ? svgObject.width : 100;
    let height = svgObject.height ? svgObject.height : 100;
    svgObjects = [
      params.translateHandle,
      params.rotateHandle,
      params.plusHandle,
      { type: SvgConstService.SIZE_HANDLE, x: width, y: 0, pos: "ne" },
      { type: SvgConstService.SIZE_HANDLE, x: width, y: height, pos: "se" },
      { type: SvgConstService.SIZE_HANDLE, x: 0, y: height, pos: "sw" },
    ];
    return svgObjects;
  }

  public getAdditionnalSelectionDecorationSvgObjects(svgObject: any, params: any): any[] {
    let svgObjects = [];
    if (svgObject && svgObject.ctrlData && svgObject.ctrlData.handles) {
      svgObject.ctrlData.handles.forEach((h: any) => {
        let visible = true;
        if (h.visibleAttribute) {
          visible = svgObject[h.visibleAttribute];
        }
        if (visible) {
          if (h.type === SvgConstService.MAPPING_HANDLE) {
            let handle = {
              type: SvgConstService.MAPPING_HANDLE,
              x: parseInt(String(svgObject[h.xMapping])),
              y: parseInt(String(svgObject[h.yMapping])),
              xMapping: h.xMapping,
              yMapping: h.yMapping,
            };
            svgObjects.push(handle);
          } else if (h.type === SvgConstService.LINK_HANDLE) {
            let handle = {
              type: SvgConstService.LINK_HANDLE,
              x: parseInt(String(svgObject[h.xMapping])),
              y: parseInt(String(svgObject[h.yMapping])),
              xMapping: h.xMapping,
              yMapping: h.yMapping,
            };
            svgObjects.push(handle);
          } else if (h.type === SvgConstService.TOGGLE_HANDLE) {
            let handle = {
              type: SvgConstService.TOGGLE_HANDLE,
              x: 0,
              y: 0,
              mapping: h.mapping,
            };
            svgObjects.push(handle);
          }
        }
      });
    }

    return svgObjects;
  }

  // public getSpecificDecorationSvgObjects(svgObject: any, params: any): any[] {
  //   let svgObjects = [];
  //   // if (svgObject && svgObject.bo && svgObject.bo.metaData && svgObject.bo.metaData.verificationToBeVerified) {
  //   //   svgObjects.push({ type: SvgConstService.VERIFICATION_HANDLE, x: 0, y: 0 });
  //   // }
  //   // if (svgObject && svgObject.ctrlData && svgObject.ctrlData.getDecorationSvgObjects) {
  //   //   //      svgObjects = svgObject.ctrlData.getDecorationSvgObjects(svgObject);
  //   //   // svgObjects.push({ type: SvgConstService.VERIFICATION_HANDLE, x: 0, y: 0 });
  //   // }
  //   return svgObjects;
  // }
}
