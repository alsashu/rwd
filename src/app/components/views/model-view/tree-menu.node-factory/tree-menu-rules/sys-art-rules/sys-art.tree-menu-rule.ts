import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { NetworkParametersTreeMenuRule } from "./network-parameters.tree-menu-rule";
import { OnBoardArchitectureTreeMenuRule } from "./onboard-architecture.tree-menu-rule";
import { ParameterSettingsTreeMenuRule } from "./parameter-settings.tree-menu-rule";
import { TracksideArchitectureTreeMenuRule } from "./trackside-architecture.tree-menu-rule";

export class SysArtTreeMenuRule extends CompositeNodeFactoryRule {
  public constructor(treeMenuNodeFactory: IRulesNodeFactory) {
    super(
      treeMenuNodeFactory,
      [
        new TracksideArchitectureTreeMenuRule(treeMenuNodeFactory),
        new OnBoardArchitectureTreeMenuRule(treeMenuNodeFactory),
        new NetworkParametersTreeMenuRule(treeMenuNodeFactory),
        new ParameterSettingsTreeMenuRule(treeMenuNodeFactory),
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
