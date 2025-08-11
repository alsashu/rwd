import { cloneDeep } from "lodash";
import { v4 as uuid } from "uuid";
import { ISvgObjectService } from "./svg-object.service";
import { SvgConstService } from "./svg-const.service";

export interface IInitService {
  initDiagramSvgObjects(): any;
  initSvgObjectRec(svgObject: any, parent: any, diagram: any): any;
  initSvgObject(svgObject: any, parent: any, diagram: any): any;
  initSvgObjectId(svgObject: any, force?: boolean): any;
  initSvgObjectSelType(svgObject: any): any;
  initSvgObjectFromLibrary(svgObject: any): any;
  initRules(svgObject: any): any;
  initBoAssociation(svgObject: any): any;
  getSvgObjectSelType(svgObject: any): string;
  cleanSvgObjectsRec(svgObjects: any, options?: any);
  cleanSvgObjectRec(svgObject: any, options?: any);
}

export class InitService implements IInitService {
  constructor(private svgObjectService: ISvgObjectService) {}

  public modelConfig: any = {
    cleanBoProperties: ["isSelected"],

    cleanSvgObjectProperties: [
      "controler",
      "isSelected",
      "safeStyle",
      "bo",
      "attributeInit",
      "selType",
      "script",
      "diagram",
      "parentDiagram",
    ],
  };

  private selTypeBySvgObjectTypeMap = new Map([
    [SvgConstService.POLYLINE_OBJECT_TYPE, { selType: SvgConstService.POLYLINE_SEL_TYPE }],
    [SvgConstService.POLYGON_OBJECT_TYPE, { selType: SvgConstService.POLYLINE_SEL_TYPE }],
    [SvgConstService.RECT_OBJECT_TYPE, { selType: SvgConstService.RECTANGLE_SEL_TYPE }],
  ]);

  // Init
  public initDiagramSvgObjects(): any {
    this.svgObjectService.initService.initSvgObjectRec(
      this.svgObjectService.diagramService.getRootSvgObject(),
      null,
      this.svgObjectService.diagramService.diagram
    );
  }

  public initSvgObjectRec(svgObject: any, parent: any, diagram: any): any {
    this.initSvgObject(svgObject, parent, diagram);
    if (svgObject && svgObject.svgObjects) {
      svgObject.svgObjects.forEach((child: any) => {
        this.initSvgObjectRec(child, svgObject, diagram);
      });
      // this.svgObjectService.refreshService.refreshSvgObjectRec(svgObject, false);
    }
  }

  public initSvgObject(svgObject: any, parent: any, diagram: any): any {
    if (svgObject) {
      // if (svgObject.libraryId === "backbone-network-1") {
      //   console.log(svgObject);
      // }
      // if (svgObject.boId === "backboneNetwork_5") {
      //   console.log(svgObject);
      // }

      svgObject.parent = parent;
      svgObject.diagram = diagram;
      this.initSvgObjectId(svgObject);
      this.initSvgObjectFromLibrary(svgObject);

      svgObject.isAGroup = !SvgConstService.primitiveTypes.includes(svgObject.type);
      this.svgObjectService.renderService.updateSvgObjectSafeStyle(svgObject);
      this.svgObjectService.renderService.updateSvgObjectSafeSvg(svgObject);
      this.svgObjectService.decorationService.updateSvgObjectDecorationSvgObjects(svgObject);

      this.initBoAssociation(svgObject);
      this.initRules(svgObject);
      if (!svgObject.ctrlData) {
        svgObject.ctrlData = {};
      }
      this.initSvgObjectSelType(svgObject);
      const initSvgObjectCB = this.svgObjectService.diagramService.initSvgObjectCB;
      if (initSvgObjectCB) {
        svgObject = initSvgObjectCB(svgObject);
      }

      this.svgObjectService.refreshService.refreshSvgObjectRec(svgObject, false);
    }
    return svgObject;
  }

  public initSvgObjectId(svgObject: any, force: boolean = false): any {
    if (svgObject && (!svgObject.id || force)) {
      svgObject.id = uuid();
    }
    return svgObject;
  }

  public initSvgObjectSelType(svgObject: any): any {
    if (svgObject) {
      let selType = svgObject.ctrlData.selType;
      selType = selType || this.getSvgObjectSelType(svgObject);
      svgObject.ctrlData.selType = selType;
      svgObject.selType = selType;
    }
    return svgObject;
  }

  // Lib object
  public initSvgObjectFromLibrary(svgObject: any): any {
    if (svgObject && svgObject.libraryId) {
      svgObject.svgObjects = [];
      if (svgObject.ctrlData === undefined) {
        svgObject.ctrlData = {};
      }

      const librarySvgObject = this.svgObjectService.diagramService.templateService.getSvgObjectTemplateFromId(
        svgObject.libraryId
      );

      if (librarySvgObject && librarySvgObject.svgObject) {
        // svgObjects
        svgObject.svgObjects = cloneDeep(librarySvgObject.svgObject).svgObjects || [];
        svgObject.svgObjects.forEach((svg: any) => (svg.parent = svgObject));

        // Controller data
        const ctrlData: any = librarySvgObject.ctrlData || librarySvgObject.controlerData || svgObject.ctrlData || {};
        svgObject.ctrlData = ctrlData;

        if (
          svgObject.ctrlData &&
          svgObject.ctrlData.anc &&
          svgObject.ctrlData.anc.anchor &&
          svgObject.ctrlData.anc.boudingRect
        ) {
          // const scale = 0.2;
          // const k = 0.27; // = 77/219 = 101/286
          const scale = 0.15;
          const k = (0.27 * scale) / 0.2; // = 77/219 = 101/286
          const dx = -svgObject.ctrlData.anc.anchor.x * k;
          const dy = -svgObject.ctrlData.anc.anchor.y * k;

          svgObject.svgObjects.forEach((svg: any) => {
            if (svg.type === "svg") {
              svg.translate = "" + dx + " " + dy;
              svg.scale = scale;
              // TODO delete, done in block transformation from right format to right viewer format
              // svg.svg = this.optimSvg(svg.svg);
            }
          });
        }

        // Attributes init
        if (svgObject.ctrlData.attributeInit) {
          svgObject.ctrlData.attributeInit.forEach((attribut: any) => {
            if (svgObject[attribut.name] === undefined) {
              svgObject[attribut.name] = attribut.value;
            }
          });
        }
        svgObject.isSelected = false;
      }
    }
    return svgObject;
  }

  // private optimSvg(svg: string): string {
  //   let res = svg;
  //   if (res && res.length) {
  //     const p = res.indexOf("<defs/>");
  //     if (p > -1) {
  //       res = res.substr(p + 7);
  //       res = '<g transform="scale(1.36 1.36)">' + res;
  //       res = res.replace("</svg>", "</g>");
  //       res = res.replace(/stroke="#000000"/g, "");
  //       res = res.replace(/stroke="black"/g, "");
  //       // res = res.replace(/fill="#000000"/g, "");
  //     } else if (res.indexOf("<g transform") !== 0) {
  //       console.log("optimSvg error", svg);
  //     }
  //   }
  //   return res;
  // }

  public initRules(svgObject: any): any {
    svgObject.rules = [];

    // Mapping
    if (svgObject.mapping) {
      svgObject.mapping.forEach((m: any) => {
        svgObject.rules.push({
          ruleType: "property-mapping",
          name: m.name,
          parentName: m.parentName,
          format: m.format,
          values: m.values,
        });
      });
    }

    // Mapping bo
    if (svgObject.ctrlData && svgObject.ctrlData.attributeInit) {
      svgObject.ctrlData.attributeInit.forEach((ai: any) => {
        if (ai.boName) {
          svgObject.rules.push({
            ruleType: "property-mapping",
            name: ai.name,
            boName: ai.boName,
          });
        }
      });
    }
  }

  public initBoAssociation(svgObject: any): any {
    const getBoByIdCB = this.svgObjectService.diagramService.getBoByIdCB;
    if (getBoByIdCB && svgObject && svgObject.boId && svgObject.bo === null) {
      svgObject.bo = getBoByIdCB(svgObject.boId);
    }
    return svgObject;
  }

  // SelType
  public getSvgObjectSelType(svgObject: any): string {
    let selType = null;
    if (svgObject) {
      selType = svgObject.selType;
      if (!selType) {
        selType = this.selTypeBySvgObjectTypeMap.get(svgObject.type);
      }
    }
    if (!selType) {
      selType = SvgConstService.POINT_SEL_TYPE;
    }
    return selType;
  }

  // clean
  public cleanSvgObjectsRec(svgObjects: any, options: any = null) {
    if (svgObjects) {
      svgObjects.forEach((svgObject) => this.cleanSvgObjectRec(svgObject, options));
    }
  }

  public cleanSvgObjectRec(svgObject: any, options: any = null) {
    options = options || { deleteControlerDataProp: false };

    this.modelConfig.cleanSvgObjectProperties.forEach((prop: any) => delete svgObject[prop]);
    if (options.deleteControlerDataProp) {
      delete svgObject["controlerData"];
      delete svgObject["ctrlData"];
    }

    if (svgObject.type === SvgConstService.LIBRARY_OBJECT_TYPE) {
      delete svgObject.controlerData;
      delete svgObject.ctrlData;
      delete svgObject.svgObjects;
      delete svgObject.metaData;
    }
    if (svgObject.connections) {
      svgObject.connections.forEach((c: any) => {
        delete c.svgObject2;
        delete c.metaData;
      });
    }
    if (svgObject.connectionPoints) {
      svgObject.connectionPoints.forEach((cp: any) => {
        delete cp.bo;
      });
    }

    if (svgObject.svgObjects) {
      svgObject.svgObjects.forEach((svgObjectI: any) => {
        this.cleanSvgObjectRec(svgObjectI, options);
      });
    }
    return svgObject;
  }
}
