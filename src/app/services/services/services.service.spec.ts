import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { ServicesService } from "./services.service";

describe("ServicesService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    // servicesService = TestBed.get(ServicesService);
    // new ServicesFactory().buildOffLineServicesForTest(servicesService);
    // selectionService = servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
  });

  it("should be created", () => {
    const service: ServicesService = TestBed.get(ServicesService);
    expect(service).toBeTruthy();
  });
});
