import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { LibraryService } from "./library.service";

describe("LibraryService", () => {
  let servicesService: IServicesService;
  let libraryService: LibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    libraryService = servicesService.getService(ServicesConst.LibraryService) as LibraryService;
  });

  it("should be created", () => {
    expect(libraryService).toBeTruthy();
  });
});
