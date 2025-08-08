import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";

import { UserService } from "./user.service";

describe("UserService", () => {
  let servicesService: IServicesService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    userService = servicesService.getService(ServicesConst.UserService) as UserService;
  });

  it("should be created", () => {
    expect(userService).toBeTruthy();
  });
});
