import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";

import { FormModalComponent } from "./form-modal.component";

describe("FormModalComponent", () => {
  let component: FormModalComponent;
  let fixture: ComponentFixture<FormModalComponent>;

  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormModalComponent],
      imports: [HttpClientModule],
      providers: [ServicesService, NgbActiveModal],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
