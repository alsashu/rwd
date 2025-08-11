import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LayerService } from "src/app/modules/svg-diagram/services/layer/layer-service";

/**
 * Svg diagram layer panel component
 */
@Component({
  selector: "app-svg-diagram-layer-panel",
  templateUrl: "./svg-diagram-layer-panel.component.html",
  styleUrls: ["./svg-diagram-layer-panel.component.css"],
})
export class SvgDiagramLayerPanelComponent implements OnInit {
  @Input()
  public layerOptions: any = {};
  @Output()
  public layerChangedEvent = new EventEmitter();

  /**
   * Constructor
   */
  constructor() {}

  /**
   * on init
   */
  public ngOnInit(): void {}

  /**
   * On layer visisble click event
   * @param filter
   */
  public onLayerVisibleClick(filter: any) {
    filter.isVisible = !filter.isVisible;
    this.apply();
  }

  /**
   * Apply layers
   */
  public apply() {
    this.layerChangedEvent.emit(this.layerOptions);
  }

  /**
   * Get layer color box class
   */
  public getLayerColorBoxClass(layer: any): string {
    let res = "cbox ";
    if ([LayerService.layerTypes.redLayer].includes(layer.layerType)) {
      res = res + "cbox-color layer-red-" + layer.projectIndex;
    }
    if ([LayerService.layerTypes.yellowLayer].includes(layer.layerType)) {
      res = res + "cbox-color layer-yellow-" + layer.projectIndex;
    }
    return res;
  }
}
