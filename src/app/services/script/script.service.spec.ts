import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { ScriptService } from "./script.service";

describe("ScriptService", () => {
  let servicesService: IServicesService;
  let scriptService: ScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    scriptService = servicesService.getService(ServicesConst.ScriptService) as ScriptService;
  });

  it("should be created", () => {
    expect(scriptService).toBeTruthy();
  });
});
