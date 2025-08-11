import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
import { ContextMenuComponent, ContextMenuService } from "ngx-contextmenu";

@Component({
  selector: "app-generic-context-menu",
  templateUrl: "./generic-context-menu.component.html",
  styleUrls: ["./generic-context-menu.component.css"],
})
export class GenericContextMenuComponent implements OnInit {
  @ViewChild("genericContextMenu", { static: false })
  public contextMenu: ContextMenuComponent;
  @ViewChildren(ContextMenuComponent)
  public contextMenus: QueryList<ContextMenuComponent>;
  @Input()
  public parent: any;
  @Input()
  public contextMenuActions: any;

  public constructor(private contextMenuService: ContextMenuService) {}

  public ngOnInit() {}

  public getContextMenuActions() {
    let res = this.contextMenuActions;
    if (!res && this.parent && this.parent.getContextMenuActions) {
      res = this.parent.getContextMenuActions();
    }
    if (!res) {
      res = [];
    }
    return res;
  }

  public showContextMenu(event: any, item: any, target: any = null) {
    this.contextMenuService.show.next({
      anchorElement: target || event.target,
      contextMenu: this.contextMenu,
      event,
      item,
    });
  }

  public getActionHtml(action: any): string {
    let res = action ? action.html(action) : "";
    if (this.parent && this.parent.translateFromMap) {
      res = this.parent.translateFromMap(res);
    }
    return res;
  }

  public getSubMenuActions(parent = null, list: any[] = []) {
    parent = parent || this.getContextMenuActions();
    if (parent && parent.forEach) {
      parent.forEach((ma: any) => {
        if (ma.subMenuId && ma.contextMenuActions) {
          list.push(ma);
          this.getSubMenuActions(ma.contextMenuActions, list);
        }
      });
    }
    return list;
  }

  public getSubMenu(action: any) {
    let res = null;
    if (action && action.subMenuId) {
      res = this.getSubMenuFromId(action.subMenuId);
    }
    return res;
  }

  public getSubMenuFromId(subMenuId: any) {
    let res = null;
    if (subMenuId && this.contextMenus && this.contextMenus.forEach) {
      this.contextMenus.forEach((cm: any) => {
        if (cm.menuClass === subMenuId) {
          res = cm;
        }
      });
    }
    if (!res && subMenuId && this.parent.contextMenus) {
      this.parent.contextMenus.forEach((cm: any) => {
        if (cm.menuClass === subMenuId) {
          res = cm;
        }
      });
    }
    return res;
  }

  // public closeContextMenu() {
  //   this.contextMenuService.close.next({
  //     eventType: "cancel",
  //     event: null,
  //   });
  // }
}
