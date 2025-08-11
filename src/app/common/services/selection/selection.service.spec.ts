import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesFactory } from "src/app/services/services/services.factory";
import { ServicesService } from "src/app/services/services/services.service";
import { ISelectionService } from "./selection.service";

describe("SelectionService", () => {
  let servicesService: IServicesService;
  let selectionService: ISelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    new ServicesFactory().buildOffLineServicesForTest(servicesService);
    selectionService = servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
  });

  it("should be created", () => {
    expect(selectionService).toBeTruthy();
  });
});
