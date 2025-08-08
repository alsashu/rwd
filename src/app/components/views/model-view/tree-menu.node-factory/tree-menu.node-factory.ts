import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { RulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/rules.node-factory";
import { ITreeMemoService } from "src/app/components/app/generic-tree/tree-memo/tree-memo.service";
import { ModelService } from "src/app/services/model/model.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { MainTreeMenuRule } from "./tree-menu-rules/main.tree-menu-rule";
import { IMetaModelService } from "src/app/services/meta/meta-model.service";

export interface IModelConfigService {
  isTypeExtensionOfTypes(type: string, extensions: string[]): boolean;
}

/**
 * Tree menu node factory building nodes of generic tree component
 */
export class TreeMenuNodeFactory extends RulesNodeFactory implements IRulesNodeFactory {
  public modelService: ModelService;
  public metaModelService: IMetaModelService;

  constructor(protected treeMemoService: ITreeMemoService, params: any) {
    super(treeMemoService, params);
    this.params.mainRule = new MainTreeMenuRule(this);
    this.modelService = this.params.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.metaModelService = this.params.servicesService.getService(ServicesConst.MetaModelService) as IMetaModelService;
  }
}
