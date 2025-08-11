import { TestBed } from "@angular/core/testing";
import { IUserService } from "src/app/services/user/user.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesFactory } from "src/app/services/services/services.factory";
import { MainPageComponent } from "../main-page/main-page.component";
import { testsUtils } from "src/test";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { UserInfoPageComponent } from "./userInfo-page.component";

describe("UserInfoPageComponent", () => {
  let component: UserInfoPageComponent;
  let servicesService: ServicesService;
  let userService: IUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoPageComponent, MainPageComponent],
      imports: [
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        // RouterTestingModule,
        RouterTestingModule.withRoutes([{ path: "main", component: MainPageComponent }]),
      ],
      providers: [ServicesService, ServicesFactory],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);
    const library = TestBed.get(FaIconLibrary);
    library.addIconPacks(fas);
    library.addIconPacks(far);
    userService = servicesService.getService(ServicesConst.UserService) as IUserService;
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(UserInfoPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
