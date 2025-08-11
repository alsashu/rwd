import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { ICompareTreeNodeFactory } from "../../compare-tree.node-factory";
import { TopologicalObjectsCompareTreeRule } from "./topological-objects.compare-tree-rule";
import { LogicalObjectsCompareTreeRule } from "./logical-objects.compare-tree-rule";
import { SpecificModuleCompareTreeRule } from "./specific-module.compare-tree-rule";
import { TrackExtremitiesCompareTreeRule } from "./track-extremities.compare-tree-rule";
import { TrackGroupsCompareTreeRule } from "./track-groups.compare-tree-rule";
import { TracksCompareTreeRule } from "./tracks.compare-tree-rule";
import { GroupableObjectsCompareTreeMenuRule } from "./groupable-objects.compare.tree-menu-rule";

// The tool shall display in the tree menu the objects organized with the following nodes:
// 1.	Logical objects: displaying the information of all the logical objects and the elements defined in infraAttrGroups
// 2.	Topological objects: displaying the information of all the topological objects
// 3.	TrackGroups: displaying the information of lines or project areas
// 4.	Tracks: displaying the information of all tracks and the associated track objects
// 5.	SpecificModule:
// a.	CableLayoutModule: defining the informantion of Cables.
export class InfrastructureCompareTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: ICompareTreeNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new LogicalObjectsCompareTreeRule(rulesNodeFactory),
        new TopologicalObjectsCompareTreeRule(rulesNodeFactory),
        new SpecificModuleCompareTreeRule(rulesNodeFactory),
        new TrackExtremitiesCompareTreeRule(rulesNodeFactory),
        new TrackGroupsCompareTreeRule(rulesNodeFactory),
        new TracksCompareTreeRule(rulesNodeFactory),
        new GroupableObjectsCompareTreeMenuRule(rulesNodeFactory),
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
