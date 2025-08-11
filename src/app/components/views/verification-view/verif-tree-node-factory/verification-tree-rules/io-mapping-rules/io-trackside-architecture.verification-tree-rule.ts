import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { ModelVisitor } from "src/app/services/model/model.visitor";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";

export class IOTrackSideArchitectureVerificationTreeRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "IOTrackSideArchitecture",

    nodesConfig: [
      {
        id: "IOTrackSideArchitecture",
        label: "IO Track Side Architecture",
        addChildrenCount: true,
        params: {
          getChildrenCount: (n: any) =>
            n && n.nodes && n.nodes.length >= 2 && n.nodes[1] && n.nodes[1].getChildrenCount !== undefined
              ? n.nodes[1].getChildrenCount(n.nodes[1])
              : 0,
        },
        nodesConfig: [
          { id: "IOMappingEquipmentRooms", label: "Equipment Rooms", addChildrenCount: true },
          {
            id: "IOMappingTracksideArchitectureObjects",
            label: "Objects",
            addChildrenCount: true,
            params: { countSubChildren: true },
          },
        ],
      },
    ],

    equipmentRoomsCategoryId: "IOMappingEquipmentRooms",
    equipmentRoomsCategoryType: "equipmentRoom",
    objectsCategoryId: "IOMappingTracksideArchitectureObjects",

    equipmentRoomNodesConfig: [
      { type: "assembly", parentType: "GenericADM:equipmentRoom" },
      { type: "cubicle", parentType: "GenericADM:assembly" },
      { type: "equipment", parentType: "GenericADM:cubicle" },
      { type: "rack", parentType: "GenericADM:equipment" },
      { type: "board", parentType: "GenericADM:rack", addChildrenCountToNode: false },
    ],

    objectsTypes: ["tArchitectureElement"],

    ioVariablesNodesConfig: [
      {
        id: "EquipmentRoomIOVariable",
        label: "IO Variables",
        addChildrenCount: true,
        params: { sumSubChildren: true, sortValue: (n: any) => "zzz" },
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
    let nodes = [];
    if (
      object &&
      object.type &&
      context &&
      context.project &&
      context.project.id &&
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:trackSideArchitecture"])
    ) {
      const categoryId = this.params.equipmentRoomsCategoryId;
      const mapPrefix = categoryId + "-";

      // EquipmentRoom ?
      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [this.params.equipmentRoomsCategoryType])) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: true,
          getChildrenCount: (n: any) => (n && n.nodes ? n.nodes.length - 1 : 0),
          sortValue: (n: any) => n.label,
        });
        if (node) {
          nodes.push(node);
          const newParentNode = this.rulesNodeFactory.getCategoryNodeById(
            this.rulesNodeFactory.getProjectNodeId(context.project, categoryId)
          );
          this.rulesNodeFactory.addNodeToParent(node, newParentNode);
          this.rulesNodeFactory.addObjectPropertiesNodes(node, context);

          if (!context.lastNodesByTypeMap) {
            context.lastNodesByTypeMap = new Map<string, any>();
          }
          context.lastNodesByTypeMap.set(mapPrefix + node.object.type, node);

          // Add IOVariable node with connected objects types, objects and var links to these objects
          this.buildIOVariableNode(object, node, context);
        }
      } else {
        // EquipmentRooms content (<assembly>, <cubicle>, <equipment>, <rack>, <board>) ?
        this.params.equipmentRoomNodesConfig.forEach((equipmentRoomNodeConfig: any) => {
          if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, [equipmentRoomNodeConfig.type])) {
            // Create node and add it to parent
            if (context.lastNodesByTypeMap) {
              const equipmentItemParentNode = context.lastNodesByTypeMap.get(
                mapPrefix + equipmentRoomNodeConfig.parentType
              );
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
                  context.lastNodesByTypeMap.set(mapPrefix + equipmentItemNode.object.type, equipmentItemNode);
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
  /**
   * Build IO Variables node under equipmentRoom
   * @param equipmentRoom Equipment Room
   * @param equipmentRoomNode Equipment Room node
   * @param context Context
   */
  private buildIOVariableNode(equipmentRoom: any, equipmentRoomNode: any, context: any) {
    const typeNodes = new Map();
    const objectNodes = new Map();

    const subNodes = this.rulesNodeFactory.buildMainCategoriesNodesRec(
      context.project,
      equipmentRoomNode,
      this.params.ioVariablesNodesConfig
    );
    const ioVariablesNode = subNodes.length === 1 ? subNodes[0] : null;
    this.rulesNodeFactory.addNodeToParent(ioVariablesNode, equipmentRoomNode);

    if (
      ioVariablesNode &&
      context.project["GenericADM:iOVariableMappings"] &&
      context.project["GenericADM:iOVariableMappings"].forEach &&
      context.project.infrastructure
    ) {
      context.project["GenericADM:iOVariableMappings"].forEach((iOVariableMapping: any) => {
        // const iOVariableMapping = new ModelVisitor().findCB(
        //   context.project["GenericADM:iOVariableMappings"],
        //   (o: any) => o && o.type === "GenericADM:iOVariableMapping" && o.equipmentRef === equipmentRoom.id
        // );
        if (iOVariableMapping["GenericADM:iOVariables"] && iOVariableMapping["GenericADM:iOVariables"].forEach) {
          iOVariableMapping["GenericADM:iOVariables"].forEach((ioVariable: any) => {
            // find equipement with elementIDRef and type elementtypeRef
            // find or create type node
            // find or create object node
            // add variable to node

            const connectedFieldEquipment = ioVariable["GenericADM:connectedFieldEquipment"];
            if (
              connectedFieldEquipment &&
              connectedFieldEquipment.elementIDRef &&
              connectedFieldEquipment.elementtypeRef
            ) {
              const objectType = connectedFieldEquipment.elementtypeRef;
              const refObject = new ModelVisitor().findCB(
                context.project.infrastructure,
                (o: any) => o && o.type === objectType && o.id === connectedFieldEquipment.elementIDRef
              );

              if (refObject) {
                let typeNode = typeNodes.get(objectType);
                if (!typeNode) {
                  const typeObject = { id: "iomapping-" + objectType, label: objectType, type: objectType };
                  typeNode = this.rulesNodeFactory.buildNodeFromObject(typeObject, ioVariablesNode, context, {
                    addChildrenCountToNode: true,
                    countSubChildren: true,
                    sortValue: (n: any) => n.label,
                  });

                  this.rulesNodeFactory.addNodeToParent(typeNode, ioVariablesNode);
                  typeNodes.set(objectType, typeNode);
                }

                const key = objectType + "-" + refObject.id;
                let objectNode = objectNodes.get(key);
                if (!objectNode) {
                  objectNode = this.rulesNodeFactory.buildNodeFromObject(refObject, typeNode, context, {
                    addChildrenCountToNode: true,
                    sortValue: (n: any) => n.label,
                  });
                  this.rulesNodeFactory.addNodeToParent(objectNode, typeNode);
                  objectNodes.set(key, objectNode);
                }

                const ioVariableMappingNode = this.rulesNodeFactory.buildNodeFromObject(
                  ioVariable,
                  objectNode,
                  context,
                  {
                    addChildrenCountToNode: false,
                    sortValue: (n: any) => n.label,
                  }
                );
                if (ioVariableMappingNode) {
                  this.rulesNodeFactory.addNodeToParent(ioVariableMappingNode, objectNode);
                }
              }
            }
          });
        }
      });
    }
  }
}
