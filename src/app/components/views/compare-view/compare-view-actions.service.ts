/**
 * Actions of the CompareView
 */
export class CompareViewActionsService {
  /**
   * Toolbar actions
   */
  public toolBarActions = {
    type: "tool-bar",
    actions: [
      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "button",
            html: (item: any) => "view.menu.action",
            icon: (item: any) => "bars",
            click: (event: any, item: any) => this.parent.onBtnMenuClicked(event),
            active: (item: any) => false,
            enabled: (item: any) => true,
            visible: (item: any) => true,
          },
        ],
      },

      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "button",
            html: (item: any) => "view.refresh.action",
            icon: (item: any) => "sync-alt",
            click: (event: any, item: any) => {
              this.parent.refresh();
            },
            active: (item: any) => false,
            enabled: (item: any) => this.parent.userCanRefresh(),
            visible: (item: any) => true,
          },

          {
            type: "button",
            html: (item: any) => "Select projects for comparison",
            icon: (item: any) => "plus",
            click: (event: any, item: any) => {
              this.parent.selectProjects();
            },
            active: (item: any) => false,
            enabled: (item: any) => this.parent.modelService.getSelectedProject(),
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "Reset comparison",
            icon: (item: any) => "trash-alt",
            click: (event: any, item: any) => {
              this.parent.compareService.resetCompareProjectList();
            },
            active: (item: any) => false,
            enabled: (item: any) =>
              this.parent.modelService.getSelectedProject() && this.parent.compareService.comparisonIsEnabled(),
            visible: (item: any) => true,
          },
        ],
      },
    ],
  };

  /**
   * Conext menu actions
   */
  public contextMenuActions = [
    {
      html: (item: any) => "Compare",
      enabled: (item: any) => true,
      visible: (item: any) => true,
      subMenuId: "smCompare",
      contextMenuActions: [],
    },
  ];

  /**
   * Actions map link to nodes
   */
  public nodeActionsMap = new Map([]);

  /**
   * Action map depending on object type
   */
  public objectTypeActionsMap = new Map([]);

  /**
   * Constructor
   * @param parent The parent view
   */
  constructor(private parent: any) {}
}
