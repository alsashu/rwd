import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDiagramTooltipComponent } from './svg-diagram-tooltip.component';

describe('SvgDiagramTooltipComponent', () => {
  let component: SvgDiagramTooltipComponent;
  let fixture: ComponentFixture<SvgDiagramTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgDiagramTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgDiagramTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
