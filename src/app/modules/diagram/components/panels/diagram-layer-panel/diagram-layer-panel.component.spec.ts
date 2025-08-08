import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DiagramLayerPanelComponent } from "./diagram-layer-panel.component";

describe("LayerPanelComponent", () => {
  let component: DiagramLayerPanelComponent;
  let fixture: ComponentFixture<DiagramLayerPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiagramLayerPanelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramLayerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
