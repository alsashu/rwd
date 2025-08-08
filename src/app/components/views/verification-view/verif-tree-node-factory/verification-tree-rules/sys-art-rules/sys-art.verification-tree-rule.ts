import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IVerificationTreeNodeFactory } from "../../verification-tree.node-factory";
import { NetworkParametersVerificationTreeRule } from "./network-parameters.verification-tree-rule";
import { OnBoardArchitectureVerificationTreeRule } from "./onboard-architecture.verification-tree-rule";
import { ParameterSettingsVerificationTreeRule } from "./parameter-settings.verification-tree-rule";
import { TracksideArchitectureVerificationTreeRule } from "./trackside-architecture.verification-tree-rule";

export class SysArtVerificationTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new TracksideArchitectureVerificationTreeRule(rulesNodeFactory),
        new OnBoardArchitectureVerificationTreeRule(rulesNodeFactory),
        new NetworkParametersVerificationTreeRule(rulesNodeFactory),
        new ParameterSettingsVerificationTreeRule(rulesNodeFactory),
      ],
      {
        categoryId: "SysArt",
        nodesConfig: [{ id: "SysArt", label: "System Architecture" }],
      }
    );
  }

  public continueToBuildNodes(object: any, parentNode: any, context: any, params: any = null): boolean {
    return this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, [
      "GenericADM:architecture",
      "GenericADM:networkParameters",
      "GenericADM:parametersSettings",
    ]);
  }
}
