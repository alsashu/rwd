export class TestViewActionsService {
  toolBarActions = {
    type: "tool-bar",
    actions: [
      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          /*
        {
          type: "button", html: (item: any) => "Enregistrer", icon: (item) => "save",
          click: (event: any, item: any) => this.onBtnSaveClick(),
          active: (item) => false,
          enabled: (item: any) => true, visible: (item) => true,
        },
*/
        ],
      },
    ],
  };

  contextMenuActions = [
    /*
    {
      html: (item: any) => "Enregistrer",
      click: (item: any) => this.onBtnSaveClick(),
      enabled: (item: any) => true,
      visible: (item: any) => true,
    },
*/
  ];

  constructor(private parent: any) {}
}
