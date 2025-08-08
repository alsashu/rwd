import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { GenericTreeService } from "../../../components/app/generic-tree/generic-tree.service";
import { TreeMemoService } from "./tree-memo/tree-memo.service";

/**
 * Interface of TreeComponent
 */
export interface ITreeComponent {}

@Component({
  selector: "app-generic-tree",
  templateUrl: "./generic-tree.component.html",
  styleUrls: ["./generic-tree.component.css"],
})
/**
 * Generic tree component
 */
export class GenericTreeComponent implements OnInit, ITreeComponent {
  @ViewChild("defaultNodeContentTemplate")
  public defaultNodeContentTemplateRef: ElementRef;

  @ViewChild("defaultNodeCollapseTemplate")
  public defaultNodeCollapseTemplateRef: ElementRef;

  @Input()
  public nodes: any[] = [];

  @Input()
  public nodeContentTemplate?: TemplateRef<any> = null;

  public options: any = {
    nodeIndentInPx: 10,
    onSelectObjects: (objects: any[], value: any) => {},
    onNodeMouseDown: (event: any, node: any) => {},
    onNodeMouseDownDefaultCB: (event: any, node: any) => this.onNodeMouseDown(event, node),
    onNodeDoubleClick: (event: any, node: any) => {},
    onNodeDoubleClickDefaultCB: (event: any, node: any) => this.onNodeDoubleClick(event, node),
    onNodeRightClick: (event: any, node: any) => {},
    onNodeRightClickDefaultCB: (event: any, node: any) => this.onNodeRightClick(event, node),
    onDrop: (event: any, node: any) => {},
    getIsNodeDisplayed: (node: any): boolean => (this.options.filter ? this.options.filter(node) : true),
    getNodeContentTemplate: (node: any) => null,
    filter: (node: any): boolean => true,
    useCategoryTemplate: true,
  };

  public clickedNode: any;

  private lastNodeHover: any;

  public treeMemoService: TreeMemoService = new TreeMemoService();

  /**
   * Constructor
   * @param genericTreeService The generic Tree Service
   * @param changeDetectorRef The change Detector Ref
   * @param hostElement The host element
   */
  constructor(
    public genericTreeService: GenericTreeService,
    public changeDetectorRef: ChangeDetectorRef,
    private hostElement: ElementRef
  ) {}

  /**
   * ngOnInit
   */
  public ngOnInit() {}

  /**
   * Get the template used for displaying a node data content
   * @param node The node
   * @returns The node template
   */
  public getTheNodeContentTemplate(node: any): any {
    let res = this.options && this.options.getNodeContentTemplate ? this.options.getNodeContentTemplate(node) : null;
    res = res ? res : this.nodeContentTemplate;
    res = res ? res : this.defaultNodeContentTemplateRef;
    return res;
  }

  public getTheDefaultNodeCollapseTemplate() {
    return this.defaultNodeCollapseTemplateRef;
  }
  /**
   * Refresh the tree
   */
  public refresh() {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Is a node siplayed or not
   * @param node The node
   * @returns Boolean value
   */
  public getIsNodeDisplayed(node: any): boolean {
    return this.options.getIsNodeDisplayed(node);
  }

  public getNodeIconStyle(node: any): any {
    return { width: String(2 + node.indent * this.options.nodeIndentInPx) + "px" };
  }

  public getNodeLabel(node: any): string {
    return node ? (node.getLabel ? node.getLabel(node) : node.label) : "?";
  }

  public getNodeTooltip(node: any): string {
    return node ? (node.getTooltip ? node.getTooltip(node) : this.getNodeLabel(node)) : "?";
  }

  public getNodeIcon(node: any): any {
    let res = ["fas", "copy"];
    if (node) {
      // if (!node.nodesLoaded) {
      //   this.loadNodeChildren(node);
      // }
      if (node.nodes && node.nodes.length) {
        res = node.isCollapsed ? ["fas", "folder"] : ["fas", "folder-open"];
      }
    }
    return res;
  }

  public getNodeId(node: any): string {
    return node && node.key ? node.key : "?";
  }

  public getNodeClass(node: any): string {
    let res = "node ";
    if (node && node.object) {
      if (node.object.isSelected) {
        res += "node-selected ";
      }
      // if (node.isExpanded) {
      //   res += "node-expanded ";
      // }
      if (node.indent < 1 && this.options.useCategoryTemplate) {
        res += "node-category ";
      }
    }
    return res;
  }

  public getNodeLabelClass(node: any): string {
    let res = "node-label ";
    if (node && node.object) {
      //      if (node.object.isSelected) {
      //        res += "node-label-selected ";
      //      }
      if (node.object.isDeleted) {
        res += "node-label-deleted ";
      }
    }
    return res;
  }

  public getNodeStatusIcons(node: any): any[] {
    // tslint:disable-next-line: prefer-const
    let res = [];

    //   if (node.object.type == ModelConstService.VERSION_TYPE && this.modelService.getSelectedVersion() == node.object) {
    //     res.push({ icon: ["fas", "check"], });
    //   }
    // }

    return res;
  }

  public getStatusClass(si: any): string {
    return "status-badge " + si.class;
  }

  public getChildrenNodesLength(node: any): number {
    return node.nodes ? node.nodes.length : 0;
  }

  public getChildrenNodes(node: any): any[] {
    return node.nodes ? node.nodes : [];
  }

  public selectObjects(objects: any[], value: boolean = true) {
    this.options.onSelectObjects(objects, value);
  }

  public toggleCollapse(node: any) {
    if (node) {
      this.setNodeCollapse(node, !node.isCollapsed);
    }
  }

  private setNodeCollapse(node: any, value: boolean) {
    if (node) {
      node.isCollapsed = value;
      if (this.treeMemoService) {
        this.treeMemoService.updateNode(node);
      }
      if (!node.isCollapsed) {
        this.loadNodeChildren(node);
      }
    }
  }

  public loadNodeChildren(node: any) {
    if (node) {
      if (!node.nodesLoaded) {
        if (node.lazyLoadNodeCB) {
          node.lazyLoadNodeCB();
        }
      }
      if (node.nodes) {
        node.nodes.forEach((child: any) => {
          if (!child.nodesLoaded && child.lazyLoadNodeCB) {
            child.lazyLoadNodeCB();
          }
        });
      }
    }
  }

  public collapseAll(nodes: any[], value: boolean) {
    if (nodes === null) {
      nodes = this.nodes;
    }
    this.genericTreeService.forEachNodes(nodes, (node: any) => {
      //  if (!(!value && node.lazyLoadNodeCB)) {
      this.setNodeCollapse(node, value);
      // }
    });
  }

  // Events
  public onNodeMouseEnter(event: any, node: any) {
    if (node) {
      if (this.lastNodeHover && this.lastNodeHover !== node) {
        this.lastNodeHover.isNodeHover = false;
      }
      if (!node.isNodeHover) {
        node.isNodeHover = true;
        this.lastNodeHover = node;
      }
    }
    event.preventDefault();
    event.stopPropagation();
  }

  public onNodeMouseLeave(event: any, node: any) {
    if (node) {
      node.isNodeHover = false;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  public onIconClick(event: any, node: any) {
    console.log("onIconClick");
  }

  public onNodeIconClick(event: any, node: any) {
    this.toggleCollapse(node);
  }

  public setClickedNode(node: any, target: any) {
    this.clickedNode = node;
  }

  public onNodeMouseDown(event: any, node: any) {
    if (node && node.object) {
      this.setClickedNode(node, event.target);
      if (event.ctrlKey) {
        this.selectObjects([node.object], null);
      } else if (event.shiftKey) {
        this.selectObjects(this.genericTreeService.getNodesFromSelectedObjects(node));
      } else {
        // tslint:disable-next-line: no-bitwise
        if (event.buttons & 1 || node.object.isSelected !== true) {
          this.selectObjects([node.object]);
        }
      }
      this.options.onNodeMouseDown(event, node);
    }
  }

  public onNodeRightClick(event: any, node: any) {
    if (node && node.object) {
      this.setClickedNode(node, event.target);
      if (!node.object.isSelected) {
        this.selectObjects([node.object]);
      }
      this.options.onNodeRightClick(event, node);
    }
    event.preventDefault();
  }

  public onNodeDoubleClick(event: any, node: any) {
    this.toggleCollapse(node);
    this.options.onNodeDoubleClick(event, node);
  }

  public onDragStart(event: any, node: any) {
    if (node && node.object && node.object.type) {
      event.dataTransfer.setData(
        "text",
        JSON.stringify({ type: node.object.type, id: node.object.id, object: node.object })
      );
      event.stopPropagation();
    }
  }

  public onDragEnd(event: any, node: any) {}

  public onDragOver(event: any, node: any) {
    event.preventDefault();
  }

  public onDrop(event: any, node: any) {
    this.options.onDrop(event, node);
    event.preventDefault();
    event.stopPropagation();
  }

  public centerOnObject(so: any) {
    if (so) {
      if (so.id && so.type) {
        const node = this.genericTreeService
          .filterNodes(this.nodes, (node: any) => node.object === so)
          .find((n: any) => true);
        if (node) {
          const elementQueryList = this.hostElement.nativeElement.querySelectorAll("div[id='" + node.key + "']");
          if (elementQueryList.length) {
            this.scrollElementIntoView(elementQueryList[0]);
          }
          console.log(node, elementQueryList);
        }
      }
    }
  }

  public scrollElementIntoView(element: any) {
    try {
      if (element) {
        if (window["chrome"]) {
          // This is just to deal with a chrome bug
          element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        } else {
          // Firefox won't navigate to a group element.
          element = element.children().first()[0];
          element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}
