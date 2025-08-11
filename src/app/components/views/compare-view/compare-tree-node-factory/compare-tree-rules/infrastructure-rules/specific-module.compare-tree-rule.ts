import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { ICompareTreeNodeFactory } from "../../compare-tree.node-factory";

// 5.	SpecificModule:
//   a.	CableLayoutModule: defining the informantion of Cables.
export class SpecificModuleCompareTreeRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "SpecificModule",
    categoryIdCableLayoutModule: "CableLayoutModule",

    nodesConfig: [
      {
        id: "SpecificModule",
        label: "Specific Module",
        addChildrenCount: true,
        params: {
          getChildrenCount: (n: any) =>
            n && n.nodes && n.nodes.length >= 1 && n.nodes[0] && n.nodes[0].getChildrenCount !== undefined
              ? n.nodes[0].getChildrenCount(n.nodes[0])
              : 0,
        },
        nodesConfig: [
          {
            id: "CableLayoutModule",
            label: "Cable Layout Module",
            addChildrenCount: true,
            params: {
              countSubChildren: true,
            },
            nodesConfig: [
              // {
              //   id: "Cables",
              //   label: "Cables",
              //   addChildrenCount: true,
              // },
            ],
          },
        ],
      },
    ],
    // categoryTypes: ["tCable", "tCableDuctTrackCrossing"], // TODO to be deleted
    categoryTypes: ["tCable", "tTrackCrossingElement"],
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
      // this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["infrastructure"])
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, [
        "GenericADM:infrastructureForInstallation",
        "trackElements",
      ]) // TODO OPTIM 6845
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
              this.rulesNodeFactory.getProjectNodeId(context.project, this.params.categoryIdCableLayoutModule)
            )
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

// "GenericADM:cables": [
//   {
//     "type": "GenericADM:cable",
//     "label": "cable_1",
//     "id": "cable_1",
//     "connectedObjectType": "signal",
//     "connectedCenterRef": "junctionBox_1",
//     "connectedObjectRef": "signal_2",
//     "connectedCenterType": "junctionBox",
//     "cableType": "cable",
//     "xmlType": "GenericADM:cable"
//   },
//   {
//     "type": "GenericADM:cable",
//     "label": "cable_2",
//     "id": "cable_2",
//     "connectedObjectType": "signal",
//     "connectedCenterRef": "junctionBox_2",
//     "connectedObjectRef": "signal_6",
//     "connectedCenterType": "junctionBox",
//     "cableType": "cable",
//     "xmlType": "GenericADM:cable",
//     "GenericADM:passesByRefs": [
//       {
//         "type": "GenericADM:passesByRef",
//         "label": "GenericADM:passesByRef"
//       }
//     ],
//     "GenericADM:containedTrackCrossingByRefs": [
//       {
//         "type": "GenericADM:containedTrackCrossingByRef",
//         "label": "GenericADM:containedTrackCrossingByRef"
//       },
//       {
//         "type": "GenericADM:containedTrackCrossingByRef",
//         "label": "GenericADM:containedTrackCrossingByRef"
//       }
//     ]
//   },
