import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { WebsocketService } from "./websocket.service";

describe("WebsocketService", () => {
  let servicesService: IServicesService;
  let websocketService: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    websocketService = servicesService.getService(ServicesConst.WebsocketService) as WebsocketService;
  });

  it("should be created", () => {
    expect(websocketService).toBeTruthy();
  });
});
