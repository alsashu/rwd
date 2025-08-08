import { IBaseNodeFactory } from "../../../anode-factory";

export interface IRulesNodeFactory extends IBaseNodeFactory {
  getProjectNodeId(project: any, id: string): string;
  getNodeId(project: any, type: string, id: string): string;
  addNodeToNodeMap(key: string, node: any);
  getNodeFromKey(key: string): any;
  getObjectFromId(project: any, type: string, id: string): any;

  buildMainCategoriesNodes(project: any, parentNode: any): any[];
  buildMainCategoriesNodesRec(project: any, parentNode: any, nodesConfig: any, params?: any): any[];
  getCategoryNodeById(id: string): any;
  addNodeToCategoryById(node: any, project: any, categoryId: string): boolean;
  findDoublonNode(o: any, parentNode: any): any;
  findOrCreateNodeFromObjectType(type: string, project: any, parentNode: any, addSToLabel?: boolean): any;
  isTypeExtensionOfTypes(type: string, extensions: string[]): boolean;
  createNodeAndAddToCategoryIfExtensionOf(
    object: any,
    context: any,
    types: string[],
    categoryId: string,
    params?: any
  ): any;
  buildNodeFromObject(object: any, parentNode: any, context: any, params): any;
  loadChildrenNodes(node: any, context: any);
  nodeExistsInParent(node: any, parentNode: any): boolean;
  addNodeToParent(node: any, parentNode: any, preventDoublon?: boolean): any;
  addNodesToParent(nodes: any[], parentNode: any): any[];
  shouldLoadProjectsContent(): boolean;

  testAndAddObjectToObjectTypeNode(object: any, context: any, parentNode: string, objectTypes: any[]): any[];
  testIfContextUnderObjetsTypes(context: any, objectStackLength: number, types: string[]): boolean;

  translateLabel(text: string): string;
}

export interface INodeFactoryRule {
  clear();
  buildMainCategoriesNodes(project: any, parentNode: any): any[];
  buildNodes(object: any, parentNode: any, context: any, params: any): any[];
}
