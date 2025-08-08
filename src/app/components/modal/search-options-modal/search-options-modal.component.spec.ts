import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";

import { SearchOptionsModalComponent } from "./search-options-modal.component";

describe("SearchOptionsModalComponent", () => {
  let component: SearchOptionsModalComponent;
  let fixture: ComponentFixture<SearchOptionsModalComponent>;

  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchOptionsModalComponent],
      imports: [HttpClientModule],
      providers: [ServicesService, NgbActiveModal],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
