import { TestBed } from "@angular/core/testing";

import { HttpClientModule } from "@angular/common/http";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { MetaModelService } from "./meta-model.service";

describe("MetaModelService", () => {
  let servicesService: IServicesService;
  let metaModelService: MetaModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);
    metaModelService = servicesService.getService(ServicesConst.MetaModelService) as MetaModelService;
    // const url =
    //   "file:///C:/Users/201000490/Documents/Projets/Alstom_argos/right-viewer/right-viewer/src/assets/file_test.xsd";
    // console.log(url);
    // metaModelService.loadXsdModelFromFile(url);
    metaModelService.loadXsdModel(testsUtils.argosTestProject1Xsd);
  });

  it("should create the service", () => {
    expect(metaModelService).toBeTruthy();
  });

  it("should verifiy some type rules", () => {
    // console.log(metaModelService.xsdFileMap);
    // metaModelService.doTests_isExtensionOf();
    expect(metaModelService.isTypeExtensionOf("eLine", "tElementWithIDAndName")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("eLine", "tLine")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tPlacedElement", "tElementWithIDAndName")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tPlacedElement", "tBasePlacedElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tCrossSection", "tBasePlacedElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("eTrack", "tTrack")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("track", "eTrack")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("switch", "eSwitch")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("bufferStop", "tBufferStop")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("crossing", "tCrossing")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("mileageChange", "tMileageChange")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("scaleArea", "tScaleArea")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("GenericADM:route", "tElementWithRef")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("switchPointAndPosition", "tElementWithRef")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tVDSection", "tElementWithRef")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("assembly", "tArchitectureElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tAssembly", "tArchitectureElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tCubicle", "tArchitectureElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tLRU", "tArchitectureElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tEquipmentRoom", "tArchitectureElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tSpecificPunctualObject", "tBasePlacedElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("pageArea", "tPageArea")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tSpecificPunctualObject", "tBasePlacedElement")).toBeTruthy();
  });

  it("should verifiy some ARGOS type rules", () => {
    expect(metaModelService.isTypeExtensionOf("ARGOS:commutateurAU", "tBasePlacedElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("ARGOS:tCommutateurAU", "tBasePlacedElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("tCommutateurAU", "tBasePlacedElement")).toBeTruthy();
    expect(metaModelService.isTypeExtensionOf("ARGOS:commutateurZepV", "tBasePlacedElement")).toBeTruthy();
  });
});
