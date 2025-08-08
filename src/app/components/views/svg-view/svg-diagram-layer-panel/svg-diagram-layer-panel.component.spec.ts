import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDiagramLayerPanelComponent } from './svg-diagram-layer-panel.component';

describe('SvgDiagramLayerPanelComponent', () => {
  let component: SvgDiagramLayerPanelComponent;
  let fixture: ComponentFixture<SvgDiagramLayerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgDiagramLayerPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgDiagramLayerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
