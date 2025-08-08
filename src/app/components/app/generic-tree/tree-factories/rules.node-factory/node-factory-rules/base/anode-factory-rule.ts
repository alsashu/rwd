import { INodeFactoryRule, IRulesNodeFactory } from "./inode-factory-rule";

export abstract class ANodeFactoryRule implements INodeFactoryRule {
  public constructor(public rulesNodeFactory: IRulesNodeFactory) {}
  public clear() {}
  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return [];
  }
  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    return [];
  }
}
