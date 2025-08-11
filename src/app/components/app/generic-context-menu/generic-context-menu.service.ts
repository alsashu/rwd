import { Injectable } from "@angular/core";
import { ContextMenuService } from "ngx-contextmenu";

@Injectable({
  providedIn: "root",
})
export class GenericContextMenuService {
  public constructor(private contextMenuService: ContextMenuService) {}

  public getSubMenuFromId(parent: any, subMenuId: string) {
    let res = null;
    if (subMenuId && parent && parent.contextMenus && parent.contextMenus.forEach) {
      res = parent.contextMenus.find((cm: any) => cm.menuClass === subMenuId);
    }
    return res;
  }

  public getSubMenu(parent: any, action: any) {
    let res = null;
    if (parent && action && action.subMenuId) {
      res = this.getSubMenuFromId(parent, action.subMenuId);
    }
    return res;
  }

  public showContextMenu(contextMenu: any, event: any, item: any, target: any = null) {
    this.contextMenuService.show.next({
      anchorElement: target || event.target,
      contextMenu,
      event,
      item,
    });
  }
}
