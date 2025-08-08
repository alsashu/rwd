import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { ViewService } from "./view.service";

describe("ViewService", () => {
  let servicesService: IServicesService;
  let viewService: ViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    viewService = servicesService.getService(ServicesConst.ViewService) as ViewService;
  });

  it("should be created", () => {
    expect(viewService).toBeTruthy();
  });
});
