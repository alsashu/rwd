export class MessageViewActionsService {
  public toolBarActions = {
    type: "tool-bar",
    actions: [
      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "btn-group",
            visible: (item: any) => true,
            actions: [
              {
                type: "button",
                html: (item: any) => "messages.view.clear.action",
                icon: (item: any) => "trash-alt",
                click: (event: any, item: any) => this.parent.messageService.clear(),
                active: (item: any) => false,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
            ],
          },
        ],
      },
    ],
  };

  public contextMenuActions = [
    {
      html: (item: any) => "messages.view.clear.action",
      click: (item: any) => this.parent.messageService.clear(),
      enabled: (item: any) => true,
      visible: (item: any) => true,
    },
  ];

  constructor(private parent: any) {}
}
