import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";

/**
 * Groupable objects
 */
export class GroupableObjectsVerificationTreeMenuRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "GroupableObjects",
    nodesConfig: [
      {
        id: "GroupableObjects",
        label: "Groupable objects",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
      },
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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["infrastructure"])
    ) {
      if (
        this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [
          "tGraphicalGroupableElement",
          "tGraphicalSubGroupableElement",
        ])
      ) {
        const groupType = object.groupableWithObjectClass;
        if (groupType) {
          const groupableObjectsLabel = this.rulesNodeFactory.translateLabel("Groupable objects");
          const groupNodeLabel = groupType + " " + groupableObjectsLabel;
          const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
            addChildrenCountToNode: false,
          });
          if (node) {
            nodes.push(node);

            const groupableTypeParentNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
              groupNodeLabel,
              context.project,
              this.rulesNodeFactory.getNodeFromKey(
                this.rulesNodeFactory.getProjectNodeId(context.project, this.params.categoryId)
              )
            );
            if (groupableTypeParentNode) {
              const theParentNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
                object.type,
                context.project,
                groupableTypeParentNode
              );
              if (theParentNode) {
                this.rulesNodeFactory.addNodeToParent(node, theParentNode);
                this.rulesNodeFactory.addObjectPropertiesNodes(node, context);
              }
            }
          }
        }
      }
    }
    return nodes;
  }
}
