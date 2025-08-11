import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { SearchService } from "./search.service";

describe("SearchService", () => {
  let servicesService: IServicesService;
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    searchService = servicesService.getService(ServicesConst.SearchService) as SearchService;
  });

  it("should be created", () => {
    expect(searchService).toBeTruthy();
  });
});
