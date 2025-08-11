import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

// In the tree menu under the <TracksideArchitecture> node, the tool shall display the objects organized in two main nodes:
// •	<EquipmentRooms>: displaying the list of <equipmentRoom>  and elements owned or associated with <equipmentRoom>.
// •	<Objects>: displaying the list of objects part of the <equipmentRoom> in a flat structure.

// In the tree menu under the <TracksideArchitecture.EquipmentRooms> node, the tool shall define the list of <equipmentRoom>.
// For each <equipmentRoom> create branches recursively for displaying the list of owned <assembly>, <cubicle>, <equipment>, <rack>, <board>.

// In the tree menu under <TracksideArchitecture.Objects> node, the tool shall create a branch and display its instances:
// •	For each class being an extension of <tArchitectureElement>.
// Example: Assembly, AssemblyConfiguration, etc.,
// •	For the below classes:
// o	<tPhysicalLink>
// o	<tPhysicalLinkCharacteristic>
// o	<tBackboneNetwork>
// o	<tBackboneNetworkConnection>
export class TracksideArchitectureTreeMenuRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "TracksideArchitecture",

    nodesConfig: [
      {
        id: "TracksideArchitecture",
        label: "Trackside Architecture",
        addChildrenCount: true,
        params: {
          getChildrenCount: (n: any) =>
            n && n.nodes && n.nodes.length >= 2 && n.nodes[1] && n.nodes[1].getChildrenCount !== undefined
              ? n.nodes[1].getChildrenCount(n.nodes[1])
              : 0,
        },
        nodesConfig: [
          { id: "EquipmentRooms", label: "Equipment Rooms", addChildrenCount: true },
          {
            id: "TracksideArchitectureObjects",
            label: "Objects",
            addChildrenCount: true,
            params: { countSubChildren: true },
          },
        ],
      },
    ],

    equipmentRoomsCategoryId: "EquipmentRooms",
    equipmentRoomsCategoryType: "equipmentRoom",
    objectsCategoryId: "TracksideArchitectureObjects",

    equipmentRoomNodesConfig: [
      { type: "assembly", parentType: "GenericADM:equipmentRoom" },
      { type: "cubicle", parentType: "GenericADM:assembly" },
      { type: "equipment", parentType: "GenericADM:cubicle" },
      { type: "rack", parentType: "GenericADM:equipment" },
      { type: "board", parentType: "GenericADM:rack", addChildrenCountToNode: false },
    ],

    objectsTypes: [
      "tArchitectureElement",
      "tPhysicalLink",
      "tPhysicalLinkCharacteristic",
      "tBackboneNetwork",
      "tBackboneNetworkConnection",
    ],
  };

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    let nodes = [];
    if (
      object &&
      object.type &&
      context &&
      context.project &&
      context.project.id &&
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:trackSideArchitecture"])
    ) {
      // EquipmentRoom ?
      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [this.params.equipmentRoomsCategoryType])) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: true,
          sortValue: (n: any) => n.label,
        });
        if (node) {
          nodes.push(node);
          const categoryId = this.params.equipmentRoomsCategoryId;
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
        // EquipmentRooms content (<assembly>, <cubicle>, <equipment>, <rack>, <board>) ?
        this.params.equipmentRoomNodesConfig.forEach((equipmentRoomNodeConfig: any) => {
          if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [equipmentRoomNodeConfig.type])) {
            // Create node and add it to parent
            if (context.lastNodesByTypeMap) {
              const equipmentItemParentNode = context.lastNodesByTypeMap.get(equipmentRoomNodeConfig.parentType);
              if (equipmentItemParentNode) {
                const equipmentItemNode = this.rulesNodeFactory.buildNodeFromObject(object, null, context, {
                  addChildrenCountToNode:
                    equipmentRoomNodeConfig.addChildrenCountToNode !== undefined
                      ? equipmentRoomNodeConfig.addChildrenCountToNode
                      : true,
                  sortValue: (n: any) => n.label,
                });
                if (equipmentItemNode) {
                  nodes.push(equipmentItemNode);
                  context.lastNodesByTypeMap.set(equipmentItemNode.object.type, equipmentItemNode);
                  this.rulesNodeFactory.addNodeToParent(equipmentItemNode, equipmentItemParentNode);
                }
              }
            }
          }
        });
      }

      // Objects folder
      let excludeObject = false;
      if (
        object &&
        object.type &&
        this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, ["tPhysicalLinkCharacteristic"]) &&
        parentNode &&
        parentNode.object &&
        parentNode.object.type !== "project"
      ) {
        excludeObject = true;
      }

      if (!excludeObject) {
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
    }

    return nodes;
  }
}
