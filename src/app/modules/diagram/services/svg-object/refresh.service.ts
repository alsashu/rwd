import { SvgConstService } from "./svg-const.service";
import { ISvgObjectService } from "./svg-object.service";

export class RefreshService {
  constructor(private svgObjectService: ISvgObjectService) {}

  // SvgObject Rules
  public ruleMap = new Map([
    ["point-map", { exec: (svgObject: any, params: any) => this.execPointMappingRule(svgObject, params) }],
    ["property-mapping", { exec: (svgObject: any, params: any) => this.execPropertyMappingRule(svgObject, params) }],
    ["position", { exec: (svgObject: any, params: any) => this.execPositionRule(svgObject, params) }],
    ["script", { exec: (svgObject: any, params: any) => this.execScriptRule(svgObject, params) }],
    ["link-layout", { exec: (svgObject: any, params: any) => this.execLinkLayoutRule(svgObject, params) }],
  ]);

  // Move svg Objects
  public moveSvgObject(svgObject: any, svgObjectMemo: any, deltaCoord: any, doRound: boolean = true) {
    if (svgObject && svgObjectMemo && deltaCoord) {
      const diagramService = this.svgObjectService.diagramService;
      const pos = { x: svgObjectMemo.x + deltaCoord.x, y: svgObjectMemo.y + deltaCoord.y };
      if (doRound) {
        this.svgObjectService.diagramService.zoomScrollService.roundCoord(pos);
      }
      diagramService.modify(svgObject, "x", pos.x);
      diagramService.modify(svgObject, "y", pos.y);
    }
  }

  // Refresh
  public refreshAllSvgObjects() {
    this.refreshSvgObjectRec(this.svgObjectService.diagramService.getRootSvgObject());
  }

  public refreshSvgObjects(svgObjects: any[], duringMove: boolean = false) {
    if (svgObjects && svgObjects.forEach) {
      svgObjects.forEach((svg: any) => this.refreshSvgObjectRec(svg, duringMove));
    }
  }

  public refreshSvgObjectRec(svgObject: any, duringMove: boolean = false) {
    this.svgObjectService.forEachCB(
      (svgObjectChild: any) => this.refreshSvgObject(svgObjectChild, duringMove),
      svgObject
    );
  }

  public refreshSvgObject(svgObject: any, duringMove: boolean = false) {
    if (!duringMove) {
      // TODO => generic
      this.svgObjectService.graphService.refreshLinkConnections(svgObject);
      // TODO => generic
      this.execScriptRule(svgObject);
    }
    this.executeSvgObjectRules(svgObject);
    // TODO => generic
    this.execLinkLayoutRule(svgObject);

    //    if (!duringMove) {
    this.refreshSvgObjectProperties(svgObject);
    //    }
  }

  public refreshSvgObjectProperties(svgObject: any) {
    this.svgObjectService.renderService.updateSvgObjectTransform(svgObject);
    this.svgObjectService.renderService.updateSvgObjectSafeStyle(svgObject);
    this.svgObjectService.renderService.updateSvgObjectSafeSvg(svgObject);
    this.svgObjectService.decorationService.updateSvgObjectDecorationSvgObjects(svgObject);
  }

  public executeSvgObjectRules(svgObject: any) {
    if (svgObject && svgObject.ctrlData && svgObject.ctrlData.rules) {
      svgObject.ctrlData.rules.forEach((params: any) => this.executeSvgObjectRule(svgObject, params));
    }
    if (svgObject && svgObject.rules) {
      svgObject.rules.forEach((params: any) => this.executeSvgObjectRule(svgObject, params));
    }
  }

  public executeSvgObjectRule(svgObject: any, params: any) {
    if (svgObject && params) {
      const rule = this.ruleMap.get(params.ruleType);
      if (rule) {
        rule.exec(svgObject, params);
      }
    }
  }

  // { ruleType: "point-map", index: -1 }
  public execPointMappingRule(svgObject: any, params: any) {
    if (svgObject && svgObject.parent) {
      const points = this.svgObjectService.geometryService.getPointsFromPolylineSvgObject(svgObject.parent);
      if (points && params.index < points.length) {
        const point = points[params.index === -1 ? points.length - 1 : params.index];
        this.svgObjectService.diagramService.modify(svgObject, "x", point.x);
        this.svgObjectService.diagramService.modify(svgObject, "y", point.y);
      }
    }
  }

  // { ruleType: "property-mapping", name: "text", parentName: "label", },
  public execPropertyMappingRule(svgObject: any, params: any) {
    if (svgObject && params) {
      const mapping = params;
      const propertyName = mapping.name;
      let fromObject = svgObject.parent;
      let fromPropertyName = mapping.parentName;

      if (mapping.boName) {
        fromPropertyName = mapping.boName;
        // fromObject = svgObject.refObject || svgObject.bo;
        fromObject = svgObject.bo;
      }

      if (fromObject && fromPropertyName && propertyName) {
        let fromValue = fromObject[fromPropertyName];

        if (fromValue != undefined) {
          if (mapping.values) {
            let foundValue = false;
            mapping.values.forEach((v: any) => {
              if (fromValue === v.parentValue) {
                fromValue = v.value;
                foundValue = true;
              }
            });
            fromValue = foundValue ? fromValue : null;
          }

          if (fromValue != null && fromValue != undefined) {
            if (mapping.format) {
              fromValue = mapping.format.replace("#VALUE#", fromValue);
            }

            // RIGHT svg block ?
            if (svgObject.svg) {
              svgObject.svg = svgObject.svg.replace(propertyName, fromValue);
            } else if (svgObject[propertyName] !== fromValue) {
              svgObject[propertyName] = fromValue;
            }
          }
        }
        //        console.log(">> mapping", svgObject, params, fromValue, fromObject, fromPropertyName);
      }
    }
  }

  // { ruleType: "position", positionType: "center-parent" },
  public execPositionRule(svgObject: any, params: any) {
    if (svgObject && svgObject.parent && params) {
      let doApply = false;
      const parent = svgObject.parent;
      const isACircle = [SvgConstService.CIRCLE_OBJECT_TYPE, SvgConstService.ELLIPSE_OBJECT_TYPE].includes(
        svgObject.type
      );
      const xName = isACircle ? "cx" : "x";
      const yName = isACircle ? "cy" : "y";
      let x = svgObject[xName];
      let y = svgObject[yName];

      if (params.positionType === "center-parent") {
        if (parent.width) {
          const width = parent.width;
          const height = parent.height;
          if (width != undefined && height != undefined) {
            x = width / 2;
            y = height / 2;
            doApply = true;
          }
        }
      } else if (params.positionType === "point") {
        const i = params.index;
        if (i != undefined && parent.selType === "polyline") {
          const points = this.svgObjectService.geometryService.getPointsFromPolylineSvgObject(parent);
          const p = points[i === -1 ? points.length - 1 : i];
          if (p) {
            x = p.x;
            y = p.y;
            doApply = true;
          }
        }
      }
      if (doApply) {
        svgObject[xName] = x;
        svgObject[yName] = y;
        // this.svgObjectService.diagramService.modify(svgObject, xName, x);
        // this.svgObjectService.diagramService.modify(svgObject, yName, y);
      }
    }
  }

  // { ruleType: "script" },
  public execScriptRule(svgObject: any, params: any = null) {
    if (
      svgObject &&
      !(svgObject.isVisible === false || svgObject.isEnabled === false) &&
      svgObject.ctrlData &&
      svgObject.ctrlData.script &&
      svgObject.ctrlData.script.code
    ) {
      //      svgObject.controlerData && svgObject.controlerData.script && svgObject.controlerData.script.code) {
      try {
        const context = this.svgObjectService.diagramService.getScriptContextCB();
        const servicesService = context ? context.servicesService : null;
        const rootSvgObject = context ? context.rootSvgObject : null;
        const svgObjectService = this.svgObjectService;
        const svgService = this.svgObjectService.svgService;
        const res = eval(svgObject.ctrlData.script.code);
        // console.log(">> execScriptRule", svgObject);
      } catch (e) {
        console.log(e, svgObject);
      }
    }
  }

  // { ruleType: "link-layout" },
  public execLinkLayoutRule(svgObject: any, params: any = null) {
    if (svgObject && svgObject.isLink) {
      const points = this.svgObjectService.geometryService.getPointsFromPolylineSvgObject(svgObject);
      this.updateLinkPointsWithLayout(svgObject, points);
      this.svgObjectService.geometryService.setPolylineSvgObjectSPointsFromPoints(svgObject, points);
    }
  }

  public updateLinkPointsWithLayout(svgObject, points) {
    //TODO
    // if (svgObject && points && points.length) {
    //   if (points.length === 2) {
    //     points.splice(1, 0, { x:0, y: 0});
    //     points.splice(1, 0, { x:0, y: 0});
    //   }
    //   if (points.length === 4) {
    //     let xm = points[0].x + (points[3].x - points[0].x) / 2;
    //     points[1].x = xm;
    //     points[1].y = points[0].y;
    //     points[2].x = xm;
    //     points[2].y = points[3].y;
    //   }
    // }
  }
}
