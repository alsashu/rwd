import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ServicesConst } from "../services/services.const";
import { ServicesFactory } from "../services/services.factory";
import { ServicesService } from "../services/services.service";
import { TranslateConst } from "./translate.const";

import { TranslateService } from "./translate.service";

describe("TranslateService", () => {
  let translateService: TranslateService;
  let servicesService: ServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule],
      providers: [ServicesService, ServicesFactory],
    }).compileComponents();
    servicesService = TestBed.inject(ServicesService);
    new ServicesFactory().buildOffLineServicesForTest(servicesService);
    translateService = servicesService.getService(ServicesConst.TranslateService) as TranslateService;
  });

  it("should be created", () => {
    expect(translateService).toBeTruthy();
  });

  it("should return the properties domain", () => {
    const res = translateService.getDomain(TranslateConst.domains.properties);
    expect(res).toEqual(TranslateConst.properties);
  });

  it("should return an empty object", () => {
    const res = translateService.getDomain("inconnu");
    expect(res).toEqual({});
  });

  it("should return the translation of the given field", () => {
    const res = translateService.translateFromDomains(TranslateConst.domains.properties, "id");
    expect(res).toEqual("id");
  });

  it("should return the translation of the given field", () => {
    const res = translateService.translateFromDomains(TranslateConst.domains.properties, "width");
    expect(res).toEqual("width");
  });

  it("should return the basic value", () => {
    const unknown = "unknown";
    const res = translateService.translateFromDomains(TranslateConst.domains.properties, unknown);
    expect(res).toEqual(unknown);
  });
});
