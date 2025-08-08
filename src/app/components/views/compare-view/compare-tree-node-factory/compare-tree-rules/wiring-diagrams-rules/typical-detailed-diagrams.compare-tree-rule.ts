import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

export class TypicalDetailedDiagramsCompareTreeRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "TypicalDetailedDiagrams",
    nodesConfig: [
      {
        id: "TypicalDetailedDiagrams",
        label: "Typical Detailed Diagrams",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
      },
    ],
    categoryTypes: ["typicalITFDiagram"],
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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:typicalDiagrams"])
    ) {
      if (
        this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, this.params.categoryTypes) &&
        object["xmlType"] === "DetailedDiagram"
      ) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: false,
        });
        if (node) {
          nodes.push(node);
          const theParentNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
            object.fieldEquipmentType,
            context.project,
            this.rulesNodeFactory.getNodeFromKey(
              this.rulesNodeFactory.getProjectNodeId(context.project, "TypicalDetailedDiagrams")
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
