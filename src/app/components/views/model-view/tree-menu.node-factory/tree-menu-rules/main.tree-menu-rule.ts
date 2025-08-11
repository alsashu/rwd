import { ModelTreeMenuRule } from "./model/model.tree-menu-rule";
import { InfrastructureTreeMenuRule } from "./infrastructure-rules/infrastructure.tree-menu-rule";
import { IOMappingTreeMenuRule } from "./io-mapping-rules/io-mapping.tree-menu-rule";
import { SysArtTreeMenuRule } from "./sys-art-rules/sys-art.tree-menu-rule";
import { WiringDiagramsTreeMenuRule } from "./wiring-diagrams-rules/wiring-diagrams.tree-menu-rule";
import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { DiagramsTreeMenuRule } from "./diagrams-rules/diagrams.tree-menu-rule";
import { NonRailmlObjectsTreeMenuRule } from "./infrastructure-rules/non-railml-objects.tree-menu-rule";

export class MainTreeMenuRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IRulesNodeFactory) {
    super(rulesNodeFactory, [
      new DiagramsTreeMenuRule(rulesNodeFactory),
      // new NonRailmlObjectsTreeMenuRule(rulesNodeFactory),
      new ModelTreeMenuRule(rulesNodeFactory),
      new InfrastructureTreeMenuRule(rulesNodeFactory),
      new IOMappingTreeMenuRule(rulesNodeFactory),
      new SysArtTreeMenuRule(rulesNodeFactory),
      new WiringDiagramsTreeMenuRule(rulesNodeFactory),
    ]);
  }
}
