import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

// 5.8.2.3.3	NetworkParameters
// [RIGHT_VIEWER_SWRS_0105]
// In the tree menu under the <NetworkParameters> node, the tool shall display the objects organized in two main nodes:
// •	<InterfaceDefinitions>: displaying the list of <interfaceDefinition>  and elements owned or associated with <interfaceDefinition>.
// •	<Objects>: displaying the list of objects part of the <interfaceDefinition> in a flat structure.
// [RIGHT_VIEWER_SWRS_0106]
// In the tree menu under the <NetworkParameters.InterfaceDefinitions> node, the tool shall define the list of <interfaceDefinition>.
// For each <interfaceDefinition> create branches recursively for displaying the list of owned <interfaceConnection>.
// [RIGHT_VIEWER_SWRS_0107]
// In the tree menu under <NetworkParameters.Objects> node, the tool shall create a branch and display its instances:
// •	For each class being an extension of <tInterfaceElement>.
// Example: connectionTypeDefinition, ethernetPortConfiguration, etc.,
// Note: The branch shall be displayed only if at least one instance of that class is present.
// 5.8.2.3.4	ParameterSettings
// [RIGHT_VIEWER_SWRS_0108]
// In the tree menu under <EquipmentTypeParametersDefinitions> node, the tool shall create a branch and display its instances:
// •	For each class being an extension of <tEquipmentParametersElement>.
// Example: MooNParametersDefinition, etc.,
// Note: The branch shall be displayed only if at least one instance of that class is present

export class NetworkParametersTreeMenuRule extends ANodeFactoryRule {
  protected params = {
    categoryId: "NetworkParameters",
    nodesConfig: [
      {
        id: "NetworkParameters",
        label: "Network Parameters",
        addChildrenCount: true,
        params: {
          getChildrenCount: (n: any) =>
            n && n.nodes && n.nodes.length >= 2 && n.nodes[1] && n.nodes[1].getChildrenCount !== undefined
              ? n.nodes[1].getChildrenCount(n.nodes[1])
              : 0,
        },

        nodesConfig: [
          { id: "InterfaceDefinitions", label: "Interface Definitions", addChildrenCount: true },
          {
            id: "NetworkParametersObjects",
            label: "Objects",
            addChildrenCount: true,
            params: { countSubChildren: true },
          },
        ],
      },
    ],

    interfaceDefinitionCategoryId: "InterfaceDefinitions",
    interfaceDefinitionCategoryType: "interfaceDefinition", // GenericADM:
    objectsCategoryId: "NetworkParametersObjects",

    interfaceDefinitionNodesConfig: [
      { type: "interfaceConnection", parentType: "GenericADM:interfaceDefinition" }, // GenericADM:
    ],

    objectsTypes: ["tInterfaceElement"],
  };

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    let nodes = [];
    if (object && context && context.project && context.project.id) {
      // InterfaceDefinition ?
      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [this.params.interfaceDefinitionCategoryType])) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: true,
          sortValue: (n: any) => n.label,
        });
        if (node) {
          nodes.push(node);
          const categoryId = this.params.interfaceDefinitionCategoryId;
          const newParentNode = this.rulesNodeFactory.getCategoryNodeById(
            this.rulesNodeFactory.getProjectNodeId(context.project, categoryId)
          );
          this.rulesNodeFactory.addNodeToParent(node, newParentNode);

          if (!context.lastNodesByTypeMap) {
            context.lastNodesByTypeMap = new Map<string, any>();
          }
          context.lastNodesByTypeMap.set(node.object.type, node);
        }
      } else {
        // interfaceConnection ?
        this.params.interfaceDefinitionNodesConfig.forEach((equipmentRoomNodeConfig: any) => {
          if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [equipmentRoomNodeConfig.type])) {
            // Create node and add it to parent
            if (context.lastNodesByTypeMap) {
              const parentEquipmentRoomNode = context.lastNodesByTypeMap.get(equipmentRoomNodeConfig.parentType);
              if (parentEquipmentRoomNode) {
                const equipmentItemNode = this.rulesNodeFactory.buildNodeFromObject(object, null, context, {
                  addChildrenCountToNode: true,
                  sortValue: (n: any) => n.label,
                });
                if (equipmentItemNode) {
                  nodes.push(equipmentItemNode);
                  context.lastNodesByTypeMap.set(equipmentItemNode.object.type, equipmentItemNode);
                  this.rulesNodeFactory.addNodeToParent(equipmentItemNode, parentEquipmentRoomNode);
                }
              }
            }
          }
        });
      }

      nodes = nodes.concat(
        this.rulesNodeFactory.testAndAddObjectToObjectTypeNode(
          object,
          context,
          this.rulesNodeFactory.getCategoryNodeById(
            this.rulesNodeFactory.getProjectNodeId(context.project, this.params.objectsCategoryId)
          ),
          this.params.objectsTypes
        )
      );
    }

    return nodes;
  }
}
