import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";

export class ComponentsVerificationTreeRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "Components",
    nodesConfig: [
      {
        id: "Components",
        label: "Components",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
      },
    ],
    categoryTypes: [
      "tComponent",
      "tSubComponentElement",
      "tPunctualComponentElement",
      "tSpecificComponentElement",
      "tLinearComponent",
    ],
  };

  public constructor(public rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(rulesNodeFactory);
  }

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];
    if (
      object &&
      context &&
      context.project &&
      context.project.id &&
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:components"])
    ) {
      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, this.params.categoryTypes)) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: false,
        });
        if (node) {
          nodes.push(node);
          const theParentNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
            object.type,
            context.project,
            this.rulesNodeFactory.getNodeFromKey(this.rulesNodeFactory.getProjectNodeId(context.project, "Components"))
          );
          if (theParentNode) {
            this.rulesNodeFactory.addNodeToParent(node, theParentNode);
            this.rulesNodeFactory.addObjectPropertiesNodes(node, context);
          }
        }
      }
    }
    return nodes;
  }
}
