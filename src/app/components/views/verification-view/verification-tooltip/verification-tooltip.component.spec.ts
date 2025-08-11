import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationTooltipComponent } from './verification-tooltip.component';

describe('VerificationTooltipComponent', () => {
  let component: VerificationTooltipComponent;
  let fixture: ComponentFixture<VerificationTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
