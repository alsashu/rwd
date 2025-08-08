import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IIomappingTreeNodeFactory } from "../iomapping-tree.node-factory";
import { ModelIomappingTreeRule } from "./model/model.iomapping-tree-rule";

export class MainIomappingTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IIomappingTreeNodeFactory) {
    super(rulesNodeFactory, [new ModelIomappingTreeRule(rulesNodeFactory)]);
  }
}
