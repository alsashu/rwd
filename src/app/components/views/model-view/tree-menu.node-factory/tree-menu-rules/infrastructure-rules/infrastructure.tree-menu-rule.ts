import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { SpecificModuleTreeMenuRule } from "./specific-module.tree-menu-rule";
import { LogicalObjectsTreeMenuRule } from "./logical-objects.tree-menu-rule";
import { TopologicalObjectsTreeMenuRule } from "./topological-objects.tree-menu-rule";
import { TrackExtremitiesTreeMenuRule } from "./track-extremities.tree-menu-rule";
import { TrackGroupsTreeMenuRule } from "./track-groups.tree-menu-rule";
import { TracksTreeMenuRule } from "./tracks.tree-menu-rule";
import { NonRailmlObjectsTreeMenuRule } from "./non-railml-objects.tree-menu-rule";
import { GroupableObjectsTreeMenuRule } from "./groupable-objects.tree-menu-rule";

/**
 * Infrastructure tree menu rule
 */
export class InfrastructureTreeMenuRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IRulesNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new LogicalObjectsTreeMenuRule(rulesNodeFactory),
        new TopologicalObjectsTreeMenuRule(rulesNodeFactory),
        new SpecificModuleTreeMenuRule(rulesNodeFactory),
        new TrackExtremitiesTreeMenuRule(rulesNodeFactory),
        new TrackGroupsTreeMenuRule(rulesNodeFactory),
        new TracksTreeMenuRule(rulesNodeFactory),
        new GroupableObjectsTreeMenuRule(rulesNodeFactory),
        new NonRailmlObjectsTreeMenuRule(rulesNodeFactory),
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
