import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { NetworkParametersCompareTreeRule } from "./network-parameters.compare-tree-rule";
import { OnBoardArchitectureCompareTreeRule } from "./onboard-architecture.compare-tree-rule";
import { ParameterSettingsCompareTreeRule } from "./parameter-settings.compare-tree-rule";
import { TracksideArchitectureCompareTreeRule } from "./trackside-architecture.compare-tree-rule";

export class SysArtCompareTreeRule extends CompositeNodeFactoryRule {
  public constructor(treeMenuNodeFactory: IRulesNodeFactory) {
    super(
      treeMenuNodeFactory,
      [
        new TracksideArchitectureCompareTreeRule(treeMenuNodeFactory),
        new OnBoardArchitectureCompareTreeRule(treeMenuNodeFactory),
        new NetworkParametersCompareTreeRule(treeMenuNodeFactory),
        new ParameterSettingsCompareTreeRule(treeMenuNodeFactory),
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
