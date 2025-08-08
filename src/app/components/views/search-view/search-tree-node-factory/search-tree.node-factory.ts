import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { RulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/rules.node-factory";
import { ITreeMemoService } from "src/app/components/app/generic-tree/tree-memo/tree-memo.service";
import { MainSearchTreeRule } from "./search-tree-rules/main.search-tree-rule";

export interface IModelConfigService {
  isTypeExtensionOfTypes(type: string, extensions: string[]): boolean;
}

/**
 * Table tree node factory building nodes of generic tree component
 */
export class SearchTreeNodeFactory extends RulesNodeFactory implements IRulesNodeFactory {
  constructor(protected treeMemoService: ITreeMemoService, params: any) {
    super(treeMemoService, params);
    this.params.mainRule = new MainSearchTreeRule(this);
  }
}
