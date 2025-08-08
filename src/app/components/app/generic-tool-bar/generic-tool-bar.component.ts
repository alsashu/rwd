import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-generic-tool-bar",
  templateUrl: "./generic-tool-bar.component.html",
  styleUrls: ["./generic-tool-bar.component.css"],
})
export class GenericToolBarComponent implements OnInit {
  @Input()
  public parent: any;

  @Input()
  public toolBarActions: any = {
    type: "tool-bar",
    actions: [],
  };

  /*
  toolBarActionsTest = {
    type: "tool-bar",
    actions: [
      {
        type: "btn-group",
        visible: (item) => true,
        actions: [
          {
            type: "button",
            html: (item) => "Test 1",
            icon: (item) => "eraser",
            click: (event, item) => this.parent.onBtnTestClick(item),
            active: (item) => false,
            enabled: (item) => true,
            visible: (item) => true,
          },
          {
            type: "button",
            html: (item) => "Test 2",
            icon: (item) => "save",
            click: (event, item) => this.parent.onBtnTestClick(item),
            active: (item) => false,
            enabled: (item) => true,
            visible: (item) => true,
          },
        ],
      },
      {
        type: "dropdown",
        id: "ddTest1",
        html: (item) => "Test",
        icon: (item) => "cog",
        enabled: (item) => true,
        visible: (item) => true,

        actions: [
          {
            type: "dropdown-item",
            html: (item) => "Test 1",
            click: (event, item) => this.parent.onBtnTestClick(item),
            active: (item) => false,
            enabled: (item) => true,
            visible: (item) => true,
          },
          {
            type: "divider",
            visible: (item) => true,
          },
          {
            type: "dropdown-item",
            html: (item) => "Test 2",
            click: (event, item) => this.parent.onBtnTestClick(item),
            active: (item) => false,
            enabled: (item) => true,
            visible: (item) => true,
          },
        ],
      },
    ],
  };
*/
  constructor() {}

  public ngOnInit() {}

  public getRootAction() {
    return this.toolBarActions;
  }

  public getGroupClass(action: any): string {
    let res = "btn-group btn-group-xs mr-1 ";
    if (action && action.class) {
      res += action.class(action);
    }
    return res;
  }

  public getActionHtml(action: any): string {
    let res = action ? action.html(action) : "";
    if (this.parent && this.parent.translateFromMap) {
      res = this.parent.translateFromMap(res);
    }
    return res;
  }
}
