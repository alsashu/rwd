/**
 * Interface of node factory building nodes of generic tree component
 */
export interface INodeFactory {
  params: any;
  buildNodes();
  lazyLoadNode(node: any);
}
