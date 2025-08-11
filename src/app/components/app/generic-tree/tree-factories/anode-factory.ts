import { INodeFactory } from "./inode-factory";
import { ITreeMemoService } from "../tree-memo/tree-memo.service";
import { v4 as uuid } from "uuid";

/**
 * Interface of base node factory building nodes of generic tree component
 */
export interface IBaseNodeFactory extends INodeFactory {
  translateLabel(text: string): string;
  translateModelClassName(text: string): string;
  buildNode(params: any): any;
  buildNodesFromObjectList(objects: any[], parentNode: any, context: any): any[];
  buildNodesRec(object: any, parentNode: any, context: any, params: any): any[];
}

// export interface INode {
//   label: null,
//   object: null,
//   type: null,
//   parent: null,
//   indent: 0,
//   isFolder: false,
//   isCollapsed: true,
//   isExpanded: false,
//   isVisible: true,
//   icons: null,
//   nodes: [],
//   nodesLoaded: false,
//   isLazyLoaded: true,
//   lazyLoadingCB: null,
//   values: new Map(),
// }

/**
 * Abstract node factory building nodes of generic tree component
 */
export abstract class ANodeFactory implements IBaseNodeFactory {
  /**
   * Constructor
   * @param treeMemoService The tree memo service
   */
  constructor(protected treeMemoService: ITreeMemoService) {}

  /**
   * Parameters
   */
  public params: any;

  /**
   * Build a node
   * @param params Parameters
   * @returns The node
   */
  public buildNode(params: any): any {
    const node: any = {
      label: null,
      object: null,
      type: null,
      parent: null,
      indent: 0,
      isFolder: false,
      isCollapsed: true,
      isExpanded: false,
      isVisible: true,
      icons: null,
      nodes: [],
      nodesLoaded: false,
      isLazyLoaded: true,
      lazyLoadingCB: null,
      values: new Map(),
      // sortValue: (n: any) => n.label,
    };
    node.lazyLoadNodeCB = () => this.lazyLoadNode(node);

    // tslint:disable-next-line: forin
    for (const param in params) {
      node[param] = params[param];
    }
    if (node.parent) {
      node.indent = node.parent.indent + 1;
    }
    if (!node.key) {
      node.key =
        node.object && node.object.id
          ? node.object.type
            ? node.object.type + "-" + node.object.id
            : node.object.id
          : node.type + node.label;
      if (this.params && this.params.nodeKeyPrefix) {
        node.key = this.params.nodeKeyPrefix() + node.key;
      }
    }
    if (this.treeMemoService) {
      this.treeMemoService.initNode(node);
    }
    return node;
  }

  /**
   * Create a contexte
   * @returns The context
   */
  protected createContext(): any {
    return {};
  }

  /**
   * Builds nodes
   * @returns The built nodes
   */
  public buildNodes(): any[] {
    return this.buildNodesRec(null, null, this.createContext());
  }

  /**
   * Build nodes recursively from an object
   * @param object The object
   * @param parentNode The parent node
   * @param context The context
   * @param params Parameters
   * @returns The built nodes
   */
  public buildNodesRec(object: any, parentNode: any, context: any, params: any = null): any[] {
    return [];
  }

  /**
   * Builds nodes from an object list
   * @param objects Objects
   * @param parentNode The parent node
   * @param context The context
   * @returns The built nodes
   */
  public buildNodesFromObjectList(objects: any[], parentNode: any, context: any): any[] {
    let nodes = [];
    objects.forEach((childObject: any) => {
      nodes = nodes.concat(this.buildNodesRec(childObject, parentNode, context));
    });
    return nodes;
  }

  /**
   * Abstract function for lazy loading a node
   * @param node The node to be loaded
   */
  public abstract lazyLoadNode(node: any);

  /**
   * Add nodes to a parent node
   * @param nodes The nodes
   * @param parentNode The parent node
   * @returns The nodes
   */
  public addNodesToParent(nodes: any[], parentNode: any): any[] {
    if (nodes && parentNode) {
      nodes.forEach((node) => this.addNodeToParent(node, parentNode));
      if (parentNode.nodes.length) {
        parentNode.isFolder = true;
      }
      parentNode.nodesLoaded = true;
    }
    return nodes;
  }

  /**
   * Test if a node exists in a parent node
   * @param node The node
   * @param parentNode The parent node
   * @returns Boolean
   */
  public nodeExistsInParent(node: any, parentNode: any): boolean {
    let res = false;
    if (node && node.object && node.object.id && parentNode && parentNode.nodes) {
      const doublon = parentNode.nodes.find(
        (n: any) => n && n.object && n.object.id === node.object.id && n.object.type === node.object.type
      );
      if (doublon) {
        res = true;
      }
    }
    return res;
  }

  /**
   * Add a node to a parent node
   * @param node The node
   * @param parentNode The parent node
   * @param preventDoublon Prevent doublons
   * @returns The node
   */
  public addNodeToParent(node: any, parentNode: any, preventDoublon = false): any {
    if (node && parentNode) {
      if (preventDoublon && this.nodeExistsInParent(node, parentNode)) {
        return node;
      }
      if (!parentNode.nodes) {
        parentNode.nodes = [];
      }
      parentNode.nodes.push(node);
      node.parent = parentNode;
      this.calcNodesIndentRec(node, parentNode);
      node.nodesLoaded = true;
    }
    return node;
  }

  /**
   * Calculate node indentation
   * @param node Node
   * @param parentNode Parent node
   */
  public calcNodesIndentRec(node: any, parentNode: any) {
    if (node && parentNode) {
      node.indent = parentNode.indent + 1;
      if (node.nodes) {
        node.nodes.forEach((child: any) => {
          this.calcNodesIndentRec(child, node);
        });
      }
    }
  }

  /**
   * Translate a label
   * @param text The text
   * @returns String
   */
  public translateLabel(text: string): string {
    return this.params && this.params.translateLabel ? this.params.translateLabel(text) : text;
  }

  /**
   * Trasnlate class name
   * @param text The string value
   * @returns String
   */
  public translateModelClassName(text: string): string {
    return this.params && this.params.translateModelClassName
      ? this.params.translateModelClassName(text)
      : this.translateLabel(text);
  }
}
