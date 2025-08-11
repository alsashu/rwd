import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";

// 5.	SpecificModule:
//   a.	CableLayoutModule: defining the informantion of Cables.
export class SpecificModuleTableTreeRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "SpecificModule",
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
              {
                id: "Cables",
                label: "Cables",
                addChildrenCount: true,
              },
            ],
          },
        ],
      },
    ],
    categoryTypes: ["tSpecificModule"],
  };

  public buildMainCategoriesNodes(version: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(version, parentNode, this.params.nodesConfig);
  }

  // TODO
  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];
    return nodes;
  }
}
