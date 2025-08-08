import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

// 3.	IOPhysicalMappings: displaying the physical board details aligned with the classes whose extension types
//  are <tIOBoard>, <tBoardParameterSet>, <tCellParameterSet> under branches
// <Boards>, <BoardsParameterSet>, <CellsParameterSet> respectively.

// "GenericADM:iOPhysicalMappings": [
//   {
//     "type": "GenericADM:boards",
//     "label": "GenericADM:boards",
//     "GenericADM:EIOCOMBoard": [
//         {
//           "type": "GenericADM:EIOCOMBoard",
//           "label": "1",
//           "id": "1",
//           "iOPhysicalBoardRef": "1",
//           "xmlType": "GenericADM:EIOCOMBoard"
//         },

export class IOPhysicalMappingsCompareTreeRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "IOPhysicalMappings",
    nodesConfig: [
      {
        id: "IOPhysicalMappings",
        label: "IO Physical Mappings",
        addChildrenCount: true,
        params: {
          sumSubChildren: true,
        },

        nodesConfig: [
          {
            id: "IOPhysicalMappingsBoards",
            label: "Boards",
            addChildrenCount: true,
            params: {
              countSubChildren: true,
            },
          },
          {
            id: "IOPhysicalMappingsBoardsParameterSet",
            label: "Boards Parameter Set",
            addChildrenCount: true,
            params: {
              countSubChildren: true,
            },
          },
          {
            id: "IOPhysicalMappingsCellsParameterSet",
            label: "Cells Parameter Set",
            addChildrenCount: true,
            params: {
              countSubChildren: true,
            },
          },
        ],
      },
    ],

    idAndCategoryList: [
      {
        categoryId: "IOPhysicalMappingsBoards",
        categoryTypes: ["tIOBoard"],
      },
      {
        categoryId: "IOPhysicalMappingsBoardsParameterSet",
        categoryTypes: ["tBoardParameterSet"],
      },
      {
        categoryId: "IOPhysicalMappingsCellsParameterSet",
        categoryTypes: ["tCellParameterSet"],
      },
    ],
  };

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    let nodes = [];
    if (
      object &&
      context &&
      context.project &&
      context.project.id &&
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["GenericADM:iOPhysicalMappings"])
    ) {
      this.params.idAndCategoryList.forEach((idAndCategory: any) => {
        nodes = nodes.concat(
          this.buildAndAddNodesFromIdAndCategryList(object, parentNode, context, {
            categoryId: idAndCategory.categoryId,
            categoryTypes: idAndCategory.categoryTypes,
          })
        );
      });
    }
    return nodes;
  }

  public buildAndAddNodesFromIdAndCategryList(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];

    if (this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, params.categoryTypes)) {
      const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, {
        addChildrenCountToNode: false,
        // sortType: "number",
        // sortValue: (n: any) => (n.object && n.object.absPos ? parseFloat(n.object.absPos) : n.object && n.object.label ? n.object.label : 0),
      });
      if (node) {
        nodes.push(node);
        const parentClassNode = this.rulesNodeFactory.findOrCreateNodeFromObjectType(
          object.type,
          context.project,
          this.rulesNodeFactory.getNodeFromKey(
            this.rulesNodeFactory.getProjectNodeId(context.project, params.categoryId)
          )
        );
        if (parentClassNode) {
          this.rulesNodeFactory.addNodeToParent(node, parentClassNode);
        }
      }
    }
    return nodes;
  }
}
