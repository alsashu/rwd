import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { IApiService } from "../api/api.service";
import { MvcService } from "../mvc/mvc.service";
import { MvcConst } from "../mvc/mvc.const";
import { ITranslateService } from "../translate/translate.service";
// tslint:disable-next-line: no-var-requires
const DOMParser = require("xmldom").DOMParser;

/**
 * Interface of MetaModelService
 */
export interface IMetaModelService {
  // loadXsdModelFromServer(): Promise<any>;
  // loadXsdModelFromFile(filename: string): Promise<any>;
  loadXsdModel(xsdAsJson: any);

  isTypeExtensionOf(type: string, extensionType: string): boolean;
  isTypeExtensionOfTypes(type: string, extensions: string[]): boolean;
  getAttributesForType(type: string): any[];
}

/**
 * Service managing meta model based on xsd files
 */
export class MetaModelService implements IMetaModelService {
  private apiService: IApiService;
  private mvcService: MvcService;
  private translateService: ITranslateService;

  public xsdFileMap: Map<string, any> = new Map<string, any>();
  private namespaces: string[] = [];
  private complexTypeMap: Map<string, any>;
  private additionalInfosTypeMap: Map<string, any>;
  private knownExtensions: Map<string, any> = new Map<string, any>();
  private knownProperties: Map<string, any> = new Map<string, any>();
  private unitMap: Map<string, string> = new Map<string, string>();
  private mainXsdFileName = "infrastructure-U400.xsd";

  /**
   * Constructor
   * @param servicesService The ServicesService
   */
  constructor(public servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as MvcService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
  }

  // /**
  //  * Test attributes
  //  */
  public doTests_getAttribute() {
    // console.log(this.complexTypeMap);
    // this.testAttr("rail:tSignal");
    // this.testAttr("signal");
    // this.testAttr("tSignalBase");
    // this.testAttr("tSignalSpeed");
    // this.testAttr("tSignalEtcs");
    // console.log(this.complexTypeMap.get(":rail:tRuleCodeElement"));
    this.testAttr("GenericADM:route");
    // this.testAttr("tBasePlacedElement");
    // this.testAttr("tCrossSection");
    // this.testAttr("tStockRailJoint");
  }

  private doTests() {
    // this.doTests_isExtensionOf();
    this.doTests_getAttribute();

    this.testElement("signal", "eSignal");
    this.testElement("signal", "tSignal");
    const data = this.knownExtensions.get("eSignal");
    console.log(data);

    let res = this.getAdditionalInfosTypesFromType("signal");
    console.log("signal", res);
    res = this.getAdditionalInfosTypesFromType("switch");
    console.log("switch", res);

    // console.log(this.knownExtensions);
    // const type = "tSignal";
    // this.testElement(type, "XXX");
    // const extensionsList = this.knownExtensions.get(type) || [];
    const type = "tSignalAdditionalInfo";
    console.log(type, this.getAttributesForType(type));
    // this.testAttr("tSignalAdditionalInfo");

    console.log(this.additionalInfosTypeMap);

    const attributeList = this.getAttributesForType("signalAdditionalInfo");
    console.log(attributeList);

    const debug = 1;
  }

  /**
   * Get additionalInfos types from a type
   * @param type The type
   * @returns List of found additionalInfos types
   */
  private getAdditionalInfosTypesFromType(type: string): any[] {
    const res = this.additionalInfosTypeMap.get(type.toUpperCase() + "ADDITIONALINFOS") || [];
    console.log("AdditionalInfos:", type, res);
    return res;
  }

  // private getAdditionalInfosTypesFromType(type: string): any[] {
  //   const res = [];
  //   let searchValue = type.substring(2);
  //   searchValue += "AdditionalInfos";
  //   console.log("AdditionalInfos:", type, searchValue);
  //   this.complexTypeMap.forEach((value: any, key: any) => {
  //     if (key.includes(searchValue)) {
  //       // const theKey = key.split(":").pop();
  //       console.log("AdditionalInfos found:", key, value);
  //       res.push(value);
  //     }
  //   });
  //   if (res.length === 0) {
  //     console.log("None found");
  //   }
  //   return res;
  // }

  /**
   * Add a complex type to the map
   * @param key
   * @param value
   */
  private addComplexType(key: string, value: any) {
    value.key = key;
    this.complexTypeMap.set(key, value);

    // Additional infos
    if (key.includes("AdditionalInfos")) {
      let theKey = key.split(":").pop();
      if (theKey.length > 2) {
        if (theKey.substring(0, 1) === "e" && theKey.substring(1, 1).toUpperCase() === theKey.substring(1, 1)) {
          theKey = theKey.substring(1);
        }
      }
      theKey = theKey.toUpperCase();

      let additionalInfosList = this.additionalInfosTypeMap.get(theKey);
      if (!additionalInfosList) {
        additionalInfosList = [];
        this.additionalInfosTypeMap.set(theKey, additionalInfosList);
      } else {
        const debug = true;
      }
      additionalInfosList.push(value);
      // additionalInfosList.push(key);
      // console.log(theKey, value);
    }
  }

  /**
   * Test if a type is an extension of
   * @param type The type to be tested
   * @param extension The extension
   */
  private testElement(type: string, extension: string) {
    console.log(type + " == " + extension + " ?", this.isTypeExtensionOf(type, extension));
  }

  /**
   * Test attributes of one type
   * @param type
   */
  private testAttr(type: string) {
    console.log(type + " has attributes : ", this.getAttributesForType(type));
  }

  // /**
  //  * Test function
  //  */
  // public doTests_isExtensionOf() {
  //   console.log("####### début test ######");
  //   console.log(this.complexTypeMap);
  //   // console.log(this.complexTypeMap.get("http://www.transport.alstom.com/GenericADM/1:assembly"));

  //   this.testElement("eLine", "tElementWithIDAndName");
  //   this.testElement("eLine", "tLine");
  //   this.testElement("tPlacedElement", "tElementWithIDAndName");
  //   this.testElement("tPlacedElement", "tBasePlacedElement");
  //   this.testElement("tCrossSection", "tBasePlacedElement");
  //   this.testElement("eTrack", "tTrack");
  //   this.testElement("track", "eTrack");
  //   this.testElement("switch", "eSwitch");
  //   this.testElement("bufferStop", "tBufferStop");
  //   this.testElement("crossing", "tCrossing");
  //   this.testElement("mileageChange", "tMileageChange");
  //   this.testElement("scaleArea", "tScaleArea");
  //   this.testElement("GenericADM:route", "tElementWithRef");
  //   this.testElement("switchPointAndPosition", "tElementWithRef");
  //   this.testElement("tVDSection", "tElementWithRef");
  //   this.testElement("assembly", "tArchitectureElement");
  //   this.testElement("tAssembly", "tArchitectureElement");
  //   this.testElement("tCubicle", "tArchitectureElement");
  //   this.testElement("tLRU", "tArchitectureElement");
  //   this.testElement("tEquipmentRoom", "tArchitectureElement");
  //   this.testElement("tSpecificPunctualObject", "tBasePlacedElement");
  //   this.testElement("pageArea", "tPageArea");
  //   this.testElement("tSpecificPunctualObject", "tBasePlacedElement");
  //   this.testElement("ARGOS:commutateurAU", "tBasePlacedElement");
  //   this.testElement("ARGOS:tCommutateurAU", "tBasePlacedElement");
  //   this.testElement("tCommutateurAU", "tBasePlacedElement");
  //   this.testElement("ARGOS:commutateurZepV", "tBasePlacedElement");
  // }

  // /**
  //  * Load RailMl XSD files
  //  */
  // public async loadXsdModelFromServer(): Promise<any> {
  //   this.apiService.getXsdModel().then((res: any) => {
  //     if (res && res.success === false) {
  //       console.error("loadXsdModelFromServer error", res);
  //     } else {
  //       this.loadXsdModel(res);
  //       this.mvcService.emit({ type: MvcConst.MSG_XSD_CHANGED });
  //       this.doTests();
  //     }
  //   });
  // }

  // /**
  //  * Load RailMl XSD files
  //  */
  // public async loadXsdModelFromFile(filename: string): Promise<any> {
  //   this.servicesService.httpClient.get(filename).subscribe((res: any) => {
  //     this.loadXsdModel({ "file-test": res });
  //     // this.doTests_isExtensionOf();
  //   });
  // }

  /**
   * Load the xsd model from a key/value json with xsd filename as keys and xsd string as values
   * @param xsdAsJson The map with xsd filenames and string content
   */
  public loadXsdModel(xsdAsJson: any) {
    try {
      if (xsdAsJson) {
        this.xsdFileMap = new Map<string, any>();
        this.complexTypeMap = new Map<string, any>();
        this.additionalInfosTypeMap = new Map<string, any[]>();
        this.namespaces = [""];

        // parse files
        const jsonKeys = Object.keys(xsdAsJson);
        for (let i = 0; i < jsonKeys.length; i++) {
          const key = jsonKeys[i];
          if (key.toUpperCase().includes(".XSD")) {
            this.xsdFileMap.set(key, new DOMParser().parseFromString(xsdAsJson[key]));
          }
          if (key.toUpperCase().includes(".JSON")) {
            this.translateService.setModelTranslateFile(key, JSON.parse(xsdAsJson[key]));
          }
        }

        // set mainXsdFileName
        const xsdFileMapKeys = Array.from(this.xsdFileMap.keys());
        if (xsdFileMapKeys.includes("infrastructure-GenericADM.xsd")) {
          this.mainXsdFileName = "infrastructure-GenericADM.xsd";
        }
        this.mainXsdFileName =
          xsdFileMapKeys.find(
            (key: string) =>
              key.includes("infrastructure-") &&
              key.includes(".xsd") &&
              !key.includes(".sha") &&
              key !== "infrastructure-GenericADM.xsd"
          ) || this.mainXsdFileName;
        if (xsdFileMapKeys.includes("infrastructure-ARGOS.xsd")) {
          this.mainXsdFileName = "infrastructure-ARGOS.xsd";
        }
        if (xsdFileMapKeys.includes("infrastructure-P_and_T_ARGOS.xsd")) {
          this.mainXsdFileName = "infrastructure-P_and_T_ARGOS.xsd";
        }

        // Namespace Map
        const namespaceMap = this.createNamespaceMap(this.xsdFileMap.get(this.mainXsdFileName));
        this.computeTypeMap(this.mainXsdFileName, [], namespaceMap);

        this.generateUnitMap();

        this.doTests();
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * Recursive function that takes a xsd file name and update the complexe type Map
   * @param fileName , string, xsd filename
   * @param parsedFiles list of already parsed files
   */
  private computeTypeMap(fileName: string, parsedFiles: string[], namespaceMap: any) {
    try {
      const debugList = new Map();
      const doc = this.xsdFileMap.get(fileName);
      const docTypes = doc.getElementsByTagName("xs:complexType");
      for (let i = 0; i < docTypes.length; i++) {
        const dom = docTypes[i];
        for (let j = 0; j < dom.childNodes.length; j++) {
          const child = dom.childNodes[j];
          const name = dom.getAttribute("name");

          // TODO TEST
          // if (fileName === "U400.xsd") {
          //   // if (name.toUpperCase().indexOf("NALINFO") > -1) {
          //   if (name.indexOf("SwitchAdditionalInfo") > -1) {
          //     console.log(fileName, name);
          //     debugList.set(name, name);
          //   }
          // }
          this.parseChild(child, name, child, namespaceMap);
        }
      }

      // TODO TEST
      // if (debugList.size) {
      //   console.log(Array.from(debugList.keys()));
      //   console.log("");
      // }

      const res = this.findNextFiles(doc, parsedFiles);
      const nextFiles = Array.from(res[0]);
      parsedFiles = res[1];
      for (let i = 0; i < nextFiles.length; i++) {
        const nextFile = nextFiles[i];
        namespaceMap = this.createNamespaceMap(this.xsdFileMap.get(nextFile));
        this.computeTypeMap(nextFile, parsedFiles, namespaceMap);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * Parse a child element
   * @param element The element
   * @param complexTypeName The complex type
   * @param parentNode The parent node
   * @param namespaceMap The namespace map
   */
  private parseChild(element: any, complexTypeName: string, parentNode: any, namespaceMap: any) {
    const localName = element.localName;
    const types = [];
    switch (localName) {
      case "complexContent":
        const extension = element.getElementsByTagName("xs:extension");
        if (extension.length !== 0) {
          const res = extension[0].getAttribute("base");
          const typeKey = namespaceMap.get("targetNamespace") + ":" + complexTypeName;
          this.addComplexType(typeKey, {
            name: res,
            xmlObject: parentNode,
            type: [],
          });
          // will have complexType -> namespace:res
          const childNodes = extension[0].childNodes;
          for (let i = 0; i < childNodes.length; i++) {
            const child = childNodes[i];
            this.parseChild(child, typeKey, element, namespaceMap);
          }
        }
        break;
      case "sequence":
      case "choice":
        const elements = element.getElementsByTagName("xs:element");
        for (let i = 0; i < elements.length; i++) {
          const ele = elements[i];
          types.push({
            type: ele.getAttribute("ref") || ele.getAttribute("type"),
            name: ele.getAttribute("name") || "",
          });
          this.parseChild(ele, "", element, namespaceMap);
        }
        const newValue = this.complexTypeMap.get(complexTypeName) || {
          name: "none",
          xmlObject: parentNode,
          type: [],
        };
        this.addComplexType(complexTypeName, newValue);
        break;
      case "element":
        const name = element.getAttribute("name");
        const type = element.getAttribute("type");
        this.addComplexType(namespaceMap.get("targetNamespace") + ":" + name, {
          name: type,
          xmlObject: parentNode,
          type: [],
        });
        break;
      default:
        break;
    }
  }

  /**
   * Function that parse the document and find the name of the next files to parse
   * @param doc the dom of the parsed file
   * @param parsedFiles list of already parsed files
   */
  private findNextFiles(doc: any, parsedFiles: string[]) {
    const nextFiles = [];
    const baliseToNextFiles = ["xs:redefine", "xs:include", "xs:import"];
    for (let i = 0; i < baliseToNextFiles.length; i++) {
      const balise = baliseToNextFiles[i];
      const elements = doc.getElementsByTagName(balise);

      for (let j = 0; j < elements.length; j++) {
        const element = elements[j];
        const nextFile = element.getAttribute("schemaLocation");

        if (!parsedFiles.includes(nextFile) && !nextFile.includes("http")) {
          nextFiles.push(nextFile);
          parsedFiles.push(nextFile);
        }
      }
    }
    return [nextFiles, parsedFiles];
  }

  /**
   * Function that parse the xs:schema balise of a file and store the match alias-namespace
   * and the targetNamespace
   * @param element main node above xs:schema
   */
  private createNamespaceMap(element: any): Map<string, string> {
    const res = new Map<string, string>();
    const node = element.getElementsByTagName("xs:schema");
    const attributes = node[0].attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      if (attribute.nodeName.includes("xmlns:")) {
        const alias = attribute.nodeName.split(":")[1];
        res.set(alias, attribute.nodeValue);
        if (!this.namespaces.includes(attribute.nodeValue)) {
          this.namespaces.push(attribute.nodeValue);
        }
        if (!this.namespaces.includes(alias)) {
          this.namespaces.push(alias);
        }
      }
    }
    res.set("targetNamespace", node[0].getAttribute("targetNamespace"));
    return res;
  }

  /**
   * Function that test if a type has as an extensionType the string entered
   * @param type : string base type
   * @param extensionType  : string extensionType tested
   */
  public isTypeExtensionOf(type: string, extensionType: string): boolean {
    if (type && type.includes(":")) {
      type = type.split(":")[1];
    }
    const extensionsList = this.knownExtensions.get(type) || [];
    const result = extensionsList.includes(extensionType);
    if (result) {
      return true;
    } else if (this.isTypeExtensionOfRec(type, extensionType, [])) {
      extensionsList.push(extensionType);
      this.knownExtensions.set(type, extensionsList);
      return true;
    }
    return false;
  }

  /**
   * Function that recursively tests if a type has as an extensionType the string entered
   * @param type String base type
   * @param extensionType String extensionType tested
   * @param seen The list of seen extensions
   * @returns The boolean result
   */
  private isTypeExtensionOfRec(type: string, extensionType: string, seen: string[]): boolean {
    let res = type === extensionType;
    for (let i = 0; i < this.namespaces.length; i++) {
      const namespace = this.namespaces[i];
      const value = this.complexTypeMap.get(namespace + ":" + type);
      if (!res && value && value.name && !seen.includes(value.name)) {
        for (let j = 0; j < value.type.length; j++) {
          const seqType = value.type[j];
          const typeName = seqType.type.split(":").pop();
          res = res || typeName === extensionType;
          res = res || this.isTypeExtensionOfRec(typeName, extensionType, seen);
        }
        const name = value.name.split(":").pop();
        seen.push(value.name);
        res = res || name === extensionType;
        if (!res) {
          res = res || this.isTypeExtensionOfRec(name, extensionType, seen);
        } else {
          return res;
        }
      }
    }
    return res;
  }

  /**
   * Test if a type is an extension of an extension list
   * @param type The type
   * @param extensions The list of extensions
   * @returns Boolean result
   */
  public isTypeExtensionOfTypes(type: string, extensions: string[]): boolean {
    let res = false;
    for (let i = 0; i < extensions.length; i++) {
      if (!res) {
        const extension = extensions[i];
        res = this.isTypeExtensionOf(type, extension);
      }
    }
    return res;
  }

  /**
   * Get the list of attributes of a type
   * @param type The type
   * @returns The list of attributes
   */
  private getAttrForType(type: string): any[] {
    let res = [];
    const keys = Array.from(this.xsdFileMap.keys());
    const numKeys = keys.length;
    for (let i = 0; i < numKeys; i++) {
      const key = keys[i];
      const file = this.xsdFileMap.get(key);
      const docTypes = file.getElementsByTagName("xs:complexType");
      const numDocTypes = docTypes.length;
      for (let j = 0; j < numDocTypes; j++) {
        const dom = docTypes[j];
        if (dom.getAttribute("name").split(":").pop() === type) {
          // find attributes
          const elements = dom.getElementsByTagName("xs:attribute");
          const numElements = elements.length;
          for (let k = 0; k < numElements; k++) {
            const element = elements[k];
            const newAtt = this.getAttributeFromElement(element);
            res.push(newAtt);
          }

          // find attributesGroup
          const groups = dom.getElementsByTagName("xs:attributeGroup");
          const numGroups = groups.length;
          for (let m = 0; m < numGroups; m++) {
            const group = groups[m];
            res = this.fuseList(res, this.getAttributeFromAttributeGroup(group.getAttribute("ref"), file));
          }

          // find sequence
          const sequences = dom.getElementsByTagName("xs:sequence");
          const numSequences = sequences.length;

          // if (key === "U400.xsd") {
          //   console.log(dom, sequences);
          // }

          // TODO additionalInfo elements ok
          // for (let m = 0; m < numSequences; m++) {
          //   const sequence = sequences[m];
          //   if (sequence) {
          //     const elements = sequence.getElementsByTagName("xs:element");
          //     const numElements = elements.length;
          //     for (let ie = 0; ie < numElements; ie++) {
          //       const element = elements[ie];

          //       const newAtt = this.getAttributeFromElement(element);
          //       res.push(newAtt);
          //     }
          //   }
          // }
        }
      }
    }

    return res;
  }

  /**
   * Create an attribute from an xml element
   * @param element The element
   * @returns The attribute object
   */
  private getAttributeFromElement(element: any): any {
    const res = {};
    const attributes = element.attributes;
    const numAttributes = attributes.length;
    for (let l = 0; l < numAttributes; l++) {
      const att = attributes[l];
      res[att.name] = att.nodeValue;
    }
    return res;
  }

  /**
   * Function that returns the list of attributes for attributeGoupe given
   * @param attributeGroupRef : string the name of the atributeGroup
   * @param file : the file in which we search the attributes
   * @returns the list of all attributes as {name , type, optional}
   */
  private getAttributeFromAttributeGroup(attributeGroupRef: string, file: any): any[] {
    const res = [];
    const attributeGroups = file.getElementsByTagName("xs:attributeGroup");
    for (let i = 0; i < attributeGroups.length; i++) {
      const group = attributeGroups[i];
      const groupName = group.getAttribute("name").split(":").pop();
      const attributeGroupRefName = attributeGroupRef.split(":").pop();

      if (groupName === attributeGroupRefName) {
        const elements = group.getElementsByTagName("xs:attribute");
        for (let j = 0; j < elements.length; j++) {
          const ele = elements[j];
          const newAtt = {};

          for (let k = 0; k < ele.attributes.length; k++) {
            const att = ele.attributes[k];
            newAtt[att.name] = att.nodeValue;
          }
          res.push(newAtt);
        }
      }
    }
    return res;
  }

  /**
   * Recursively Get all attributes for a type
   * @param type The type
   * @param seen The seen attribute list
   * @returns The list of found attributes
   */
  private getAllAttrForTypeRec(type: string, seen: any[]): any[] {
    let res = this.getAttrForType(type);
    for (let i = 0; i < this.namespaces.length; i++) {
      const namespace = this.namespaces[i];
      const value = this.complexTypeMap.get(namespace + ":" + type);

      if (value && value.name && type !== value.name.split(":").pop()) {
        const name = value.name.split(":").pop();
        seen.push(value.name);
        res = this.fuseList(res, this.getAllAttrForTypeRec(name, seen));

        const typeValue = value.type;
        for (let j = 0; j < typeValue.length; j++) {
          const seqType = typeValue[j];
          const typeName = seqType.type.split(":").pop();
          seen.push(typeName);
          const attributes = this.getAllAttrForTypeRec(typeName, seen);

          for (let k = 0; k < attributes.length; k++) {
            const attr = attributes[k];
            attr.name = seqType.name + "." + attr.name;
            res.push(attr);
          }
        }
      }
    }
    return res;
  }

  /**
   * Function that find the attributes of type entered
   * @param type : string base type
   */
  public getAttributesForType(type: string): any[] {
    if (type && type.includes(":")) {
      type = type.split(":")[1];
    }
    let properties;
    // tslint:disable-next-line: no-conditional-assignment
    if ((properties = this.knownProperties.get(type))) {
      // console.log(type);
    } else {
      properties = this.getAllAttrForTypeRec(type, []);
      this.knownProperties.set(type, properties);
    }
    return properties;
  }

  /**
   * Function that fuse two list removing the objects that are present multiple times
   * @param listA List A
   * @param listB List B
   * @returns listeC : A u B \ (A n B)
   */
  private fuseList(listA: any[], listB: any[]): any[] {
    for (let i = 0; i < listB.length; i++) {
      const ele = listB[i];
      if (!listA.find((e) => e.name === ele.name)) {
        listA.push(ele);
      }
    }
    return listA;
  }

  /**
   * Generate the units map
   */
  private generateUnitMap() {
    const doc = this.xsdFileMap.get("GenericADM.xsd");
    const docTypes = doc.getElementsByTagName("xs:attribute");

    for (let i = 0; i < docTypes.length; i++) {
      const dom = docTypes[i];
      const attribute = dom.getAttribute("name");
      const childNodes = dom.childNodes;

      for (let j = 0; j < childNodes.length; j++) {
        const childNode = childNodes[j];
        if (childNode.hasChildNodes()) {
          const elements = childNode.getElementsByTagName("xs:appinfo");

          for (let k = 0; k < elements.length; k++) {
            const element = elements[k];
            const unit = element.getElementsByTagName("unit")[0].getAttribute("value");
            this.unitMap.set(attribute, unit);
          }
        }
      }
    }
  }

  // /**
  //  * Get a key from a selector
  //  * @param selector The selector
  //  * @returns The key
  //  */
  // private getKeyBySelector(selector: string) {
  //   const res = [];
  //   for (const key of Array.from(this.xsdFileMap.keys())) {
  //     const file = this.xsdFileMap.get(key);
  //     const docTypes = file.getElementsByTagName("xs:selector");
  //     for (const dom of docTypes) {
  //       if (dom.getAttribute("xpath").includes(selector)) {
  //         const parentName = dom.parentNode.getAttribute("name");
  //         res.push({ name: parentName, type: "xs:string", use: "optional" });
  //       }
  //     }
  //   }
  //   return res;
  // }
}
