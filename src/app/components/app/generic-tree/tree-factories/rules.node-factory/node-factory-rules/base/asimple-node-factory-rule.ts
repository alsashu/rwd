import { ANodeFactoryRule } from "./anode-factory-rule";
import { IRulesNodeFactory } from "./inode-factory-rule";

export abstract class ASimpleNodeFactoryRule extends ANodeFactoryRule {
  public constructor(
    public rulesNodeFactory: IRulesNodeFactory,
    protected params = {
      categoryId: "",
      nodesConfig: [],
      categoryTypes: [],
    }
  ) {
    super(rulesNodeFactory);
  }

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const node = this.rulesNodeFactory.createNodeAndAddToCategoryIfExtensionOf(
      object,
      context,
      this.params.categoryTypes,
      this.params.categoryId
    );
    return node ? [node] : [];
  }
}
