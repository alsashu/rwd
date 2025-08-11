import { Component, OnInit } from "@angular/core";
import { IViewService } from "../../../services/view/view.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";

@Component({
  selector: "app-workspace",
  templateUrl: "./workspace.component.html",
  styleUrls: ["./workspace.component.css"],
})
export class WorkspaceComponent implements OnInit {
  public viewService: IViewService;

  constructor(public servicesService: ServicesService) {
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
  }

  // public localStorageName = "right-viewer-ws";

  // private config = {
  //   disabled: false,
  //   gutterSize: 15,
  //   type: "split-area",
  //   splitDirection: "horizontal",
  //   splitAreas: [
  //     {
  //       visible: true,
  //       size: 100,
  //       type: "view-container",
  //       label: "Main",
  //       config: {
  //         isMainView: true,
  //         views: [],
  //       },
  //     },
  //   ],
  //   // isLeftPanelVisible: true,
  //   // isRightPanelVisible: true,
  //   // colSizes: [20, 40, 20],
  // };

  public ngOnInit() {
    // this.viewService.initViews(); TODO TEST
  }

  // public toggleLeftPanel() {
  //   let column = this.config.columns[0];
  //   let mainColumn = this.config.columns[1];
  //   column.visible = !column.visible;
  //   if (column.visible) {
  //     mainColumn.size -= column.size;
  //   } else {
  //     mainColumn.size += column.size;
  //   }
  // }

  // public onDragEndColumn(col: any, e: { gutterNum: number; sizes: Array<number> }) {
  //   this.config.colSizes = e.sizes;
  // }

  // public toggleRightPanel() {
  //   this.config.isRightPanelVisible = !this.config.isRightPanelVisible;
  // }
}
