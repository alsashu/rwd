import { TestBed } from "@angular/core/testing";
import { LogInPageComponent } from "./logIn-page.component";
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

describe("LogInPageComponent", () => {
  let component: LogInPageComponent;
  let servicesService: ServicesService;
  let userService: IUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogInPageComponent, MainPageComponent],
      imports: [
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
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
    const fixture = TestBed.createComponent(LogInPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("checkout method logIn should be called", () => {
    const fixture = TestBed.createComponent(LogInPageComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    const button = fixture.debugElement.nativeElement.querySelector("button");
    component.loginForm.setValue({ email: "test@alstom.com", password: "password" });
    spyOn(userService, "logIn");
    // fixture.detectChanges();
    button.click();
    expect(userService.logIn).toHaveBeenCalled();
  });

  it("checkout method loginClicked should be called", () => {
    const fixture = TestBed.createComponent(LogInPageComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    const button = fixture.debugElement.nativeElement.querySelector("button");
    component.loginForm.setValue({ email: "test@alstom.com", password: "password" });
    spyOn(component, "loginClicked");
    button.click();
    expect(component.loginClicked).toHaveBeenCalled();
  });

  it("checkout method should not be called", () => {
    const fixture = TestBed.createComponent(LogInPageComponent);
    component = fixture.debugElement.componentInstance;
    const button = fixture.debugElement.nativeElement.querySelector("button");
    spyOn(userService, "logIn");
    button.click();
    expect(userService.logIn).not.toHaveBeenCalled();
  });

  it("checkout useName and password of user", (done) => {
    const userData = { email: "test", password: "admin" };

    const fixture = TestBed.createComponent(LogInPageComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    const button = fixture.debugElement.nativeElement.querySelector("button");
    const serverText = fixture.debugElement.nativeElement.querySelector("#server-text");
    const setServerIPButton = fixture.debugElement.nativeElement.querySelector("#server-connect-btn");
    serverText.value = "http://localhost:3000";
    setServerIPButton.click();

    component.loginForm.setValue({ email: "test", password: "admin" });

    const spy = spyOn(userService, "logIn").and.returnValue(
      Promise.resolve({ userName: userData.email, password: userData.password })
    );
    fixture.detectChanges();
    button.click();
    spy.calls.mostRecent().returnValue.then(() => {
      expect(userService.currentUser.userName).toBe(userData.email);
      expect(userService.currentUser.password).toBe(userData.password);
      done();
    });
  });
});
