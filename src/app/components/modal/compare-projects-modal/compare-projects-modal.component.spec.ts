import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareProjectsModalComponent } from './compare-projects-modal.component';

describe('CompareProjectsModalComponent', () => {
  let component: CompareProjectsModalComponent;
  let fixture: ComponentFixture<CompareProjectsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareProjectsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareProjectsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
