import { TestBed, waitForAsync } from "@angular/core/testing";
import { AppComponent } from "./app.component";

import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesFactory } from "src/app/services/services/services.factory";

describe("AppComponent", () => {
  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [
  //       AppComponent
  //     ],
  //   }).compileComponents();
  // }));
  // let component: LogInPageComponent;
  // let userService: UserService;
  // let servicesService: ServicesService;
  // let servicesFactory: ServicesFactory;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [],
    }).compileComponents();
    // servicesService = TestBed.get(ServicesService);
    // servicesFactory = new ServicesFactory(servicesService);
    // userService = <UserService>servicesService.getService(ServicesConst.UserService);
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have built services'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.servicesService).toBeTruthy();
    expect(app.servicesService.getService(ServicesConst.MvcService)).toBeTruthy();
  });

  // it('should render title in a h1 tag', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to RIGHT-VIEWER !');
  // });
});
