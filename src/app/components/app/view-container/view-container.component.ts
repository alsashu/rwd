import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { IViewService } from "../../../services/view/view.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { IView } from "src/app/services/view/iview";
import { GenericContextMenuComponent } from "../generic-context-menu/generic-context-menu.component";

@Component({
  selector: "app-view-container",
  templateUrl: "./view-container.component.html",
  styleUrls: ["./view-container.component.css"],
})
export class ViewContainerComponent implements OnInit {
  @ViewChild(GenericContextMenuComponent, { static: true })
  public genericContextMenuComponent: GenericContextMenuComponent;

  @Input()
  public splitArea: any;
  @Input()
  public multiView: boolean;
  @Input()
  public type: string;
  @Input()
  public title: string;
  @Input()
  public config: any;

  public viewService: IViewService;

  public contextMenuActions = [
    {
      html: (item: any) => "Split view horizontaly",
      click: (item: any) => {
        this.viewService.splitView(this.splitArea, item, true);
      },
      enabled: (item: any) => true,
      visible: (item: any) => true,
    },
    {
      html: (item: any) => "Split view verticaly",
      click: (item: any) => {
        this.viewService.splitView(this.splitArea, item, false);
      },
      enabled: (item: any) => true,
      visible: (item: any) => true,
    },
    {
      divider: true,
      visible: true,
    },
    {
      html: (item: any) => "Close all main views",
      click: (item: any) => {
        this.viewService.closeMainViews();
      },
      enabled: (item: any) => true,
      visible: (item: any) => true,
    },
  ];

  constructor(public servicesService: ServicesService) {
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
  }

  public ngOnInit() {
    if (this.config) {
      this.config.viewComponent = this;
      if (this.config.views) {
        this.selectView(this.config.views[0]);
      }
    }
  }

  public selectView(view: IView) {
    if (this.config) {
      this.config.selectedView = view;
      this.viewService.selectView(this.config, this.config.selectedView);
    }
  }

  public closeView(view: IView) {
    this.viewService.closeView(this.splitArea, view);
  }

  public onDragStart(event: any, view: IView) {
    console.log("onDragStart", event, view);
    if (view && view.type) {
      try {
        event.dataTransfer.setData(
          "text",
          JSON.stringify({
            type: "view",
            id: view.type,
            viewId: view.id,
            // object: view,
            splitAreaId: this.splitArea ? this.splitArea.id : null,
          })
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  public onDragOver(event: any) {
    event.preventDefault();
  }

  public onDragEnd(event: any, view: IView) {
    event.preventDefault();
  }

  public onDrop(event: any, view: IView = null) {
    event.preventDefault();
    try {
      if (event.dataTransfer.types.includes("text/plain")) {
        const dndTextData = event.dataTransfer.getData("text");
        if (dndTextData && dndTextData !== "") {
          const dndData = JSON.parse(dndTextData);
          if (dndData.type === "view") {
            console.log("onDrop", event, view, dndData);
            const orgSplitAreaId = dndData.splitAreaId;
            const orgViewId = dndData.viewId;
            // const dndView = dndData.object;
            // const orgView = this.config.views.find((v: IView) => v.type === dndView.type && v.title === dndView.title);
            // this.viewService.moveView(orgView, view, this.config.views);

            this.viewService.dndView(orgSplitAreaId, orgViewId, this.splitArea, view);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  public onRightClick(event: any, view: any = null) {
    if (this.splitArea.isMainViewContainer) {
      this.genericContextMenuComponent.showContextMenu(event, view);
    }
    event.preventDefault();
    event.stopPropagation();
  }
}
