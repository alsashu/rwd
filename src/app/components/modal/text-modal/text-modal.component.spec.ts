import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesService } from "src/app/services/services/services.service";
import { testsUtils } from "src/test";

import { TextModalComponent } from "./text-modal.component";

describe("TextModalComponent", () => {
  let component: TextModalComponent;
  let fixture: ComponentFixture<TextModalComponent>;

  let servicesService: IServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextModalComponent],
      imports: [HttpClientModule],
      providers: [ServicesService, NgbActiveModal],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
