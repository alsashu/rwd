// [RIGHT_VIEWER_SWRS_0108]
// In the tree menu under <EquipmentTypeParametersDefinitions> node, the tool shall create a branch and display its instances:
// •	For each class being an extension of <tEquipmentParametersElement>.
// Example: MooNParametersDefinition, etc.,
// Note: The branch shall be displayed only if at least one instance of that class is present

import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

export class ParameterSettingsTreeMenuRule extends ANodeFactoryRule {
  protected params = {
    categoryId: "EquipmentTypeParameters",
    nodesConfig: [
      {
        id: "EquipmentTypeParameters",
        label: "Equipment Type Parameters",
        addChildrenCount: true,
        params: { countSubChildren: true },
      },
    ],
    objectsTypes: ["tEquipmentParametersElement"],
  };

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    let nodes = [];
    if (object && context && context.project && context.project.id) {
      nodes = nodes.concat(
        this.rulesNodeFactory.testAndAddObjectToObjectTypeNode(
          object,
          context,
          this.rulesNodeFactory.getCategoryNodeById(
            this.rulesNodeFactory.getProjectNodeId(context.project, this.params.categoryId)
          ),
          this.params.objectsTypes
        )
      );
    }

    return nodes;
  }
}
