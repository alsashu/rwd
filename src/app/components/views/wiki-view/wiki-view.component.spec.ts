import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ContextMenuModule } from "ngx-contextmenu";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";

import { WikiViewComponent } from "./wiki-view.component";

describe("WikiViewComponent", () => {
  let component: WikiViewComponent;
  let fixture: ComponentFixture<WikiViewComponent>;

  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WikiViewComponent, GenericTreeComponent, GenericContextMenuComponent],
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
    fixture = TestBed.createComponent(WikiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
