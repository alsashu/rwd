import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
/**
 * Generic tree service
 */
export class GenericTreeService {
  /**
   * Constructor
   */
  constructor() {}

  /**
   * get Parent Node Object With Bo Type
   * @param node The node
   * @param types The list of types
   * @returns The node if the object attached to the node of which type is in type list
   */
  public getParentNodeObjectWithBoType(node: any, types: string[]) {
    const matchingNode = this.getParentNodeWithBoType(node, types);
    return matchingNode ? matchingNode.object : null;
  }

  /**
   * Get the parent node of a node from types
   * @param node The node
   * @param types The list of types
   * @returns The parent node if the object attached to the node of which type is in type list
   */
  public getParentNodeWithBoType(node: any, types: string[]) {
    let res = null;
    if (node) {
      if (node.object && types.includes(node.object.type)) {
        res = node;
      } else {
        res = this.getParentNodeWithBoType(node.parent, types);
      }
    }
    return res;
  }

  /**
   * Get the nodes from the selected objects
   * @param node The first node
   * @returns The list of nodes with selected objects
   */
  public getNodesFromSelectedObjects(node: any): any[] {
    const list = [];
    if (node && node.parent) {
      let firstSelectedNodeIndex = -1;
      let lastSelectedNodeIndex = -1;
      let i = 0;
      node.parent.nodes.forEach((n: any) => {
        if (n.object && (n.object.isSelected || n === node)) {
          if (firstSelectedNodeIndex === -1) {
            firstSelectedNodeIndex = i;
          }
          lastSelectedNodeIndex = i;
        }
        i++;
      });
      i = 0;
      node.parent.nodes.forEach((n: any) => {
        if (i >= firstSelectedNodeIndex && i <= lastSelectedNodeIndex) {
          list.push(n.object);
        }
        i++;
      });
    }
    return list;
  }

  /**
   * Get the parent object from a node
   * @param node The node
   * @returns The parent object
   */
  public getParentObjectFromNode(node: any): any {
    let res = null;
    if (node && node.object) {
      if (node.object.forEach) {
        res = node.object;
      } else if (node.parent && node.parent.object && node.parent.object.forEach) {
        res = node.parent.object;
      }
    }
    return res;
  }

  /**
   * Recursively get the flat list of nodes
   * @param node The node
   * @param indent The indent value
   * @param list The list
   * @returns The flazt list of nodes
   */
  public getNodesFlatListRec(node: any, indent: number = 0, list: any[] = []): any[] {
    if (node && node.isVisible) {
      node.indent = indent;
      list.push(node);
      if (!node.isCollapsed) {
        node.nodes.forEach((childNode: any) => {
          this.getNodesFlatListRec(childNode, indent + 1, list);
        });
      }
    }
    return list;
  }

  /**
   * For each calling node's parent nodes
   * @param node The node
   * @param cb The call back
   */
  public forEachParentNodeRec(node: any, cb: any) {
    if (node && node.parent && cb) {
      cb(node.parent);
      this.forEachParentNodeRec(node.parent, cb);
    }
  }

  /**
   * For each function
   * @param nodes The nodes
   * @param cb The call back function
   */
  public forEachNodes(nodes: any, cb: any) {
    if (nodes && nodes.forEach) {
      nodes.forEach((node: any) => {
        if (cb) {
          cb(node);
        }
        this.forEachNodes(node.nodes, cb);
      });
    }
  }

  /**
   * Filter nodes
   * @param nodes The nodes
   * @param cb The filter callback
   * @returns The list of filtered nodes
   */
  public filterNodes(nodes: any[], cb: any) {
    const res = [];
    this.forEachNodes(nodes, (node: any) => {
      if (cb && cb(node)) {
        res.push(node);
      }
    });
    return res;
  }

  /**
   * Get the list of objects attached to nodes
   * @param nodes The nodes
   * @returns The list of objects
   */
  public getAllObjects(nodes: any[]): any[] {
    const res = [];
    this.forEachNodes(nodes, (node: any) => {
      if (node.object) {
        res.push(node.object);
      }
    });
    return res;
  }
}
