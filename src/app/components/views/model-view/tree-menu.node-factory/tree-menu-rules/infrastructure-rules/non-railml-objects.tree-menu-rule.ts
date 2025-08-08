import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

/**
 * Non raiml objects
 */
export class NonRailmlObjectsTreeMenuRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "NonRailmlObjects",
    nodesConfig: [
      {
        id: "NonRailmlObjects",
        label: "Non Railml Objects",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
      },
    ],
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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:nonRailMLElements"])
    ) {
      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, ["tTextBox"])) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: false,
        });
        if (node) {
          nodes.push(node);
          const theParentNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
            object.type,
            context.project,
            this.rulesNodeFactory.getNodeFromKey(
              this.rulesNodeFactory.getProjectNodeId(context.project, this.params.categoryId)
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

  public continueToBuildNodes(object: any, parentNode: any, context: any, params: any = null): boolean {
    return this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:nonRailMLElements"]);
  }
}
