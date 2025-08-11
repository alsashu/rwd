import { ASimpleNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/asimple-node-factory-rule";

export class DefaultNodeFactoryRule extends ASimpleNodeFactoryRule {
  protected params = {
    categoryId: "DefaultCategory",
    nodesConfig: [{ id: "DefaultCategory", label: "...", addChildrenCount: false }],
    categoryTypes: [],
  };
}
