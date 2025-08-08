import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { MessageService } from "./message.service";

describe("MessageService", () => {
  let servicesService: IServicesService;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    messageService = servicesService.getService(ServicesConst.MessageService) as MessageService;
  });

  it("should be created", () => {
    expect(messageService).toBeTruthy();
  });
});
