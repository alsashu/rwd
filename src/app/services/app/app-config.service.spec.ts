import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";

import { AppConfigService } from "./app-config.service";

describe("AppConfigService", () => {
  let servicesService: IServicesService;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    appConfigService = servicesService.getService(ServicesConst.AppConfigService) as AppConfigService;
  });

  it("should be created", () => {
    expect(appConfigService).toBeTruthy();
  });
});
