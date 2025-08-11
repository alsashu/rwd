import { HttpClientModule } from "@angular/common/http";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { SvgDefComponent } from "src/app/modules/diagram/components/svg-def/svg-def.component";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";
import { MessagePopupComponent } from "../../app/message-popup/message-popup.component";
import { NavbarComponent } from "../../app/navbar/navbar.component";
import { StatusBarComponent } from "../../app/status-bar/status-bar.component";
import { WorkspaceComponent } from "../../app/workspace/workspace.component";
import { MainPageComponent } from "./main-page.component";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ContextMenuModule } from "ngx-contextmenu";
import { ViewPanelComponent } from "../../app/view-panel/view-panel.component";
import { AngularSplitModule } from "angular-split";
import { ViewContainerComponent } from "../../app/view-container/view-container.component";
import { GenericContextMenuComponent } from "../../app/generic-context-menu/generic-context-menu.component";
import { ModelViewComponent } from "../../views/model-view/model-view.component";
import { DiagramComponent } from "src/app/modules/diagram/components/diagram/diagram.component";
import { DiagramLayerPanelComponent } from "src/app/modules/diagram/components/panels/diagram-layer-panel/diagram-layer-panel.component";
import { SvgDiagramTooltipComponent } from "src/app/modules/svg-diagram/components/svg-diagram-tooltip/svg-diagram-tooltip.component";
import { SvgDiagramComponent } from "src/app/modules/svg-diagram/components/svg-diagram/svg-diagram.component";
import { GenericToolBarComponent } from "../../app/generic-tool-bar/generic-tool-bar.component";
import { GenericTreeComponent } from "../../app/generic-tree/generic-tree.component";
import { PropertiesComponent } from "../../app/properties/properties.component";
import { ToolTipComponent } from "../../app/tool-tip/tool-tip.component";
import { TopButtonComponent } from "../../app/top-button/top-button.component";
import { TopPanelComponent } from "../../app/top-panel/top-panel.component";
import { TreeTableComponent } from "../../app/tree-table/tree-table.component";
import { GraphicViewComponent } from "../../views/graphic-view/graphic-view.component";
import { LibraryViewComponent } from "../../views/library-view/library-view.component";
import { MessageViewComponent } from "../../views/message-view/message-view.component";
import { PropertiesViewComponent } from "../../views/properties-view/properties-view.component";
import { SearchTreeItemComponent } from "../../views/search-view/search-tree-item/search-tree-item.component";
import { SearchViewComponent } from "../../views/search-view/search-view.component";
import { SvgViewComponent } from "../../views/svg-view/svg-view.component";
import { TableTreeItemComponent } from "../../views/table-view/table-tree-item/table-tree-item.component";
import { TableViewComponent } from "../../views/table-view/table-view.component";
import { TestViewComponent } from "../../views/test-view/test-view.component";
import { TextViewComponent } from "../../views/text-view/text-view.component";
import { VerificationTreeItemComponent } from "../../views/verification-view/verification-tree-item/verification-tree-item.component";
import { VerificationViewComponent } from "../../views/verification-view/verification-view.component";
// import { WikiTreeComponent } from "../../views/wiki-view/wiki-tree.component";
import { WikiViewComponent } from "../../views/wiki-view/wiki-view.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AceEditorModule } from "ng2-ace-editor";
import { AppRoutingModule } from "src/app/app-routing.module";

describe("", () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let nativeElement: any;
  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainPageComponent,

        NavbarComponent,
        WorkspaceComponent,
        ViewContainerComponent,
        ViewPanelComponent,
        GenericContextMenuComponent,
        GenericToolBarComponent,
        GenericTreeComponent,
        TreeTableComponent,
        ToolTipComponent,
        PropertiesComponent,
        MessagePopupComponent,
        StatusBarComponent,
        TopButtonComponent,
        TopPanelComponent,

        ModelViewComponent,
        PropertiesViewComponent,
        TextViewComponent,
        LibraryViewComponent,
        TestViewComponent,
        WikiViewComponent,
        // RuleViewComponent,
        MessageViewComponent,
        VerificationViewComponent,
        VerificationTreeItemComponent,
        TableViewComponent,
        TableTreeItemComponent,
        SearchViewComponent,
        SearchTreeItemComponent,
        GraphicViewComponent,
        DiagramComponent,
        SvgDefComponent,
        DiagramLayerPanelComponent,
        SvgViewComponent,
        SvgDiagramComponent,
        SvgDiagramTooltipComponent,
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSplitModule.forRoot(),
        ContextMenuModule.forRoot({
          useBootstrap4: true,
        }),
        AceEditorModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: "main", component: MainPageComponent }]),
        NgxUiLoaderModule,
      ],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);
    const library = TestBed.get(FaIconLibrary);
    library.addIconPacks(fas);
    library.addIconPacks(far);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    // fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it(`should contain a navbar, workspace, message popup`, () => {
    expect(nativeElement.querySelector(".navbar-brand")).toBeTruthy();
    expect(nativeElement.querySelector(".workspace")).toBeTruthy();
  });
});
