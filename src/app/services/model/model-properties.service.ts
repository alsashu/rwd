// import { cloneDeep } from "lodash";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ModelService } from "./model.service";
import { IMetaModelService } from "../meta/meta-model.service";
import { ITranslateService } from "../translate/translate.service";
import { IGraphicConfigService } from "../config/graphic-config.service";
import { CompareService, ICompareService } from "../compare/compare.service";

/**
 * Interface of an object describing an object property
 */
export interface IModelObjectProperty {
  object: any;
  name: string;
  displayedName: string;
  value: any;
  displayedValue: string;
  type: string;
  xsdType: string;
  xsdPrefix: string;
  nameWithPrefix: string;
  displayedValueOld: string;
}

export interface IModelPropertiesService {
  sortFunctions: any;
  getObjectProperties(object: any, excludedProperties?: string[], options?: any): IModelObjectProperty[];
  mergeProperties(properties: IModelObjectProperty[], newProperties: IModelObjectProperty[]);
  findProperty(properties: IModelObjectProperty[], name: string);
  getValueType(object: any, propertyName: string): string;
  getDisplayedValue(object: any, propertyName: string): string;
  isValueBoolean(value: any): boolean;
  isValueNumber(value: any): boolean;
  getObjectTypeLabel(o: any): string;
  getTypeLabel(type: string): string;
  getPropertyText(o: any, propertyName: string, label?: string): string;
  toggleBooleanProperty(property: IModelObjectProperty);
  getBooleanDisplayedValue(value: any): string;
  capitalize(s: string): string;
  getIntValue(value: any): number;
  getFloatValue(value: any): number;
}

/**
 * Service calculation the properties of an object or a list of objects
 */
export class ModelPropertiesService implements IModelPropertiesService {
  private modelService: ModelService;
  private translateService: ITranslateService;
  private metaModelService: IMetaModelService;
  private graphicConfigService: IGraphicConfigService;
  private compareService: ICompareService;

  // TODO units
  private propertiesUnitsMap = new Map([["pos", { label: "m" }]]);

  public sortFunctions = {
    displayedNameSortFunction: (p1: any, p2: any) => {
      const v1 = p1 ? String(p1.displayedName).toUpperCase() : "";
      const v2 = p2 ? String(p2.displayedName).toUpperCase() : "";
      return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
    },
  };

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(private servicesService: IServicesService) {}

  /**
   * Init the service
   */
  public initService() {
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.metaModelService = this.servicesService.getService(ServicesConst.MetaModelService) as IMetaModelService;
    this.graphicConfigService = this.servicesService.getService(
      ServicesConst.GraphicConfigService
    ) as IGraphicConfigService;
    this.compareService = this.servicesService.getService(ServicesConst.CompareService) as ICompareService;
  }

  /**
   * Get the model config
   * @returns The model config
   */
  private getModelConfig(): any {
    return this.modelService.getModelConfig();
  }

  /**
   * Get the properties of an object
   * @param object The object
   * @param excludedProperties The list of excluded properties
   * @param options The options
   * @returns The list of properties
   */
  public getObjectProperties(
    object: any,
    excludedProperties: string[] = null,
    options: any = {
      getMetaData: false,
      isUndefinedValueVisible: true,
      calcRedAndYellowOldValue: true,
      getAdditionalInfos: false,
    }
  ): IModelObjectProperty[] {
    let properties: IModelObjectProperty[] = [];

    // Get object properties
    const modelConfig = this.getModelConfig();
    excludedProperties = excludedProperties || modelConfig.excludedProperties;

    // TODO: use graphicsconf.json to exclude properties for which visible = no
    excludedProperties = excludedProperties.concat(this.graphicConfigService.getHiddenProperties(object));
    properties = properties.concat(this.calculateObjectProperties(object, excludedProperties, options));

    // Add additional infos properties
    if (options && options.getAdditionalInfos) {
      const additionalInfosProperties = this.getPropertiesFromAdditionalInfos(object, excludedProperties, options);
      if (additionalInfosProperties.length) {
        // const debug = 1;
      }
      properties = properties.concat(additionalInfosProperties);
    }
    return properties;
  }

  /**
   * Get addtional infos objects properties of an object
   * @param object The object
   * @param excludedProperties The excluded properties
   * @param options The options
   * @returns The list of properties
   */
  private getPropertiesFromAdditionalInfos(
    object: any,
    excludedProperties: string[] = null,
    options: any = { getMetaData: false, isUndefinedValueVisible: true, calcRedAndYellowOldValue: true }
  ): any[] {
    let properties: IModelObjectProperty[] = [];
    if (object && object.type) {
      const additionInfosList = object.additionInfosList;
      if (additionInfosList && additionInfosList.forEach) {
        excludedProperties = excludedProperties.concat("label", "ref");
        additionInfosList.forEach((additionInfosObject: any) => {
          properties = properties.concat(
            this.calculateObjectProperties(additionInfosObject, excludedProperties, options)
          );
        });
      }
    }
    // TODO debug
    // if (properties.length > 0) {
    //   console.log("AdditionalInfos properties", properties);
    // }
    return properties;
  }

  /**
   * Get the properties of an additional infos object
   * @param object The object
   * @param excludedProperties The excluded properties
   * @param options The options
   * @returns The list of properties
   */
  private calculateObjectProperties(
    object: any,
    excludedProperties: string[] = [],
    options: any = { getMetaData: false, isUndefinedValueVisible: true, calcRedAndYellowOldValue: true }
  ): any[] {
    let properties: IModelObjectProperty[] = [];

    try {
      const propertyNames = [];

      // tslint:disable-next-line: forin
      for (const propertyName in object) {
        propertyNames.push(propertyName);
      }

      const attributeList = this.metaModelService.getAttributesForType(object.type);
      try {
        if (attributeList && attributeList.forEach) {
          attributeList.forEach((attribute: any) => {
            if (attribute.name !== undefined && propertyNames.indexOf(attribute.name) === -1) {
              propertyNames.push(attribute.name);
            }
          });
        }
      } catch (ex) {}

      if (propertyNames.indexOf("label") > -1 && propertyNames.indexOf("name") > -1) {
        propertyNames.splice(propertyNames.indexOf("label"), 1);
      }

      // Comparison data
      let modifiedObjectData = null;
      let objectOld = null;
      if (options.calcRedAndYellowOldValue) {
        const compareMap = this.compareService.getCompareObjectsDataMap(object);
        if (compareMap && compareMap.dataPerVersionList && compareMap.dataPerVersionList.length === 2) {
          // console.log(compareMap);
          const dataNewVersion = compareMap.dataPerVersionList[1];
          if (dataNewVersion && dataNewVersion.compareState === CompareService.CompareState.modified) {
            modifiedObjectData = dataNewVersion;
            const dataOldVersion = compareMap.dataPerVersionList[0];
            objectOld = dataOldVersion ? dataOldVersion.object : null;
          }
        }
      }

      propertyNames.forEach((propertyName: string) => {
        const theValue = object[propertyName];
        if ((theValue !== undefined || options.isUndefinedValueVisible) && !excludedProperties.includes(propertyName)) {
          const attribute = attributeList.find((attr: any) => attr.name === propertyName);
          const xsdType = attribute ? attribute.type : "";
          const xsdPrefix = xsdType ? xsdType.split(":")[0] : "";
          const nameWithoutPrefix = propertyName.split(":").pop();
          const nameWithPrefix = (xsdPrefix ? xsdPrefix + ":" : "") + propertyName;

          // not an object ?
          if (typeof theValue !== "object") {
            // Comparison (red and yellow value display)
            let displayedValueOld = null;
            if (objectOld && modifiedObjectData && modifiedObjectData.properties) {
              const propertyNameSearch = propertyName === "absPos" ? "KP" : propertyName;
              if (modifiedObjectData.properties.find((p: any) => p.name.split(":").pop() === propertyNameSearch)) {
                displayedValueOld = this.getDisplayedValue(objectOld, propertyName);
              }
            }

            const property: IModelObjectProperty = {
              object,
              name: nameWithoutPrefix, // propertyName,
              displayedName: this.translateService.translateModelPropertyName(nameWithoutPrefix), // propertyName,
              value: theValue,
              // value: this.getPropertyValue(object, propertyName), // theValue,
              displayedValue: this.getDisplayedValue(object, propertyName),
              type: this.getValueType(object, propertyName),
              xsdType,
              xsdPrefix,
              nameWithPrefix,
              displayedValueOld,
            };
            properties.push(property);
          } else {
            const thePropertyValue = this.getPropertyValue(object, propertyName);
            if (typeof thePropertyValue !== "object") {
              // Complex property
              // Comparison (red and yellow value display)
              let displayedValueOld = null;
              if (objectOld && modifiedObjectData && modifiedObjectData.properties) {
                const propertyNameSearch = propertyName === "absPos" ? "KP" : propertyName;
                if (modifiedObjectData.properties.find((p: any) => p.name.split(":").pop() === propertyNameSearch)) {
                  displayedValueOld = this.getDisplayedValue(objectOld, propertyName);
                }
              }

              const property: IModelObjectProperty = {
                object,
                name: nameWithoutPrefix, // propertyName,
                displayedName: this.translateService.translateModelPropertyName(nameWithoutPrefix), // propertyName,
                value: this.getPropertyValue(object, propertyName), //theValue, => diff
                displayedValue: this.getDisplayedValue(object, propertyName),
                type: this.getValueType(object, propertyName),
                xsdType,
                xsdPrefix,
                nameWithPrefix,
                displayedValueOld,
              };
              properties.push(property);
            }
          }
        }
      });
    } catch (ex) {
      console.error(ex);
    }
    return properties;
  }

  /**
   * Merge properties of several objects
   * @param properties The properties
   * @param newProperties The merged properties
   */
  public mergeProperties(properties: IModelObjectProperty[], newProperties: IModelObjectProperty[]) {
    newProperties.forEach((newProperty: any) => {
      if (typeof newProperty.value !== "object") {
        const property = this.findProperty(properties, newProperty.name);
        if (property) {
          if (newProperty.value !== property.value) {
            property.displayedValue = "-";
          }
        } else {
          newProperty.isSelected = false;
          properties.push(newProperty);
        }
      }
    });
  }

  /**
   * Find a property from its name
   * @param properties The properties
   * @param name The name
   * @returns The found property
   */
  public findProperty(properties: IModelObjectProperty[], name: string) {
    return properties ? properties.find((p: any) => p.name === name) : null;
  }

  /**
   * Get the type of a value
   * @param object The object
   * @param propertyName The property name
   * @returns The value type
   */
  public getValueType(object: any, propertyName: string): string {
    let res = "any";
    const value = object[propertyName];
    if (this.isValueBoolean(value)) {
      res = "boolean";
    }
    if (this.isValueNumber(value)) {
      res = "number";
    }
    return res;
  }

  /**
   * Get property value
   * @param object The object
   * @param propertyName The name of the property
   * @returns The value
   */
  public getPropertyValue(object: any, propertyName: string): any {
    let res: any = null;
    if (object && propertyName) {
      res = object[propertyName];
      if (res === undefined) {
        res = null;
      } else if (res && typeof res === "object" && res.xmlValue !== undefined) {
        res = res.xmlValue;
      }
    }
    return res;
  }

  /**
   * Get the displayed value for a property of an object, (Boolean, Can be translated, unit added...)
   * @param object The object
   * @param propertyName The name of the property
   * @returns The displayed value
   */
  public getDisplayedValue(object: any, propertyName: string): string {
    let res: any = "";
    if (object && propertyName) {
      res = object[propertyName];
      if (res === undefined || res === null) {
        res = "";
      } else if (this.isValueBoolean(res)) {
        res = this.getBooleanDisplayedValue(res);
      } else if (res && typeof res === "object" && res.xmlValue !== undefined) {
        res = res.xmlValue;
      }

      // else {
      //   const boLinks = this.getModelConfig().boLinks;
      //   const boLink = boLinks.find((bol: string[]) => bol[0] == propertyName);
      //   if (boLink) {
      //     const linkedObject = object[boLink[1]];
      //     if (linkedObject && linkedObject.id && linkedObject.label && linkedObject.type) {
      //       res = linkedObject.label + " (" + this.getTypeLabel(linkedObject.type) + ") id = " + linkedObject.id;
      //     }
      //   }
      // }

      res = res + this.calcPropertyUnitText(object, propertyName);
    }

    return res;
  }

  /**
   * Get the unit text value of the property of an object
   * @param object The object
   * @param propertyName The name of the property
   * @returns The unit text value
   */
  private calcPropertyUnitText(object: any, propertyName: string): string {
    let res = "";
    const unitData = this.propertiesUnitsMap.get(propertyName);
    if (unitData && unitData.label) {
      res = " (" + unitData.label + ")";
    }
    return res;
  }

  /**
   * Test if a value is boolean
   * @param value The value
   * @returns Boolean value
   */
  public isValueBoolean(value: any): boolean {
    return ["true", "false"].includes(String(value));
  }

  /**
   * Test if a value is a number
   * @param value The value
   * @returns Boolean value
   */
  public isValueNumber(value: any): boolean {
    return !isNaN(Number(value));
  }

  /**
   * Get the label of the type of an object
   * @param object The object
   * @returns Text value
   */
  public getObjectTypeLabel(object: any): string {
    return object && object.type ? this.getTypeLabel(object.type) : "";
  }

  /**
   * Get the label of a type (user friendly, translated)
   * @param type The type
   * @returns Text value
   */
  public getTypeLabel(type: string): string {
    // return type !== "treeMenuNode" ? this.capitalize(this.translateService.translateFromMap(type)) : "";
    return type !== "treeMenuNode" ? this.capitalize(this.translateService.translateModelClassName(type)) : "";
  }

  /**
   * Get the value of a property of an object
   * @param object The object
   * @param propertyName The name of the property
   * @param label The label
   * @returns The string value
   */
  public getPropertyText(object: any, propertyName: string, label: string = null): string {
    let res = "";
    label = label !== null ? label : propertyName;
    if (object && object[propertyName] !== undefined) {
      res = object[propertyName];
      if (label !== "") {
        res = label + res + " ";
      }
    }
    return res;
  }

  /**
   * Toggle a boolean property
   * @param property The property
   */
  public toggleBooleanProperty(property: IModelObjectProperty) {
    const value = property.value === true || property.value == "true";
    property.value = !value;
    property.displayedValue = this.getBooleanDisplayedValue(property.value);
  }

  /**
   * Get the displayed value of a boolean property
   * @param value The value
   * @returns The displayed value
   */
  public getBooleanDisplayedValue(value: any): string {
    const bValue = value === true || value == "true";
    return this.translateService.translateFromMap(String(bValue));
  }

  // Utils
  /**
   * Set the first letter uppercase
   * @param s The string value
   * @returns The transformed string
   */
  public capitalize(s: string): string {
    return typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  /**
   * Get the int value of a value
   * @param value The value
   * @returns Int
   */
  public getIntValue(value: any): number {
    return value !== undefined ? parseInt(String(value).replace(",", ".")) : 0;
  }

  /**
   * Get the float value of a value
   * @param value The value
   * @returns Float
   */
  public getFloatValue(value: any): number {
    return value !== undefined ? parseFloat(String(value).replace(",", ".")) : 0;
  }
}
