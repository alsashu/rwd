import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";
import { ComponentsVerificationTreeRule } from "./components.verification-tree-rule";
import { FramesVerificationTreeRule } from "./frames.verification-tree-rule";
import { InstantiatedDiagramsVerificationTreeRule } from "./instantiated-diagrams.verification-tree-rule";
import { TypicalDetailedDiagramsVerificationTreeRule } from "./typical-detailed-diagrams.verification-tree-rule";
import { TypicalFunctionalDiagramsVerificationTreeRule } from "./typical-functional-diagrams.verification-tree-rule";

export class WiringDiagramsVerificationTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new TypicalFunctionalDiagramsVerificationTreeRule(rulesNodeFactory),
        new TypicalDetailedDiagramsVerificationTreeRule(rulesNodeFactory),
        new ComponentsVerificationTreeRule(rulesNodeFactory),
        new InstantiatedDiagramsVerificationTreeRule(rulesNodeFactory),
        new FramesVerificationTreeRule(rulesNodeFactory),
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
