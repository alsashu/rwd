import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";

/**
 * Tree menu rule for model & projects objects
 */
export class ModelVerificationTreeRule extends ANodeFactoryRule {
  private params = {
    objectTypes: [ModelConstService.MODEL_TYPE, ModelConstService.PROJECT_TYPE],
    excludesTypes: [ModelConstService.VISUALIZATION_TYPE],
    projectType: ModelConstService.PROJECT_TYPE,
  };

  public constructor(public rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(rulesNodeFactory);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];

    if (this.params.objectTypes.includes(object ? object.type : null)) {
      const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, params);
      if (node) {
        nodes.push(node);
        this.rulesNodeFactory.addNodesToParent([node], parentNode);

        // If project node,
        if (node.object && node.object.type === this.params.projectType) {
          context.project = node.object;
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
      }
    } else if (this.params.excludesTypes.includes(object ? object.type : null)) {
      context.loadChildrenNodes = false;
    }
    return nodes;
  }
}
