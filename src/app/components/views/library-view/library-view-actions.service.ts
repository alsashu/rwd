/**
 * Actions of the LibraryView
 */
export class LibraryViewActionsService {
  toolBarActions = {
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
    ],
  };

  contextMenuActions = [
    {
      html: (item: any) => "Add rule to the rule engine",
      click: (item: any) => this.parent.onBtnAddRuleClick(item.object),
      enabled: (item: any) => this.parent.canAddRuleClick(item.object),
      visible: (item: any) => true,
    },
    {
      html: (item: any) => "Open documentation",
      click: (item: any) => this.parent.onBtnRuleWikiPageClick(item.object),
      enabled: (item: any) => this.parent.canRuleWikiPageClick(item.object),
      visible: (item: any) => true,
    },
  ];

  constructor(private parent: any) {}
}
