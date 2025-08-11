import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { IApiService } from "../api/api.service";
import { testsUtils } from "src/test";

// import { ApiService } from './api.service';

describe("ApiService", () => {
  let servicesService: IServicesService;
  let apiService: IApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    apiService = servicesService.getService(ServicesConst.ApiService) as IApiService;
  });

  it("should be created", () => {
    expect(apiService).toBeTruthy();
  });
});
