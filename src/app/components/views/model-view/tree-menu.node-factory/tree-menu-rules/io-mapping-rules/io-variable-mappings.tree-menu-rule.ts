import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

// 2.	IOVariableMappings: displaying the IOVariables details of each SMIO aligned with the class
// <tIOVariableMapping> in GenericADM XSD definition.

export class IOVariableMappingsTreeMenuRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "IOVariableMappings",
    nodesConfig: [
      {
        id: "IOVariableMappings",
        label: "IO Variable Mappings",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
      },
    ],
    tIOVariableMappingCategoryType: ["tIOVariableMapping"],
    tIOVariableCategoryType: ["tIOVariable"],
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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:iOVariableMappings"])
    ) {
      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, this.params.tIOVariableMappingCategoryType)) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: false,
        });
        if (node) {
          context.tIOVariableMappingNode = node;
          nodes.push(node);
          const parentClassNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
            object.type,
            context.project,
            this.rulesNodeFactory.getNodeFromKey(
              this.rulesNodeFactory.getProjectNodeId(context.project, this.params.categoryId)
            )
          );
          if (parentClassNode) {
            this.rulesNodeFactory.addNodeToParent(node, parentClassNode);
          }
        }
      }

      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, this.params.tIOVariableCategoryType)) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: false,
          sortValue: (n: any) => n.label,
        });
        if (node && context.tIOVariableMappingNode) {
          nodes.push(node);
          const parentClassNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
            object.type,
            context.project,
            context.tIOVariableMappingNode
          );
          if (parentClassNode) {
            this.rulesNodeFactory.addNodeToParent(node, parentClassNode);
          }
        }
      }
    }
    return nodes;
  }
}
