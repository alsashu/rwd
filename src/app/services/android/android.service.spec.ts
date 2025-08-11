import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { AndroidService } from "./android.service";

describe("CordovaService", () => {
  let servicesService: IServicesService;
  let cordovaService: AndroidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    cordovaService = servicesService.getService(ServicesConst.AndroidService) as AndroidService;
  });

  it("should be created", () => {
    expect(cordovaService).toBeTruthy();
  });
});
