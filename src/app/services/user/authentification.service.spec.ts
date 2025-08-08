import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { testsUtils } from "src/test";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ServicesService } from "../services/services.service";
import { AuthentificationService } from "./authentification.service";

describe("AuthentificationService", () => {
  let servicesService: IServicesService;
  let authentificationService: AuthentificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    authentificationService = servicesService.getService(
      ServicesConst.AuthentificationService
    ) as AuthentificationService;
  });

  it("should be created", () => {
    expect(authentificationService).toBeTruthy();
  });

  it("should produceCodeChallenge", () => {
    const cc = authentificationService.produceCodeChallenge();
    expect(cc).not.toBeNull();
  });
});
