import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { LogicalObjectsTableTreeRule } from "./logical-objects.table-tree-rule";
import { SpecificModuleTableTreeRule } from "./specific-module.table-tree-rule";
import { TopologicalObjectsTableTreeRule } from "./topological-objects.table-tree-rule";
import { TrackGroupsTableTreeRule } from "./track-groups.table-tree-rule";
import { TracksTableTreeRule } from "./tracks.table-tree-rule";

// The tool shall display in the tree menu the objects organized with the following nodes:
// 1.	Logical objects: displaying the information of all the logical objects and the elements defined in infraAttrGroups
// 2.	Topological objects: displaying the information of all the topological objects
// 3.	TrackGroups: displaying the information of lines or project areas
// 4.	Tracks: displaying the information of all tracks and the associated track objects
// 5.	SpecificModule:
// a.	CableLayoutModule: defining the informantion of Cables.
export class InfrastructureTableTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IRulesNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new LogicalObjectsTableTreeRule(rulesNodeFactory),
        new TopologicalObjectsTableTreeRule(rulesNodeFactory),
        new TrackGroupsTableTreeRule(rulesNodeFactory),
        new TracksTableTreeRule(rulesNodeFactory),
        new SpecificModuleTableTreeRule(rulesNodeFactory),
      ],
      {
        categoryId: "Infrastructure",
        nodesConfig: [{ id: "Infrastructure", label: "Infrastructure" }],
      }
    );
  }

  public continueToBuildNodes(object: any, parentNode: any, context: any, params: any = null): boolean {
    return this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, [
      "infrastructure",
      "GenericADM:logicalElements",
    ]);
  }
}
