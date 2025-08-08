import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { ModalViewService } from "./modal-view.service";

describe("ModalViewService", () => {
  let servicesService: IServicesService;
  let modalViewService: ModalViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    modalViewService = servicesService.getService(ServicesConst.ModalViewService) as ModalViewService;
  });

  it("should be created", () => {
    expect(modalViewService).toBeTruthy();
  });
});
