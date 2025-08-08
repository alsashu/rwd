import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

// TODO
// ExtendedAreas contents ?

// <TrackGroups>
// •	<ExtendedAreas>: displaying the list of <extendedArea>.
// •	<Lines>: displaying the list of lines and their associated lineParameters.
export class TrackGroupsCompareTreeRule extends ANodeFactoryRule {
  private params: any = {
    nodesConfig: [
      {
        id: "TrackGroups",
        label: "Track Groups",
        addChildrenCount: true,
        params: {
          countSubChildren: true,
        },
        nodesConfig: [
          { id: "ExtendedAreas", label: "Extended Areas", addChildrenCount: true },
          { id: "Lines", label: "Lines", addChildrenCount: true },
        ],
      },
    ],

    linesConfig: {
      types: ["eLine"],
      categoryId: "Lines",
      lineParametersNodesConfig: [
        {
          id: "LineParameters",
          label: "Line Parameters",
          addChildrenCount: true,
          params: { sortValue: (node: any) => "ZZZ100" },
          nodesConfig: [],
        },
      ],
    },

    extendedAreasConfig: { types: ["tExtendedArea"], categoryId: "ExtendedAreas" },
  };

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];

    // trackRef under Line
    if (
      object &&
      context &&
      context.project &&
      context.project.id &&
      parentNode &&
      parentNode.object &&
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["trackGroups"])
    ) {
      // Lines
      let node = null;
      // Fix because test if line is eLine doesn't work
      if (object.type === "line") {
        node = this.rulesNodeFactory.buildNodeFromObject(object, null, context, { sortValue: (n: any) => n.label });
        if (node) {
          this.rulesNodeFactory.addNodeToCategoryById(node, context.project, this.params.linesConfig.categoryId);
        }
      }

      if (node) {
        nodes.push(node);

        const lineParametersNodes = this.rulesNodeFactory.buildMainCategoriesNodesRec(
          context.project,
          node,
          this.params.linesConfig.lineParametersNodesConfig,
          {
            keyPrefix: (context && context.project ? context.project.id + "-" : "") + node.object.id,
          }
        );
        this.rulesNodeFactory.addNodesToParent(lineParametersNodes, node);
      }

      if (
        this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, ["trackRef"]) &&
        this.rulesNodeFactory.isTypeExtensionOfTypes(parentNode.object.type, this.params.linesConfig.types)
      ) {
        // Find track with trackRef.ref
        const track = this.rulesNodeFactory.getObjectFromId(
          context && context.project ? context.project : null,
          "track",
          object.ref
        );
        if (track) {
          node = this.rulesNodeFactory.buildNodeFromObject(track, null, context, {
            sortValue: (n: any) => n.label,
          });
          nodes.push(node);
          this.rulesNodeFactory.addNodeToParent(node, parentNode);
        }
      }

      // tLineParameter
      if (
        this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, ["tLineParameter"]) &&
        this.rulesNodeFactory.isTypeExtensionOfTypes(parentNode.object.type, this.params.linesConfig.types)
      ) {
        const lineParametersNode = parentNode.nodes.find((n: any) => n.label === "LineParameters");
        if (lineParametersNode) {
          const typeNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
            object.type,
            context.project,
            lineParametersNode
          );
          if (typeNode) {
            node = this.rulesNodeFactory.buildNodeFromObject(object, typeNode, context, null);
            nodes.push(node);
            this.rulesNodeFactory.addNodeToParent(node, typeNode);
          }
        }
      }

      // ExtendedAreas
      node = this.rulesNodeFactory.createNodeAndAddToCategoryIfExtensionOf(
        object,
        context,
        this.params.extendedAreasConfig.types,
        this.params.extendedAreasConfig.categoryId,
        { sortValue: (n: any) => n.label }
      );
      if (node) {
        nodes.push(node);
      }
    }

    return nodes;
  }
}
