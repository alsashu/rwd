import { ANodeFactoryRule } from "./anode-factory-rule";
import { IRulesNodeFactory, INodeFactoryRule } from "./inode-factory-rule";

export class CompositeNodeFactoryRule extends ANodeFactoryRule {
  public constructor(
    public rulesNodeFactory: IRulesNodeFactory,
    public treeMenuRules: INodeFactoryRule[] = [],
    public params: any = {
      // categoryId: "",
      // nodesConfig: [],
    }
  ) {
    super(rulesNodeFactory);
  }

  public clear() {
    this.treeMenuRules.forEach((treeMenuRule: any) => treeMenuRule.clear());
  }

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    let nodes = [];

    // Nodes from params.nodesConfig
    if (this.params && this.params.nodesConfig) {
      nodes = nodes.concat(
        this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig)
      );
    }

    // Nodes from sub rules
    let thisParentNode = null;
    if (this.params && this.params.categoryId && project) {
      thisParentNode = this.rulesNodeFactory.getCategoryNodeById(project.id + "-" + this.params.categoryId);
    }

    if (thisParentNode) {
      let thisParentNodes = [];
      this.treeMenuRules.forEach((treeMenuRule: any) => {
        thisParentNodes = thisParentNodes.concat(treeMenuRule.buildMainCategoriesNodes(project, thisParentNode));
      });
      this.rulesNodeFactory.addNodesToParent(thisParentNodes, thisParentNode);
    } else {
      this.treeMenuRules.forEach((treeMenuRule: any) => {
        nodes = nodes.concat(treeMenuRule.buildMainCategoriesNodes(project, parentNode));
      });
    }
    return nodes;
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    let nodes = [];
    if (this.continueToBuildNodes(object, parentNode, context, params)) {
      this.treeMenuRules.forEach((treeMenuRule: any) => {
        nodes = nodes.concat(treeMenuRule.buildNodes(object, parentNode, context, params));
      });
    }
    return nodes;
  }

  public continueToBuildNodes(object: any, parentNode: any, context: any, params: any = null): boolean {
    return true;
  }
}
