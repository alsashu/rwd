import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { ModelVisitor } from "src/app/services/model/model.visitor";

// In the tree menu under <Topological objects> node, the tool shall create a branch and display its instances:
// •	For each class being a direct or indirect extension of <tBasePlacedElement>.
// •	For each class being a direct or indirect extension of <tOrientedElement> or <tDelimitedOrientedElement> or <tStrictOrientedElement>
// •	For each class being a direct or indirect extension of <tPlacedElementWithLength>.
// •	For each class being a direct or indirect extension of <tGraphicalGroupableElement>. => moved to groupable objects
// •	For the below classes:
// o	<eTrack>
// o	<eSwitch>
// o	<tBufferStop>
// o	<tCrossing>
// o	<tConnectionData>
// o	<tMileageChange>
// o	<tScaleArea>
// o	<tPageArea>

// Note: The branch shall be displayed only if at least one instance of that class is present.
export class TopologicalObjectsTreeMenuRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "TopologicalObjects",
    nodesConfig: [
      {
        id: "TopologicalObjects",
        label: "Topological Objects",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
      },
    ],
    categoryTypes: [
      "tBasePlacedElement",
      "tOrientedElement",
      "tDelimitedOrientedElement",
      "tStrictOrientedElement",
      "tPlacedElementWithLength",
      // "tGraphicalGroupableElement", => moved to groupable objects

      "eTrack",

      "eSwitch",
      "tBufferStop",
      "tCrossing",
      "tConnectionData",

      "tMileageChange",
      "tScaleArea",
      "tPageArea",
    ],

    archiTypes: ["equipmentRoomTPE", "junctionBox"],
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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["infrastructure", "GenericADM:logicalElements"])
    ) {
      if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, this.params.categoryTypes)) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
          addChildrenCountToNode: false,
          sortType: "number",
          sortValue: (n: any) =>
            n.object && n.object.absPos ? parseFloat(n.object.absPos) : n.object && n.object.label ? n.object.label : 0,
        });
        if (node) {
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

          // Achi link groups under equipment rooms & junction boxes
          if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, this.params.archiTypes)) {
            if (
              context.project["GenericADM:logicalElements"] &&
              context.project["GenericADM:logicalElements"]["GenericADM:archiControlLinkGroups"]
            ) {
              const archiControlLinkGroups =
                context.project["GenericADM:logicalElements"]["GenericADM:archiControlLinkGroups"];
              if (archiControlLinkGroups.find) {
                const archiControlLinkGroup = archiControlLinkGroups.find((alg: any) => alg.elementIDRef === object.id);
                if (archiControlLinkGroup) {
                  const archiControlLinkGroupNode = this.rulesNodeFactory.buildNodeFromObject(
                    archiControlLinkGroup,
                    node,
                    context,
                    {
                      addChildrenCountToNode: false,
                    }
                  );
                  this.rulesNodeFactory.addNodeToParent(archiControlLinkGroupNode, node);
                  this.buildArchiControlLinkGroupNodes(archiControlLinkGroupNode, context, params);
                }
              }
            }
          }
        }
      }
    }
    return nodes;
  }

  public buildArchiControlLinkGroupNodes(archiControlLinkGroupNode: any, context: any, params: any = null) {
    const archiControlLinkGroup = archiControlLinkGroupNode.object;
    if (
      context &&
      context.project &&
      context.project.infrastructure &&
      archiControlLinkGroup &&
      archiControlLinkGroup["GenericADM:controlledElements"] &&
      archiControlLinkGroup["GenericADM:controlledElements"].forEach
    ) {
      archiControlLinkGroup["GenericADM:controlledElements"].forEach((controlledElement: any) => {
        const controlledEquipement = new ModelVisitor().findCB(context.project.infrastructure, (o: any) => {
          return o && o.id === controlledElement.elementIDRef;
        });
        if (controlledEquipement) {
          const controlledEquipementNode = this.rulesNodeFactory.buildNodeFromObject(
            controlledEquipement,
            archiControlLinkGroupNode,
            context,
            {
              addChildrenCountToNode: false,
            }
          );
          this.rulesNodeFactory.addNodeToParent(controlledEquipementNode, archiControlLinkGroupNode);
        }
      });
    }
  }
}
