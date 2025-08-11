import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { AndroidFSService } from "./android.fs.service";

describe("AndroidFSService", () => {
  let servicesService: IServicesService;
  let androidFSService: AndroidFSService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    androidFSService = servicesService.getService(ServicesConst.AndroidFSService) as AndroidFSService;
  });

  it("should be created", () => {
    expect(androidFSService).toBeTruthy();
  });
});
