import { Component, Input, OnInit } from "@angular/core";
import { ServicesService } from "src/app/services/services/services.service";

@Component({
  selector: "app-equipment-tree-item",
  templateUrl: "./equipment-tree-item.component.html",
  styleUrls: ["../../../app/generic-tree/generic-tree.component.css", "./equipment-tree-item.component.css"],
})
export class EquipmentTreeItemComponent implements OnInit {
  @Input()
  public node: any;

  @Input()
  public treeController: any;

  @Input()
  public options?: any = {};

  /**
   * Constructor
   * @param servicesService The ServicesService
   */
  constructor(public servicesService: ServicesService) {}

  /**
   * ngOnInit
   */
  public ngOnInit(): void {}
}
