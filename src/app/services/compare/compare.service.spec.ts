import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { CompareService } from "./compare.service";

describe("CompareService", () => {
  let servicesService: IServicesService;
  let searchService: CompareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    searchService = servicesService.getService(ServicesConst.CompareService) as CompareService;
  });

  it("should be created", () => {
    expect(searchService).toBeTruthy();
  });
});
