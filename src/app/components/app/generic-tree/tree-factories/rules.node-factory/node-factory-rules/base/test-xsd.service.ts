import { IModelConfigService } from "../../rules.node-factory";

export class TestXSDService implements IModelConfigService {
  modelConfigMap = new Map<string, any>([
    ["line", { extensions: ["eLine"] }],
    ["GenericADM:uPConvention", { extensions: ["tLineParameter"] }],
    ["extendedArea", { extensions: ["tExtendedArea"] }],
    ["track", { extensions: ["eTrack"] }],

    // OK
    ["signal", { extensions: ["tBasePlacedElement"] }],
    ["platformEdge", { extensions: ["tBasePlacedElement"] }],
    ["stopPost", { extensions: ["tBasePlacedElement"] }],
    ["trainDetector", { extensions: ["tBasePlacedElement"] }],
    ["switch", { extensions: ["eSwitch", "tBasePlacedElement"] }],
    ["GenericADM:scaleArea", { extensions: ["tScaleArea"] }],
    ["GenericADM:vertexWithKP", { extensions: ["tBasePlacedElement"] }],

    // ?
    ["baliseGroup", { extensions: ["tBasePlacedElement"] }],
    ["elementaryPath", { extensions: ["tBasePlacedElement"] }],
    ["GenericADM:elementaryPath", { extensions: ["tBasePlacedElement"] }],

    // NOK
    ["foulingPoint", { extensions: ["tBasePlacedElement"] }],
    ["trackCircuitBorder", { extensions: ["tBasePlacedElement"] }],
    ["bufferStop", { extensions: ["tBufferStop"] }],

    ["GenericADM:crossing", { extensions: ["tCrossing"] }],
    ["GenericADM:connectionData", { extensions: ["tConnectionData"] }],
    ["GenericADM:mileageChange", { extensions: ["tMileageChange"] }],

    ["GenericADM:pageArea", { extensions: ["tPageArea"] }],

    // logical objects
    ["GenericADM:route", { extensions: ["tElementWithRef"] }],
    ["GenericADM:switchPointAndPosition", { extensions: ["tElementWithRef"] }],
    ["GenericADM:tVDSection", { extensions: ["tElementWithRef"] }],

    // SysArt
    ["GenericADM:assembly", { extensions: ["tArchitectureElement"] }],
    ["GenericADM:cubicle", { extensions: ["tArchitectureElement"] }],
    ["GenericADM:equipment", { extensions: ["tArchitectureElement"] }],
    ["GenericADM:rack", { extensions: ["tArchitectureElement"] }],
    ["GenericADM:board", { extensions: ["tArchitectureElement"] }],

    ["GenericADM:physicalLink", { extensions: ["tPhysicalLink"] }],
    ["GenericADM:physicalLinkCharacteristic", { extensions: ["tPhysicalLinkCharacteristic"] }],
    ["GenericADM:backboneNetwork", { extensions: ["tBackboneNetwork"] }],
    ["GenericADM:backboneNetworkConnection", { extensions: ["tBackboneNetworkConnection"] }],

    ["GenericADM:connectionTypeDefinition", { extensions: ["tInterfaceElement"] }],
    ["GenericADM:equipmentPortTypeDefinition", { extensions: ["tInterfaceElement"] }],
    ["GenericADM:ethernetPortConfiguration", { extensions: ["tInterfaceElement"] }],
    ["GenericADM:interfaceConnection", { extensions: ["tInterfaceElement"] }],
    ["GenericADM:interfaceDefinition", { extensions: ["tInterfaceElement"] }],

    // ["GenericADM:equipmentTypeParametersDefinitions", { extensions: ["tEquipmentParametersElement"] }],
    ["GenericADM:MooNParametersDefinition", { extensions: ["tEquipmentParametersElement"] }],
  ]);

  public isTypeExtensionOfTypes(type: string, extensions: string[]): boolean {
    let res = extensions.includes(type);
    const typeData = this.modelConfigMap.get(type);
    if (!res && typeData) {
      extensions.forEach((extension) => {
        if (!res) {
          res = typeData.extensions.includes(extension);
        }
      });
    }
    return res;
  }
}
