import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { AppService } from "./app.service";

describe("AppService", () => {
  let servicesService: IServicesService;
  let appService: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    appService = servicesService.getService(ServicesConst.AppService) as AppService;
  });

  it("should be created", () => {
    expect(appService).toBeTruthy();
  });
});
