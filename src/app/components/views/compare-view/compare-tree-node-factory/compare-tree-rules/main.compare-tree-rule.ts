import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { ICompareTreeNodeFactory } from "../compare-tree.node-factory";
import { InfrastructureCompareTreeRule } from "./infrastructure-rules/infrastructure.compare-tree-rule";
import { ModelCompareTreeRule } from "./model/model.compare-tree-rule";
import { IOMappingCompareTreeRule } from "./io-mapping-rules/io-mapping.compare-tree-rule";
import { SysArtCompareTreeRule } from "./sys-art-rules/sys-art.compare-tree-rule";
import { WiringDiagramsCompareTreeRule } from "./wiring-diagrams-rules/wiring-diagrams.compare-tree-rule";

export class MainCompareTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: ICompareTreeNodeFactory) {
    super(rulesNodeFactory, [
      new ModelCompareTreeRule(rulesNodeFactory),
      new InfrastructureCompareTreeRule(rulesNodeFactory),
      new IOMappingCompareTreeRule(rulesNodeFactory),
      new SysArtCompareTreeRule(rulesNodeFactory),
      new WiringDiagramsCompareTreeRule(rulesNodeFactory),
    ]);
  }
}
