import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { ICompareTreeNodeFactory } from "../../compare-tree.node-factory";

/**
 * Tree menu rule for model & projects objects
 */
export class ModelCompareTreeRule extends ANodeFactoryRule {
  /**
   * Rule parameters
   */
  private params = {
    objectTypes: [ModelConstService.COMPARE_DATA_TYPE, ModelConstService.PROJECT_TYPE],
    excludesTypes: [ModelConstService.VISUALIZATION_TYPE],
    projectType: ModelConstService.PROJECT_TYPE,
  };

  /**
   * Constructor
   * @param rulesNodeFactory Rules node factory
   */
  public constructor(public rulesNodeFactory: ICompareTreeNodeFactory) {
    super(rulesNodeFactory);
  }

  /**
   * Build nodes from object
   * @param object The object
   * @param parentNode The parent node
   * @param context The context
   * @param params The parameters
   * @returns The created nodes
   */
  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];

    if (this.params.objectTypes.includes(object ? object.type : null)) {
      const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, params);
      if (node) {
        // If project node,
        if (node.object && node.object.type === this.params.projectType) {
          if (!context.project) {
            context.isFirstProject = true;
            context.project = node.object;
          } else {
            context.isFirstProject = false;
            // context.compareProject = node.object;
          }
          context.compareProject = node.object;

          if (!this.rulesNodeFactory.shouldLoadProjectsContent()) {
            // Stop loading children
            context.loadChildrenNodes = false;
          } else {
            // Build main category nodes
            this.rulesNodeFactory.addNodesToParent(
              this.rulesNodeFactory.buildMainCategoriesNodes(node.object, node),
              node
            );
          }
        }
        nodes.push(node);
        this.rulesNodeFactory.addNodesToParent([node], parentNode);
      }
    } else if (this.params.excludesTypes.includes(object ? object.type : null)) {
      context.loadChildrenNodes = false;
    }
    return nodes;
  }
}
