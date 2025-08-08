import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ContextMenuModule } from "ngx-contextmenu";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";

import { ModelViewComponent } from "./model-view.component";

describe("ModelViewComponent", () => {
  let component: ModelViewComponent;
  let fixture: ComponentFixture<ModelViewComponent>;

  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelViewComponent, GenericTreeComponent, GenericContextMenuComponent],
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
    fixture = TestBed.createComponent(ModelViewComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    // fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
