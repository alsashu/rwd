import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ContextMenuModule } from "ngx-contextmenu";
import { GenericContextMenuComponent } from "src/app/components/app/generic-context-menu/generic-context-menu.component";
import { GenericTreeComponent } from "src/app/components/app/generic-tree/generic-tree.component";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";

import { SearchTreeItemComponent } from "./search-tree-item.component";

describe("SearchTreeItemComponent", () => {
  let component: SearchTreeItemComponent;
  let fixture: ComponentFixture<SearchTreeItemComponent>;
  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchTreeItemComponent, GenericTreeComponent, GenericContextMenuComponent],
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
    fixture = TestBed.createComponent(SearchTreeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
