import { ASimpleNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/asimple-node-factory-rule";
import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { InfrastructureTableTreeRule } from "./model/infrastructure-rules/infrastructure.table-tree-rule";
import { ModelTableTreeRule } from "./model/model.table-tree-rule";

export class MainTableTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IRulesNodeFactory) {
    super(rulesNodeFactory, [
      new ModelTableTreeRule(rulesNodeFactory),
      new InfrastructureTableTreeRule(rulesNodeFactory),
    ]);
  }
}
