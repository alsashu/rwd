import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";

/**
 * Tree menu rule for search results
 */
export class ResultSearchTreeRule extends ANodeFactoryRule {
  private params = {
    nodesConfig: [],
  };

  /**
   * Constructor
   * @param rulesNodeFactory
   */
  public constructor(public rulesNodeFactory: IRulesNodeFactory) {
    super(rulesNodeFactory);
  }

  /**
   * Build main category nodes
   * @param project
   * @param parentNode
   * @returns
   */
  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  /**
   * Build nodes from an object
   * @param object The object
   * @param parentNode The parent node
   * @param context The context
   * @param params The parameters
   * @returns Built nodes
   */
  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];
    if (object) {
      if (object.searchResults !== undefined) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, params);
        if (node) {
          nodes.push(node);
        }
      } else if (object.type === "searchResult") {
        // Node created with object.foundObject. When node is selected, the object is automatically selected
        const node = this.rulesNodeFactory.buildNodeFromObject(object.foundObject, parentNode, context, params);
        // Add search result object to node additionnaly to object
        node.searchResult = object;

        if (node) {
          nodes.push(node);

          // Find parent node from mainTag type (top level tag in railml (ex: infrastructure...) )
          const newParentNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
            object.mainTag ? object.mainTag.type : "misc",
            null,
            parentNode,
            false
          );
          this.rulesNodeFactory.addNodeToParent(node, newParentNode);
        }
      }
    }
    return nodes;
  }
}
