import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { MvcService } from "./mvc.service";

describe("MvcService", () => {
  let servicesService: IServicesService;
  let mvcService: MvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    mvcService = servicesService.getService(ServicesConst.MvcService) as MvcService;
  });

  it("should be created", () => {
    expect(mvcService).toBeTruthy();
  });
});
