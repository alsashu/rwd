import { ANodeFactory } from "../anode-factory";
import { ITreeMemoService } from "../../tree-memo/tree-memo.service";

/**
 * Node factory building nodes of generic tree component using modelMap config
 */
export class ModelMapNodeFactory extends ANodeFactory {
  public params = {
    rootObject: () => null,
    rootObjects: () => null,
    rootLabel: () => "Données",
    modelMap: null,
    buildNodeOverlay: (node: any) => node,
    translateLabel: (text: string) => text,
    translateModelClassName: (text: string) => text,
  };

  constructor(protected treeMemoService: ITreeMemoService, params: any) {
    super(treeMemoService);
    // tslint:disable-next-line: forin
    for (const param in params) {
      this.params[param] = params[param];
    }
  }

  public buildNodesRec(object: any, parentNode: any, context: any, params: any = null): any[] {
    let nodes = [];
    let node = null;
    if (!object) {
      if (this.params.rootObject()) {
        node = this.buildNode({
          object: this.params.rootObject(),
          label: this.translateLabel(this.params.rootLabel()),
          isFolder: true,
        });
      } else if (this.params.rootObjects()) {
        nodes = this.buildNodesFromObjectList(this.params.rootObjects(), parentNode, context);
      }
    } else {
      const label = (params ? params.label : null) || object.label || object.id || object.type;
      const type = (params ? params.type : object.type) || "?";
      node = this.buildNode({
        object,
        parent: parentNode,
        // label,
        label: this.translateLabel(label),
        type,
        isCollapsed: params && params.isCollapsed !== undefined ? params.isCollapsed : true,
      });
    }

    if (node) {
      if (this.params.buildNodeOverlay) {
        node = this.params.buildNodeOverlay(node);
      }
      if (node) {
        nodes.push(node);
        if (!node.isCollapsed || !node.isLazyLoaded) {
          this.loadChildrenNodes(node, context);
        }
      }
    }
    return nodes;
  }

  public lazyLoadNode(node: any) {
    this.loadChildrenNodes(node, this.createContext());
  }

  public loadChildrenNodes(node: any, context: any) {
    if (node) {
      node.nodes = this.buildChildrenNodesFromNode(node, context);
      if (node.nodes.length) {
        node.isFolder = true;
      }
      node.nodesLoaded = true;
    }
  }

  protected buildChildrenNodesFromNode(node: any, context: any): any[] {
    let nodes = [];
    const object = node.object;

    if (object && typeof object === "object") {
      // Is object a list ?
      if (object.forEach) {
        nodes = nodes.concat(this.buildNodesFromObjectList(object, node, context));
      }
      // Scan object properties
      else {
        // tslint:disable-next-line: forin
        for (const propertyName in object) {
          const property = object[propertyName];
          const propertyMap = this.params.modelMap;

          if (typeof property === "object" && propertyMap) {
            const pi = propertyMap.get(propertyName);
            if (pi && pi.isTreeNode) {
              if (pi.isChildrenList) {
                nodes = nodes.concat(this.buildNodesFromObjectList(object.children, node, context));
              } else if (pi.skipList) {
                nodes = nodes.concat(this.buildNodesFromObjectList(property, node, context));
              } else {
                nodes = nodes.concat(
                  this.buildNodesRec(property, node, context, {
                    label: pi.label,
                    type: propertyName,
                    // isFolder: pi.isFolder,
                    isCollapsed: pi.isCollapsed,
                  })
                );
              }
            }
          }
        }
      }
    }
    return nodes;
  }
}
