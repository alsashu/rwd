import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-tree-table",
  templateUrl: "./tree-table.component.html",
  styleUrls: ["./tree-table.component.css"],
})
export class TreeTableComponent implements OnInit {
  @ViewChild("tipContent", { static: false }) tipContentComponent;

  @Input() nodes: any[] = [];
  @Input() config: any = { columns: [] };
  @Input() controler: any;

  nodeDataMap = new Map();

  tooltipHtml = "Hello <b>all</b>";

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  getNodes(): any[] {
    return this.nodes;
  }

  getNode(): any {
    let nodes = this.getNodes();
    return nodes.length ? nodes[0] : null;
  }

  getNodesFlatList(): any[] {
    return this.getNodesFlatListRec(this.getNode());
  }

  getNodesFlatListRec(node, indent = 0, list = []): any[] {
    if (node && node.isVisible) {
      node.indent = indent;
      list.push(node);
      if (!node.isCollapsed) {
        node.nodes.forEach((childNode) => {
          this.getNodesFlatListRec(childNode, indent + 1, list);
        });
      }
    }
    return list;
  }

  getIndentArray(indent) {
    return Array(indent).fill(1);
  }

  getNodeClass(node) {
    let res = null;
    if (this.controler.getNodeClass) {
      res = this.controler.getNodeClass(node);
    }
    if (!res) {
      res = "node ";
      if (this.getIsSelected(node)) {
        res += "node-selected ";
      }
    }
    return res;
  }

  getNodeValue(node, propertyName) {
    if (node && node.values) {
      return node.values.get(propertyName);
    }
    return null;
  }

  getNodeValueHtml(node, col, propertyName) {
    if (col.html) {
      return col.html(node, propertyName);
    }
    return this.getNodeValue(node, propertyName);
  }

  getNodeValueStyle(node, col) {
    let res = {};
    if (col.propertyStyle) {
      res = this.getNodeValue(node, col.propertyStyle);
    } else if (col.style) {
      res = col.style(node, col);
    }
    return res;
  }

  getNodeValueClass(node, col) {
    let res = "node-value-default";
    if (col.class) {
      res = col.class(node, col);
    }
    return res;
  }

  getNodeValueTooltip(node, col) {
    let res = "";
    if (col.tooltip) {
      res = col.tooltip(node, col);
    }
    this.tooltipHtml = res;
    res = res == "" ? null : this.tipContentComponent;
    return res;
  }

  getIsFolder(node) {
    return node && ((node.nodes && node.nodes.length) || node.lazyLoadingCB);
  }

  getNodeIcon(node) {
    let res = null;
    if (this.controler.getNodeIcon) {
      res = this.controler.getNodeIcon(node);
    }
    if (!res) {
      res = this.getDefaultNodeIcon(node);
    }
    return res;
  }

  getDefaultNodeIcon(node) {
    let res = "file";
    if (this.getIsFolder(node)) {
      res = node.isCollapsed ? "folder" : "folder-open";
    }
    return res;
  }

  getIsSelected(node) {
    return node && node.object && node.object.isSelected;
  }

  forEachNodes(nodes, cb) {
    if (nodes && nodes.forEach) {
      nodes.forEach((node) => {
        if (cb) {
          cb(node);
        }
        this.forEachNodes(node.nodes, cb);
      });
    }
  }

  filterNodes(nodes, cb) {
    let res = [];
    this.forEachNodes(this.getNodes(), (node) => {
      if (cb && cb(node)) {
        res.push(node);
      }
    });
    return res;
  }

  getAllObjects(): any[] {
    let res = [];
    this.forEachNodes(this.getNodes(), (node) => {
      if (node.object) {
        res.push(node.object);
      }
    });
    return res;
  }

  getSelectedObjectToNode(node): any[] {
    let list = [];
    if (node && node.parentNode) {
      let firstSelectedNodeIndex = -1;
      let lastSelectedNodeIndex = -1;
      let i = 0;
      node.parentNode.nodes.forEach((n) => {
        if (n.object && (n.object.isSelected || n == node)) {
          if (firstSelectedNodeIndex == -1) {
            firstSelectedNodeIndex = i;
          }
          lastSelectedNodeIndex = i;
        }
        i++;
      });
      i = 0;
      node.parentNode.nodes.forEach((n) => {
        if (i >= firstSelectedNodeIndex && i <= lastSelectedNodeIndex) {
          list.push(n.object);
        }
        i++;
      });
    }
    return list;
  }

  createNode(label, object, parentNode, key, isCollapsedInit = false) {
    let node = {
      label: label || "-",
      object: object,
      parentNode: parentNode,
      isCollapsed: isCollapsedInit,
      isVisible: true,
      nodes: [],
      lazyLoadingCB: null,
      values: new Map(),
    };
    this.initNode(node, key);
    return node;
  }

  initNode(node, key) {
    if (key) {
      node.key = key;
      let nodeData = this.nodeDataMap.get(key);
      if (nodeData) {
        node.isCollapsed = nodeData.isCollapsed;
      } else {
        nodeData = { key: key, isCollapsed: node.isCollapsed };
        this.nodeDataMap.set(key, nodeData);
      }
    }
  }

  setNodeCollapse(node, value) {
    node.isCollapsed = value;
    let nodeData = this.nodeDataMap.get(node.key);
    if (nodeData) {
      nodeData.isCollapsed = node.isCollapsed;
    }
    if (!node.isCollapsed && node.lazyLoadingCB) {
      node.lazyLoadingCB();
    }
  }

  toggleNodeIsCollapsed(node) {
    this.setNodeCollapse(node, !node.isCollapsed);
  }

  collapseAll(value) {
    this.forEachNodes(this.getNodes(), (node) => {
      if (!(!value && node.lazyLoadingCB)) {
        this.setNodeCollapse(node, value);
      }
    });
  }

  onDragStartNodeValue(event, node, col) {
    //    console.log(">> onDragStart", node, col);
    event.dataTransfer.setData("text", JSON.stringify({ type: "sel-table-node-value", nodeKey: node.key, col: col }));
  }

  onDragEndNodeValue(event, node, col) {
    //console.log(">> onDragEnd", node, col);
    event.preventDefault();
  }

  onDragOverNodeValue(event, node, col) {
    event.preventDefault();
  }

  onDropNodeValue(event, node, col) {
    //console.log(">> onDrop", node, col);
    if (this.controler.onDropNodeValue) {
      this.controler.onDropNodeValue(event, node, col);
    }
  }

  onNodeMouseOver(event, node) {}

  onNodeValueMouseDown(event, node, col) {
    if (col.onMouseDown) {
      return col.onMouseDown(event, node, this.controler);
    }
    return this.controler.onNodeValueMouseDown(event, node, col);
  }

  selectAll(value) {
    this.forEachNodes(this.getNodes(), (node) => {
      if (node && node.object && node.object.isSelected != undefined) {
        node.object.isSelected = value;
      }
    });
  }
}
