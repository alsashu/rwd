import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

// In the tree menu under <Logical objects> node, the tool shall create a branch and display its instances:
// •	For each class being a direct or indirect extension of <tElementWithRef>.

// •	For each class being a direct or indirect extension of <tElementWithIDAndName> but located under the class <eInfraAttrGroup>
export class LogicalObjectsTableTreeRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "LogicalObjects",
    nodesConfig: [
      {
        id: "LogicalObjects",
        label: "Logical Objects",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
      },
    ],
    categoryTypes: ["tElementWithRef", "tElementWithIDAndName"],
  };

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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:logicalElements"])
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
            this.rulesNodeFactory.getNodeFromKey(
              this.rulesNodeFactory.getProjectNodeId(context.project, "LogicalObjects")
            )
          );
          if (theParentNode) {
            this.rulesNodeFactory.addNodeToParent(node, theParentNode);
          }
        }
      }
    }
    return nodes;
  }
}
