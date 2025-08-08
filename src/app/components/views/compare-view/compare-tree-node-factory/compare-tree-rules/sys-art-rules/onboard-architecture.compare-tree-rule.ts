import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { ICompareTreeNodeFactory } from "../../compare-tree.node-factory";

// 5.8.1.3.2	OnBoardArchitecture
// OnBoardArchitecture is not fully implemented in SysArt. Need to do wait until June.
// [RIGHT_VIEWER_SWRS_0102]
// In the tree menu under the <OnBoardArchitecture> node, the tool shall display the objects organized in two main nodes:
// •	<Trains>: displaying the list of <train> and elements owned or associated with <train>.
// •	<Objects>: displaying the list of objects part of the <train> in a flat structure.
// [RIGHT_VIEWER_SWRS_0103]
// In the tree menu under the <OnBoardArchitecture.Trains> node, the tool shall define the list of <train>.
// For each <train> create branches recursively for displaying the list of owned <car>, <onBoardCubicle>, <onBoardEquipment>.
// [RIGHT_VIEWER_SWRS_0104]
// In the tree menu under <OnBoardArchitecture.Objects> node, the tool shall create a branch and display its instances:
// •	For each class being an extension of <tOnBoardArchitectureElement>.
// Example: Train, Car, etc.,
// •	For the below classes:
// o	<tPhysicalLink>
// o	<tPhysicalLinkCharacteristic>
// o	<tBackboneNetwork>
// o	<tBackboneNetworkConnection>
// Note: The branch shall be displayed only if at least one instance of that class is present.

export class OnBoardArchitectureCompareTreeRule extends ANodeFactoryRule {
  protected params = {
    categoryId: "OnBoardArchitecture",
    nodesConfig: [
      {
        id: "OnBoardArchitecture",
        label: "On-Board Architecture",
        addChildrenCount: true,
        params: {
          getChildrenCount: (n: any) =>
            n && n.nodes && n.nodes.length >= 2 && n.nodes[1] && n.nodes[1].getChildrenCount !== undefined
              ? n.nodes[1].getChildrenCount(n.nodes[1])
              : 0,
        },
        nodesConfig: [
          {
            id: "Trains",
            label: "Trains",
            addChildrenCount: true,
          },
          {
            id: "OnBoardArchitectureObjects",
            label: "Objects",
            addChildrenCount: true,
            params: {
              countSubChildren: true,
            },
          },
        ],
      },
    ],

    trainsCategoryId: "Trains",
    trainsCategoryType: "train",

    objectsCategoryId: "OnBoardArchitectureObjects",

    trainNodesConfig: [
      { type: "car", parentType: "GenericADM:train" },
      { type: "onBoardCubicle", parentType: "GenericADM:car" },
      { type: "onBoardEquipment", parentType: "GenericADM:onBoardCubicle", addChildrenCountToNode: false },
    ],

    objectsTypes: [
      "tOnBoardArchitectureElement",
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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:onBoardArchitecture"])
    ) {
      const compareRulesNodeFactory = this.rulesNodeFactory as ICompareTreeNodeFactory;
      // Train ?
      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [this.params.trainsCategoryType])) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: true,
          sortValue: (n: any) => n.label,
        });
        if (node) {
          nodes.push(node);
          const categoryId = this.params.trainsCategoryId;
          const newParentNode = this.rulesNodeFactory.getCategoryNodeById(
            this.rulesNodeFactory.getProjectNodeId(context.project, categoryId)
          );
          this.rulesNodeFactory.addNodeToParent(node, newParentNode);
          compareRulesNodeFactory.addNodeToLastNodesByTypeMap(node);
        }
      } else {
        // Trains content
        this.params.trainNodesConfig.forEach((trainNodeConfig: any) => {
          if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [trainNodeConfig.type])) {
            // Create node and add it to parent
            const equipmentItemParentNode = compareRulesNodeFactory.getLastNodeByType(trainNodeConfig.parentType);
            if (equipmentItemParentNode) {
              const equipmentItemNode = this.rulesNodeFactory.buildNodeFromObject(object, null, context, {
                addChildrenCountToNode:
                  trainNodeConfig.addChildrenCountToNode !== undefined ? trainNodeConfig.addChildrenCountToNode : true,
                sortValue: (n: any) => n.label,
              });
              if (equipmentItemNode) {
                nodes.push(equipmentItemNode);
                compareRulesNodeFactory.addNodeToLastNodesByTypeMap(equipmentItemNode);
                this.rulesNodeFactory.addNodeToParent(
                  equipmentItemNode,
                  compareRulesNodeFactory.getMainSibblingNode(equipmentItemParentNode)
                );
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
