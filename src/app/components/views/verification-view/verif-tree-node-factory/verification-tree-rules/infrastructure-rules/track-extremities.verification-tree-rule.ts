import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";

// In the tree menu under <Track Extremities> node, the tool shall create a branch and display its instances:
// 	For the below classes:
// o	<tBufferStop>
// o	<tConnectionData>
// o	<tOpenEnd>

export class TrackExtremitiesVerificationTreeRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "TrackExtremities",
    nodesConfig: [
      {
        id: "TrackExtremities",
        label: "Track Extremities",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
      },
    ],
    categoryTypes: ["tBufferStop", "tConnectionData", "tOpenEnd"],
  };

  public constructor(public rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(rulesNodeFactory);
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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["trackTopology"]) // TODO OPTIM
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
            this.rulesNodeFactory.addObjectPropertiesNodes(node, context);
          }
        }
      }
    }
    return nodes;
  }
}
