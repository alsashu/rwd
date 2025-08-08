import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-diagram-layer-panel",
  templateUrl: "./diagram-layer-panel.component.html",
  styleUrls: ["./diagram-layer-panel.component.css"],
})
export class DiagramLayerPanelComponent implements OnInit {
  @Input()
  public layerOptions: any = {};
  @Output()
  public layerChangedEvent = new EventEmitter();
  @Output()
  public closeEvent = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onLayerVisibleClick(filter) {
    filter.isVisible = !filter.isVisible;
    this.apply();
  }

  onLayerEnabledClick(filter) {
    filter.isEnabled = !filter.isEnabled;
    this.apply();
  }

  onOtherFilterVisibleClick(filter) {
    filter.isVisible = !filter.isVisible;
    if (filter.attribute) {
      this.layerOptions[filter.attribute] = filter.isVisible;
    }
    this.apply();
  }

  apply() {
    this.layerChangedEvent.emit(this.layerOptions);
  }

  close() {
    this.closeEvent.emit(this);
  }
}
