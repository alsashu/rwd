import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDefComponent } from './svg-def.component';

describe('SvgDefComponent', () => {
  let component: SvgDefComponent;
  let fixture: ComponentFixture<SvgDefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgDefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
