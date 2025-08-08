import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { ResultSearchTreeRule } from "./result.search-tree-rule";

/**
 * Main search tree rule
 */
export class MainSearchTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IRulesNodeFactory) {
    super(rulesNodeFactory, [new ResultSearchTreeRule(rulesNodeFactory)]);
  }
}
