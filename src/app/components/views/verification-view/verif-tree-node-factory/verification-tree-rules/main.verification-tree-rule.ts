import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IVerificationTreeNodeFactory } from "../verification-tree.node-factory";
import { InfrastructureVerificationTreeRule } from "./infrastructure-rules/infrastructure.verification-tree-rule";
import { IOMappingVerificationTreeRule } from "./io-mapping-rules/io-mapping.verification-tree-rule";
import { ModelVerificationTreeRule } from "./model/model.verification-tree-rule";
import { SysArtVerificationTreeRule } from "./sys-art-rules/sys-art.verification-tree-rule";
import { WiringDiagramsVerificationTreeRule } from "./wiring-diagrams-rules/wiring-diagrams.verification-tree-rule";

export class MainVerificationTreeRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IVerificationTreeNodeFactory) {
    super(rulesNodeFactory, [
      // new DiagramsVerificationTreeRule(rulesNodeFactory),
      new ModelVerificationTreeRule(rulesNodeFactory),
      new InfrastructureVerificationTreeRule(rulesNodeFactory),
      new IOMappingVerificationTreeRule(rulesNodeFactory),
      new SysArtVerificationTreeRule(rulesNodeFactory),
      new WiringDiagramsVerificationTreeRule(rulesNodeFactory),
    ]);
  }
}
