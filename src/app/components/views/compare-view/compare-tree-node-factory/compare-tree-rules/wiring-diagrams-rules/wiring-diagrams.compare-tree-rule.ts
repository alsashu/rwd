import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { ComponentsCompareTreeRule } from "./components.compare-tree-rule";
import { FramesCompareTreeRule } from "./frames.compare-tree-rule";
import { InstantiatedDiagramsCompareTreeRule } from "./instantiated-diagrams.compare-tree-rule";
import { TypicalDetailedDiagramsCompareTreeRule } from "./typical-detailed-diagrams.compare-tree-rule";
import { TypicalFunctionalDiagramsCompareTreeRule } from "./typical-functional-diagrams.compare-tree-rule";

export class WiringDiagramsCompareTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IRulesNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new TypicalFunctionalDiagramsCompareTreeRule(rulesNodeFactory),
        new TypicalDetailedDiagramsCompareTreeRule(rulesNodeFactory),
        new ComponentsCompareTreeRule(rulesNodeFactory),
        new InstantiatedDiagramsCompareTreeRule(rulesNodeFactory),
        new FramesCompareTreeRule(rulesNodeFactory),
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
