import { IServicesService } from "../services/iservices.service";

/**
 * Interface of GraphicConfigService
 */
export interface IGraphicConfigService {
  setGConfig(graphicConfig: any): any;
  getAutocadBlockNameFromTypeAndSubtype(type: string, object: any): string;
  getTypeAndSubTypeGConfigFromTypeAndObject(type: string, object: any): any;
  getSubType(o: any): string;
  getHiddenProperties(object: any): string[];
}

/**
 * Service managing Graphic Config from graphicsconf.tcfg file
 */
export class GraphicConfigService implements IGraphicConfigService {
  public gconfig: any;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(private servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {}

  /**
   * Set the gconfig data
   * @param gconfig The graphic config data
   * @returns graphicConfig
   */
  public setGConfig(gconfig: any): any {
    this.gconfig = gconfig;
    return gconfig;
  }

  /**
   * Get Autocad block name from type And sub type of an object
   * @param type The type
   * @param object The object
   * @returns String value
   */
  public getAutocadBlockNameFromTypeAndSubtype(type: string, object: any = null): string {
    const gconfigData = this.getTypeAndSubTypeGConfigFromTypeAndObject(type, object);
    const res = gconfigData.subTypeData
      ? gconfigData.subTypeData.autocad !== ""
        ? gconfigData.subTypeData.autocad
        : gconfigData.typeData
        ? gconfigData.typeData.autocad
        : ""
      : gconfigData.typeData && gconfigData.typeData.autocad
      ? gconfigData.typeData.autocad
      : "";
    return res;
  }

  /**
   * Get type and sub type graphic config from a type and an object
   * @param type The type
   * @param object The object
   * @returns Type and sub type structure
   */
  public getTypeAndSubTypeGConfigFromTypeAndObject(type: string, object: any = null): any {
    const res: any = {
      typeData: null,
      subTypeData: null,
    };
    try {
      if (this.gconfig) {
        const typeData = this.gconfig.types.find((td: any) => td.ref === type);
        if (typeData) {
          res.typeData = typeData;
          if (object && typeData.subtype) {
            let subTypeData = null;

            if (typeData.subtype.find) {
              subTypeData = typeData.subtype.find((std: any) => this.testSubTypeRule(std, object));
            } else {
              subTypeData = this.testSubTypeRule(typeData.subtype, object) ? typeData.subtype : null;
            }

            res.subTypeData = subTypeData;
            // if (!res.subTypeData) {
            //   console.log("gcomp not found", res, type, object);
            // }
          }
        }
      }
    } catch (ex) {
      console.error(ex);
    }
    return res;
  }

  /**
   * Get sub type from graphicsconfig.json
   */
  public getSubType(o: any): string {
    const gconfigData = this.getTypeAndSubTypeGConfigFromTypeAndObject(o.type, o);
    return gconfigData && gconfigData.subTypeData && gconfigData.typeData.subtype && gconfigData.typeData.subtype.id
      ? gconfigData.typeData.subtype.id
      : null;
  }

  /**
   * Test if a property if visible
   * @param gconfigData gconfigData of the object
   * @param propertyName The property name
   * @returns Boolean value
   */
  public isPropertyVisible(gconfigData: any, propertyName: string): boolean {
    let res = true;
    if (
      gconfigData &&
      gconfigData.typeData &&
      gconfigData.typeData.propertyOverload &&
      gconfigData.typeData.propertyOverload.find &&
      gconfigData.typeData.propertyOverload.find((po: any) => po.name === propertyName && po.visible === "no")
    ) {
      res = false;
    }
    return res;
  }

  /**
   * Get the list of properties not visible
   * @param object The object
   * @returns The list of the name of the hidden properties
   */
  public getHiddenProperties(object: any): string[] {
    const res = [];
    const gconfigData = this.getTypeAndSubTypeGConfigFromTypeAndObject(object.type, object);
    if (
      gconfigData &&
      gconfigData.typeData &&
      gconfigData.typeData.propertyOverload &&
      gconfigData.typeData.propertyOverload.forEach
    ) {
      gconfigData.typeData.propertyOverload.forEach((po: any) => {
        if (po.visible === "no") {
          res.push(po.name);
        }
      });
    }
    return res;
  }

  /**
   * Test if a sub type rule is true for an object
   * @param subtype Sub type
   * @param object Object
   * @returns Boolean value
   */
  public testSubTypeRule(subtype: any, object: any): boolean {
    let res = false;
    if (subtype) {
      if (!res && subtype.expect) {
        const expectList = subtype.expect.find ? subtype.expect : [subtype.expect];
        const expectTestNOK = expectList.find(
          (expect: any) =>
            String(expect.value) !==
            String(object[expect.prop ? expect.prop.replace("rail:", "").replace("GenericADM:", "") : ""])
        );
        if (!expectTestNOK) {
          res = true;
        }
      }
    }
    return res;
  }
}
