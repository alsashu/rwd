import { Component, Input, OnInit } from "@angular/core";
import { TestViewActionsService } from "./test-view-actions.service";

import { IViewComponent } from "../../../services/view/iview.component";
import { IViewService } from "../../../services/view/view.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";

@Component({
  selector: "app-test-view",
  templateUrl: "./test-view.component.html",
  styleUrls: ["./test-view.component.css"],
})
export class TestViewComponent implements OnInit, IViewComponent {
  @Input() public config;

  public viewActionsService = new TestViewActionsService(this);

  public viewService: IViewService;

  constructor(public servicesService: ServicesService) {
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
  }

  public ngOnInit() {
    //    this.config.viewComponent = this;
  }

  public isThisView(view: any): boolean {
    return view.type === "test-view" /*&& view.config.scriptId == this.config.scriptId*/;
  }
}
