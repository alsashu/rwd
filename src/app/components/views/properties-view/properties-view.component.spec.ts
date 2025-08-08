import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ContextMenuModule } from "ngx-contextmenu";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";

import { PropertiesViewComponent } from "./properties-view.component";

describe("PropertiesViewComponent", () => {
  let component: PropertiesViewComponent;
  let fixture: ComponentFixture<PropertiesViewComponent>;

  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesViewComponent],
      imports: [
        HttpClientModule,
        ContextMenuModule.forRoot({
          useBootstrap4: true,
        }),
      ],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesViewComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
