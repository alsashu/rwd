import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";

export class OnBoardArchitectureVerificationTreeRule extends ANodeFactoryRule {
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

  public constructor(public rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(rulesNodeFactory);
  }

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
          this.rulesNodeFactory.addObjectPropertiesNodes(node, context);

          if (!context.lastNodesByTypeMap) {
            context.lastNodesByTypeMap = new Map<string, any>();
          }
          context.lastNodesByTypeMap.set(node.object.type, node);
        }
      } else {
        // Trains content
        this.params.trainNodesConfig.forEach((trainNodeConfig: any) => {
          if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [trainNodeConfig.type])) {
            // Create node and add it to parent
            if (context.lastNodesByTypeMap) {
              const equipmentItemParentNode = context.lastNodesByTypeMap.get(trainNodeConfig.parentType);
              if (equipmentItemParentNode) {
                const equipmentItemNode = this.rulesNodeFactory.buildNodeFromObject(object, null, context, {
                  addChildrenCountToNode:
                    trainNodeConfig.addChildrenCountToNode !== undefined
                      ? trainNodeConfig.addChildrenCountToNode
                      : true,
                  sortValue: (n: any) => n.label,
                });
                if (equipmentItemNode) {
                  nodes.push(equipmentItemNode);
                  context.lastNodesByTypeMap.set(equipmentItemNode.object.type, equipmentItemNode);
                  this.rulesNodeFactory.addNodeToParent(equipmentItemNode, equipmentItemParentNode);
                  this.rulesNodeFactory.addObjectPropertiesNodes(equipmentItemNode, context);
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
        nodes = this.rulesNodeFactory.addObjectPropertiesNodesToNodes(
          nodes.concat(
            this.rulesNodeFactory.testAndAddObjectToObjectTypeNode(
              object,
              context,
              this.rulesNodeFactory.getCategoryNodeById(
                this.rulesNodeFactory.getProjectNodeId(context.project, this.params.objectsCategoryId)
              ),
              this.params.objectsTypes
            )
          ),
          context
        );
      }
    }

    return nodes;
  }
}
