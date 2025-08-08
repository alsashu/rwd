// export interface IViewConfig {
// }

export interface IView {
  id?: string;
  type: string;
  title: string;
  icon?: string;
  config: any; // { viewComponent?: any; }
  // viewComponent?: any;
}
