import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";
import { LogicalObjectsVerificationTreeRule } from "./logical-objects.verification-tree-rule";
import { SpecificModuleVerificationTreeRule } from "./specific-module.verification-tree-rule";
import { TopologicalObjectsVerificationTreeRule } from "./topological-objects.verification-tree-rule";
import { TrackExtremitiesVerificationTreeRule } from "./track-extremities.verification-tree-rule";
import { TrackGroupsVerificationTreeRule } from "./track-groups.verification-tree-rule";
import { TracksVerificationTreeRule } from "./tracks.verification-tree-rule";
import { GroupableObjectsVerificationTreeMenuRule } from "./groupable-objects.verification.tree-menu-rule";

// The tool shall display in the tree menu the objects organized with the following nodes:
// 1.	Logical objects: displaying the information of all the logical objects and the elements defined in infraAttrGroups
// 2.	Topological objects: displaying the information of all the topological objects
// 3.	TrackGroups: displaying the information of lines or project areas
// 4.	Tracks: displaying the information of all tracks and the associated track objects
// 5.	SpecificModule:
// a.	CableLayoutModule: defining the informantion of Cables.
export class InfrastructureVerificationTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new LogicalObjectsVerificationTreeRule(rulesNodeFactory),
        new TopologicalObjectsVerificationTreeRule(rulesNodeFactory),
        new SpecificModuleVerificationTreeRule(rulesNodeFactory),
        new TrackExtremitiesVerificationTreeRule(rulesNodeFactory),
        new TrackGroupsVerificationTreeRule(rulesNodeFactory),
        new TracksVerificationTreeRule(rulesNodeFactory),
        new GroupableObjectsVerificationTreeMenuRule(rulesNodeFactory),
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
      "GenericADM:applications",
      "ARGOS:logicalElementsAdditionalInfos",
      "GenericADM:nonRailMLElements",
    ]);
  }
}
