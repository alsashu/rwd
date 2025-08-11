import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";

// [RIGHT_VIEWER_SWRS_0094]
// (X) In the tree menu under <Tracks> node, the tool shall display the instances of class <eTrack>.
// [RIGHT_VIEWER_SWRS_0095]
// In the tree menu under each line instance, the tool shall display the instances of all following objects defined in the RailML based data model:
// (X) •	Elements of <trackTopology> whose class is being an extension of <tBasePlacedElement> or by <tMileageChange>.
// (X) •	Elements of <ocsElements> whose class is being a direct or indirect extension of <tBasePlacedElement>
// (X) •	Elements of <trackElements> whose class is being a direct or indirect extension of <tBasePlacedElement>
// [RIGHT_VIEWER_SWRS_0096]
// (X) Each track itself shall contain a leaf for each object linked to this track. The object shall be organized by rising <pos> value.
// [RIGHT_VIEWER_SWRS_0097]

// (=> TODO) In the particular case of Linear and Area Object defined across several tracks, the object will displayed under each track in the Track Node (as defined in the RailML.xml) file.
export class TracksVerificationTreeRule extends ANodeFactoryRule {
  private params: any = {
    nodesConfig: [
      {
        id: "Tracks",
        label: "Tracks",
        addChildrenCount: true,
      },
    ],
    tracksConfig: { types: ["eTrack"], categoryId: "Tracks" },
  };

  private lastTrackNode = null;

  public constructor(public rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(rulesNodeFactory);
  }

  public clear() {
    this.lastTrackNode = null;
  }

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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["tracks"]) // TODO OPTIM 6845
    ) {
      if (context.propertyName === "tracks") {
        this.lastTrackNode = null;
      }

      // Tracks
      let node = this.rulesNodeFactory.createNodeAndAddToCategoryIfExtensionOf(
        object,
        context,
        this.params.tracksConfig.types,
        this.params.tracksConfig.categoryId,
        {
          addChildrenCountToNode: true,
          sortValue: (n: any) => n.label,
        }
      );

      if (node) {
        nodes.push(node);

        // Memorize track node for elements under track node
        this.lastTrackNode = node;

        // Add track to map (for trackRef in lines)
        const nodeMapKey = this.rulesNodeFactory.getNodeId(
          context && context.project ? context.project : null,
          object.type,
          object.id
        );
        this.rulesNodeFactory.addNodeToNodeMap(nodeMapKey, node);
      }

      // •	Elements of <trackTopology> whose class is being an extension of <tBasePlacedElement> or by <tMileageChange>.
      // •	Elements of <ocsElements> whose class is being a direct or indirect extension of <tBasePlacedElement>
      // •	Elements of <trackElements> whose class is being a direct or indirect extension of <tBasePlacedElement>
      if (
        this.lastTrackNode &&
        context.propertyNamesStack &&
        context.propertyNamesStack.find((pn: string) => ["trackTopology", "ocsElements", "trackElements"].includes(pn))
      ) {
        if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, ["tBasePlacedElement", "tMileageChange"])) {
          const trackNode = this.lastTrackNode;
          if (trackNode && trackNode.object && trackNode.object.type === "track") {
            node = this.rulesNodeFactory.buildNodeFromObject(object, trackNode, context, {
              sortType: "number",
              sortValue: (n: any) =>
                n.object && n.object.absPos
                  ? parseFloat(n.object.absPos)
                  : n.object && n.object.label
                  ? n.object.label
                  : 0,
            });
            nodes.push(node);
            this.rulesNodeFactory.addNodeToParent(node, trackNode);
            this.rulesNodeFactory.addObjectPropertiesNodes(node, context);
          }
        }
      }
    }

    return nodes;
  }
}
