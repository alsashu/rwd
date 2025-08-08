import { ANodeFactory } from "../anode-factory";
import { ITreeMemoService } from "../../tree-memo/tree-memo.service";
import { cloneDeep } from "lodash";
import { IRulesNodeFactory } from "./node-factory-rules/base/inode-factory-rule";
import { DefaultNodeFactoryRule } from "./node-factory-rules/default.rule/default.node-factory-rule";

/**
 * Interface of the model config service
 */
export interface IModelConfigService {
  isTypeExtensionOfTypes(type: string, extensions: string[]): boolean;
}

/**
 * Tree menu node factory building nodes of generic tree component
 */
export class RulesNodeFactory extends ANodeFactory implements IRulesNodeFactory {
  /**
   * Parameters
   */
  public params = {
    rootObject: () => null,
    rootObjects: () => null,
    rootLabel: () => "Données",
    nodeKeyPrefix: () => "node-",

    mainRule: new DefaultNodeFactoryRule(this),
    excludedPropertyList: ["refObject", "svgObject", "compareDataByProjectMap", "compareObjectsMap"],

    buildNodeOverlay: (node: any) => node,
    isTypeExtensionOfTypes: (type: string, extensions: string[]) => false,
    isUndefinedValueVisible: () => false,
    translateLabel: (text: string) => text,
    translateModelClassName: (text: string) => text,
  };

  /**
   * Type of tree menu nodes not linked to a business object
   */
  private treeMenuCategoryType = "treeMenuNode";

  /**
   * uuid/node map
   */
  public nodesMap = new Map<string, any>();

  /**
   * Default sort value (different depending on browser)
   */
  private defaultSortValue = ["a", "b"].sort((n1: any, n2: any) => 1)[0] === "a" ? 1 : -1;

  /**
   * Constructor
   * @param treeMemoService Tree memo service for tree state savinf in local storage or session
   * @param params Parameters
   */
  constructor(protected treeMemoService: ITreeMemoService, params: any) {
    super(treeMemoService);
    // tslint:disable-next-line: forin
    for (const param in params) {
      this.params[param] = params[param];
    }
  }

  /**
   * Load project content if loaded project display mode
   * @returns True if loaded project display mode
   */
  public shouldLoadProjectsContent(): boolean {
    return !(this.params.rootObject() && this.params.rootObject().type === "model");
  }

  /**
   * Build the nodes and sort them
   * @returns The list of nodes
   */
  public buildNodes(): any[] {
    this.nodesMap.clear();
    return this.sortNodesRec(this.buildRootNodes());
  }

  /**
   * Create a context used in buildNodesRec recursive function
   * @returns The context
   */
  protected createContext(): any {
    const context = super.createContext();
    context.objectsStack = [];
    context.propertyNamesStack = [];
    context.nodesStack = [];
    return context;
  }

  /**
   * Build the root nodes
   * @returns The root nodes
   */
  public buildRootNodes(): any[] {
    let nodes = [];
    const context = this.createContext();
    context.t = new Date();
    this.params.mainRule.clear();
    if (this.params.rootObject) {
      nodes = this.buildNodesRec(this.params.rootObject(), null, context);
    } else if (this.params.rootObjects) {
      nodes = this.buildNodesFromObjectList(this.params.rootObjects(), null, context);
    }
    return nodes;
  }

  /**
   * Recursive function that builds the nodes from a business objects
   * @param object Business object or node category
   * @param parentNode Parent node
   * @param context The context
   * @param params Parameters
   * @returns The created nodes related to the object
   */
  public buildNodesRec(object: any, parentNode: any, context: any, params: any = null): any[] {
    let nodes = [];
    if (object) {
      context.objectsStack.push({ object, propertyName: object && object.type ? object.type : context.propertyName });
      context.propertyNamesStack.push(context.propertyName || "");
      context.loadChildrenNodes = true;

      nodes = this.params.mainRule.buildNodes(object, parentNode, context, params);

      if (nodes && nodes.length) {
        context.nodesStack.push(nodes);
      }
      if (context.loadChildrenNodes) {
        const newParentNode = nodes.length ? nodes[0] : parentNode;
        this.buildChildrenNodesFromObject(object, newParentNode, context);
      }

      context.nodesStack.pop();
      context.objectsStack.pop();
      context.propertyNamesStack.pop();
    }
    return nodes;
  }

  /**
   * Add node to the nodes map
   * @param key The key
   * @param node The node
   * @returns The node
   */
  public addNodeToNodeMap(key: string, node: any): any {
    if (node && key) {
      if (!this.getNodeFromKey(key)) {
        node.nodeMapKey = key;
        this.nodesMap.set(key, node);
      }
    }
    return node;
  }

  /**
   * Get node from a key
   * @param key The key
   * @returns The found node from the key
   */
  public getNodeFromKey(key: string): any {
    return this.nodesMap.get(key);
  }

  /**
   * Get an object from an id in a tree with objects with same id but belonging to different versions
   * @param version The version, can be null
   * @param type The type, can be null
   * @param id The id
   * @returns The found node from the id, optionnaly version and type
   */
  public getObjectFromId(version: any, type: string, id: string): any {
    const node = this.getNodeFromKey(this.getNodeId(version, type, id));
    return node ? node.object : null;
  }

  /**
   *  Build a node from a business object
   * @param object The business object
   * @param parentNode The parent node
   * @param context The context
   * @param params The parameters
   * @returns The created node
   */
  public buildNodeFromObject(object: any, parentNode: any, context: any, params: any = null): any {
    let node = null;
    if (object) {
      const type = params ? params.type : object.type;
      const label = (params ? params.label : null) || object.label || object.id || object.type;
      node = this.buildNode({
        object,
        parent: parentNode,
        label,
        type,
        isCollapsed: params && params.isCollapsed !== undefined ? params.isCollapsed : true,
      });
      if (params && params.sortValue) {
        node.sortValue = params.sortValue;
      }
      if (params && params.nodeMapKey) {
        this.addNodeToNodeMap(params.nodeMapKey, node);
      }
      if (this.params.buildNodeOverlay) {
        node = this.params.buildNodeOverlay(node);
      }
      if (params && params.countSubChildren) {
        node.countSubChildren = params.countSubChildren;
      }
      if (params && params.getChildrenCount) {
        node.getChildrenCount = params.getChildrenCount;
      }
      if (params && params.sumSubChildren) {
        node.sumSubChildren = params.sumSubChildren;
      }

      if (params && params.addChildrenCountToNode) {
        this.addChildrenCountToNode(node);
      }
    }
    return node;
  }

  /**
   * Build nodes from children of an object
   * @param object The business object
   * @param node The object node
   * @param context The context
   * @returns The created nodes
   */
  protected buildChildrenNodesFromObject(object: any, node: any, context: any): any[] {
    let nodes = [];
    if (object && typeof object === "object") {
      // List ?
      if (object.forEach) {
        nodes = nodes.concat(this.buildNodesFromObjectList(object, node, context));
      }
      // Otherwise scan object properties
      else {
        // tslint:disable-next-line: forin
        for (const propertyName in object) {
          if (!this.params.excludedPropertyList.includes(propertyName)) {
            const property = object[propertyName];
            if (typeof property === "object") {
              context.propertyName = propertyName;
              nodes = nodes.concat(
                this.buildNodesRec(property, node, context, {
                  label: this.getObjectLabel(object, propertyName),
                  type: propertyName,
                })
              );
            }
          }
        }
      }
    }
    return nodes;
  }

  /**
   * Lazy load children nodes of a node
   * @param node The node
   */
  public lazyLoadNode(node: any) {
    this.loadChildrenNodes(node, this.createContext());
  }

  /**
   * Load children nodes of a node
   * @param node The node
   * @param context The context
   */
  public loadChildrenNodes(node: any, context: any) {
    if (node) {
      const nodes = this.buildChildrenNodesFromNode(node, context);
      node.nodesLoaded = true;
    }
  }

  /**
   * Get object label
   * @param o The object
   * @param propertyName The name of the property of the label
   * @returns Object label
   */
  public getObjectLabel(o: any, propertyName: string): string {
    return o ? o[propertyName] : "";
  }

  /**
   * Build children node of a node
   * @param node The node
   * @param context The context
   * @returns The children nodes
   */
  protected buildChildrenNodesFromNode(node: any, context: any): any[] {
    return this.buildNodeFromObject(node ? node.object : null, node, context);
  }

  /**
   * Recursively sort nodes
   * @param nodes The nodes
   * @returns The nodes
   */
  public sortNodesRec(nodes: any): any[] {
    if (nodes && nodes.forEach) {
      if (nodes.length > 0 && nodes[0].sortValue) {
        nodes = nodes.sort((n1: any, n2: any) => {
          if (n1 && n1.sortValue && n2 && n2.sortValue) {
            let a = n1.sortValue(n1);
            let b = n2.sortValue(n2);
            a = typeof a === "string" ? a.toLowerCase() : a.toString();
            b = typeof b === "string" ? b.toLowerCase() : b.toString();
            return a.localeCompare(b, "en", { numeric: true });
          }
          return this.defaultSortValue;
        });
      }
      nodes.forEach((childNode: any) => this.sortNodesRec(childNode.nodes));
    }
    return nodes;
  }

  /**
   * Build main fixed nodes
   * @param version The version
   * @param parentNode The parent node
   * @returns The created nodes
   */
  public buildMainCategoriesNodes(version: any, parentNode: any): any[] {
    return this.params.mainRule.buildMainCategoriesNodes(version, parentNode);
  }

  /**
   * Calculate the id of a node from the version, the type and the id of the object linked to the node
   * @param version The version
   * @param type The type of object linked to the node
   * @param id The id of the object linked to the node
   * @returns The id of the node
   */
  public getNodeId(version: any, type: string, id: string): string {
    return (version && version.id ? version.id + "-" : "") + (type ? type + "-" : "") + id;
  }

  /**
   * Get the id of the node of a project
   * @param version Version
   * @param id Node id
   * @returns The found node
   */
  public getProjectNodeId(version: any, id: string): string {
    return this.getNodeId(version, null, id);
  }

  /**
   * Recursively build main categries nodes
   * @param version Version
   * @param parentNode The parent node
   * @param nodesConfig The node config
   * @param params Parameters
   * @returns The nodes
   */
  public buildMainCategoriesNodesRec(version: any, parentNode: any, nodesConfig: any, params: any = null): any[] {
    const res = [];
    if (nodesConfig) {
      nodesConfig.forEach((nodeConfig: any) => {
        const object = cloneDeep(nodeConfig);
        object.id =
          params && params.keyPrefix ? params.keyPrefix + object.id : this.getProjectNodeId(version, object.id);
        object.type = this.treeMenuCategoryType;

        const nodeParams = {
          object,
          label: this.translateLabel(nodeConfig.label),
          isFolder: true,
          isLoaded: true,
          parent: parentNode,
          indent: parentNode ? parentNode.indent + 1 : 0,
        };

        if (nodeConfig.params) {
          // tslint:disable-next-line: forin
          for (const param in nodeConfig.params) {
            nodeParams[param] = nodeConfig.params[param];
          }
        }

        const node = this.buildNode(nodeParams);

        if (nodeConfig.addChildrenCount) {
          this.addChildrenCountToNode(node);
        }

        if (!this.getNodeFromKey(node.object.id)) {
          this.addNodeToNodeMap(node.object.id, node);
          res.push(node);
          if (nodeConfig.nodesConfig) {
            const childrenNodes = this.buildMainCategoriesNodesRec(version, node, nodeConfig.nodesConfig, params);
            this.addNodesToParent(childrenNodes, node);
          }
        }
      });
    }
    return res;
  }

  /**
   * Calculate and add children count to a node label
   * @param node The node
   * @returns The node
   */
  public addChildrenCountToNode(node: any): any {
    if (node) {
      node.childrenCount = 0;

      if (node.getChildrenCount === undefined) {
        if (node.countSubChildren) {
          node.getChildrenCount = (n: any) => {
            let c = 0;
            if (n && n.nodes) {
              n.nodes.forEach((sn: any) => (c += sn && sn.nodes ? sn.nodes.length : 0));
            }
            return c;
          };
        } else if (node.sumSubChildren) {
          node.getChildrenCount = (n: any) => {
            let c = 0;
            if (n && n.nodes) {
              n.nodes.forEach((sn: any) => (c += sn && sn.getChildrenCount ? sn.getChildrenCount(sn) : 0));
            }
            return c;
          };
        } else {
          node.getChildrenCount = (n: any) => (n && n.nodes ? n.nodes.length : 0);
        }
      }

      node.getLabel = (n: any) => {
        return n.label + (n.getChildrenCount ? " (" + n.getChildrenCount(n) + ")" : "");
      };
    }
    return node;
  }

  /**
   * Get a category node from an id
   * @param id The id
   * @returns The node
   */
  public getCategoryNodeById(id: any) {
    return this.getNodeFromKey(id);
  }

  /**
   * Add a node to a category node
   * @param node The node
   * @param version The version
   * @param categoryId The id of the category
   * @returns true
   */
  public addNodeToCategoryById(node: any, version: any, categoryId: string): boolean {
    this.addNodeToParent(node, this.getCategoryNodeById(this.getProjectNodeId(version, categoryId)));
    return true;
  }

  /**
   * Search for a doublon node in parent node
   * @param o Object to search
   * @param parentNode Parent node
   * @returns Found node, null instead
   */
  public findDoublonNode(o: any, parentNode: any): any {
    return parentNode && parentNode.nodes
      ? parentNode.nodes.find((n: any) => n.object && o && n.object.type === o.type && n.object.id === o.id)
      : null;
  }

  /**
   * Find or create a node from the type of an object
   * @param type The type
   * @param version The version
   * @param parentNode The parent node
   * @param addSToLabel Add an "S" to the label
   * @returns The node
   */
  public findOrCreateNodeFromObjectType(type: string, version: any, parentNode: any, addSToLabel: boolean = true): any {
    const oType = type && type.split ? type.split(":").pop() : "";
    let label = oType;
    // label = this.translateLabel(label);
    label = this.translateModelClassName(label);
    let node = parentNode && parentNode.nodes ? parentNode.nodes.find((n: any) => n.label === label) : null;

    if (!node) {
      const object = { id: this.getProjectNodeId(version, type), label, type: this.treeMenuCategoryType };
      node = this.buildNode({
        object,
        label: object.label,
        isFolder: true,
        isLoaded: true,
        sortValue: (n: any) => n.label,
      });
      this.addChildrenCountToNode(node);
      this.addNodeToParent(node, parentNode);
    }
    return node;
  }

  /**
   * Test if a type is an extension of one of types
   * @param type The type
   * @param extensions The array of base types
   * @returns True if the type is an extension of one of the extension types
   */
  public isTypeExtensionOfTypes(type: string, extensions: string[]): boolean {
    return this.params.isTypeExtensionOfTypes(type, extensions);
  }

  /**
   * Test if the type of an object is an extension of types and if so, create a node
   * @param object The business object
   * @param context The context
   * @param types The list of types
   * @param categoryId The id of the category node, the node should be added to
   * @param params Parameters
   * @returns The created node or null
   */
  public createNodeAndAddToCategoryIfExtensionOf(
    object: any,
    context: any,
    types: string[],
    categoryId: string,
    params: any = null
  ): any {
    let node = null;
    if (object && context && context.project && context.project.id) {
      if (this.isTypeExtensionOfTypes(object.type, types)) {
        node = this.buildNodeFromObject(object, null, context, params);
        if (node) {
          this.addNodeToCategoryById(node, context.project, categoryId);
        }
      }
    }
    return node;
  }

  /**
   * Test if an object is an extension of types and if so, create node and add it to parent node
   * @param object The business object
   * @param context The contex
   * @param parentNode The parent node
   * @param objectTypes The list of types
   * @returns The created node or null
   */
  public testAndAddObjectToObjectTypeNode(object: any, context: any, parentNode: string, objectTypes: any[]): any[] {
    let nodes = [];
    if (this.isTypeExtensionOfTypes(object.type, objectTypes)) {
      nodes = this.addObjectToObjectTypeNode(object, context, parentNode);
    }
    return nodes;
  }

  /**
   * Build node from object and add it to parent node
   * @param object The business object
   * @param context The context
   * @param parentNode The parent node
   * @returns The created node
   */
  public addObjectToObjectTypeNode(object: any, context: any, parentNode: any): any[] {
    const nodes = [];
    const node = this.buildNodeFromObject(object, null, context, {
      addChildrenCountToNode: false,
      sortValue: (n: any) => n.label,
    });
    if (node) {
      nodes.push(node);
      const parentClassNode = this.findOrCreateNodeFromObjectType(object.type, context.project, parentNode);
      if (parentClassNode) {
        this.addNodeToParent(node, parentClassNode, true);
      }
    }
    return nodes;
  }

  /**
   * Test if context stack if under specific objects in the model (ex: under infrstructure in the railml)
   * @param context The context
   * @param objectStackLength The length of the object stack
   * @param types The list of types
   * @returns True if the context is under an object with a type in the liste of types
   */
  public testIfContextUnderObjetsTypes(context: any, objectStackLength: number, types: string[]): boolean {
    const res =
      context &&
      context.objectsStack.length > 0 &&
      context.objectsStack.find((os: any) => types.includes(os.propertyName));
    return res;
  }
}
