import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { ContextMenuModule } from "ngx-contextmenu";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { GenericToolBarComponent } from "../../app/generic-tool-bar/generic-tool-bar.component";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";
import { ToolTipComponent } from "../../app/tool-tip/tool-tip.component";
import { TableViewComponent } from "./table-view.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableTreeItemComponent } from "./table-tree-item/table-tree-item.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { AngularSplitModule } from "angular-split";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { TreeTableComponent } from "../../app/tree-table/tree-table.component";
import { MainPageComponent } from "../../pages/main-page/main-page.component";

describe("TableViewComponent", () => {
  let component: TableViewComponent;
  let fixture: ComponentFixture<TableViewComponent>;
  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableViewComponent,
        TableTreeItemComponent,

        GenericContextMenuComponent,
        GenericToolBarComponent,
        GenericTreeComponent,
        TreeTableComponent,
        ToolTipComponent,
      ],
      imports: [
        BrowserModule,
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSplitModule.forRoot(),
        ContextMenuModule.forRoot({
          useBootstrap4: true,
        }),
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "main", component: MainPageComponent }]),
        NgxUiLoaderModule,
      ],
      providers: [ServicesService, FaIconLibrary],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);
    const library = TestBed.get(FaIconLibrary);
    library.addIconPacks(fas);
    library.addIconPacks(far);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableViewComponent);
    component = fixture.componentInstance;
    // component.ngOnInit();
    // component.ngAfterViewInit();
    // fixture.detectChanges();
    // fixture.whenStable();
  });

  it("should create", fakeAsync(() => {
    // const spyOnInit = spyOn(component.mainContextMenuComponent, "init").and.callThrough();
    // console.log("before tick");
    // tick(499);
    // expect(spyOnInit).toHaveBeenCalled();
    // console.log("fixture.detectChanges");
    // fixture.detectChanges();
    expect(component).toBeTruthy();
  }));
});
