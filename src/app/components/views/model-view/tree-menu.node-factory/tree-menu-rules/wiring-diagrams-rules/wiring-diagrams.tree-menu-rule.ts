import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { ComponentsTreeMenuRule } from "./components.tree-menu-rule";
import { FramesTreeMenuRule } from "./frames.tree-menu-rule";
import { InstantiatedDiagramsTreeMenuRule } from "./instantiated-diagrams.tree-menu-rule";
import { TypicalDetailedDiagramsTreeMenuRule } from "./typical-detailed-diagrams.tree-menu-rule";
import { TypicalFunctionalDiagramsTreeMenuRule } from "./typical-functional-diagrams.tree-menu-rule";

export class WiringDiagramsTreeMenuRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IRulesNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new TypicalFunctionalDiagramsTreeMenuRule(rulesNodeFactory),
        new TypicalDetailedDiagramsTreeMenuRule(rulesNodeFactory),
        new ComponentsTreeMenuRule(rulesNodeFactory),
        new InstantiatedDiagramsTreeMenuRule(rulesNodeFactory),
        new FramesTreeMenuRule(rulesNodeFactory),
      ],
      {
        categoryId: "WiringDiagrams",
        nodesConfig: [{ id: "WiringDiagrams", label: "Wiring Diagrams" }],
      }
    );
  }

  public continueToBuildNodes(object: any, parentNode: any, context: any, params: any = null): boolean {
    return this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, [
      "GenericADM:typicalDiagrams",
      "GenericADM:components",
      "GenericADM:instantiatedDiagrams",
    ]);
  }
}
