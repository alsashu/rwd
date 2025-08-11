import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

// In the tree menu under <Topological objects> node, the tool shall create a branch and display its instances:
// •	For each class being a direct or indirect extension of <tBasePlacedElement>.
// •	For each class being a direct or indirect extension of <tOrientedElement> or <tDelimitedOrientedElement> or <tStrictOrientedElement>
// •	For each class being a direct or indirect extension of <tPlacedElementWithLength>.
// •	For each class being a direct or indirect extension of <tGraphicalGroupableElement>.
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
export class TopologicalObjectsTableTreeRule extends ANodeFactoryRule {
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
      "tGraphicalGroupableElement",

      "eTrack",
      "eSwitch",
      "tBufferStop",
      "tCrossing",
      "tConnectionData",
      "tMileageChange",
      "tScaleArea",
      "tPageArea",
    ],
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
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["infrastructure"])
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
              this.rulesNodeFactory.getProjectNodeId(context.project, "TopologicalObjects")
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
