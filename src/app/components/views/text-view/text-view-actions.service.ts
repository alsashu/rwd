export class TextViewActionsService {
  public toolBarActions = {
    type: "tool-bar",
    actions: [
      {
        type: "btn-group",
        visible: (item) => true,
        actions: [
          {
            type: "button",
            html: (item) => "Enregistrer",
            icon: (item) => "save",
            click: (event, item) => this.parent.onBtnSaveClick(),
            active: (item) => false,
            enabled: (item) => true,
            visible: (item) => true,
          },
          {
            type: "button",
            html: (item) => "Exécuter",
            icon: (item) => "play",
            click: (event, item) => this.parent.onBtnExecute(),
            active: (item) => false,
            enabled: (item) => true,
            visible: (item) => true,
          },
        ],
      },
    ],
  };

  public contextMenuActions = [
    /*
    {
      html: (item) => "Enregistrer",
      click: (item) => this.onBtnSaveClick(),
      enabled: (item) => true,
      visible: (item) => true,
    },
    {
      html: (item) => "Exécuter",
      click: (item) => this.onBtnExecute(),
      enabled: (item) => true,
      visible: (item) => true,
    },
*/
  ];

  constructor(private parent: any) {}
}
