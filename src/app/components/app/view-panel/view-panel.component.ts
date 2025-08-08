import { Component, OnInit, Input } from "@angular/core";
import { IViewService } from "../../../services/view/view.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";

@Component({
  selector: "app-view-panel",
  templateUrl: "./view-panel.component.html",
  styleUrls: ["./view-panel.component.css"],
})
export class ViewPanelComponent implements OnInit {
  @Input()
  public position: string;
  @Input()
  public config: any;
  @Input()
  public splitArea: any;

  public viewService: IViewService;

  public constructor(public servicesService: ServicesService) {
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
  }

  public ngOnInit() {}

  public toggleRow(row: any) {
    this.viewService.toggleRow(row);
  }

  public isOrientedVertical(): boolean {
    return this.position === "left" || this.position === "right";
  }

  public isRightPanel(): boolean {
    return this.position === "right";
  }
}
