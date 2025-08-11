export class WikiViewActionsService {
  public toolBarActions = {
    type: "tool-bar",
    actions: [
      // {
      //   type: "btn-group",
      //   visible: (item: any) => true,
      //   actions: [
      //     {
      //       type: "button",
      //       html: (item: any) => "Table of contents",
      //       icon: (item: any) => "chevron-down",
      //       click: (item: any) =>
      //         (this.parent.wikiService.options.isLeftPanelVisible =
      //           !this.parent.wikiService.options.isLeftPanelVisible),
      //       active: (item: any) => this.parent.wikiService.options.isLeftPanelVisible,
      //       enabled: (item: any) => true,
      //       visible: (item: any) => true,
      //     },
      //   ],
      // },

      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "button",
            html: (item: any) => "wiki.view.refresh.action",
            icon: (item: any) => "sync-alt",
            click: (item: any) => this.parent.refresh(),
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
            html: (item: any) => "wiki.view.back.action",
            icon: (item: any) => "arrow-left",
            click: (item: any) => this.parent.wikiService.onBtnBackClick(),
            active: (item: any) => false,
            enabled: (item: any) => this.parent.wikiService.historyPos > 0,
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "wiki.view.forward.action",
            icon: (item: any) => "arrow-right",
            click: (item: any) => this.parent.wikiService.onBtnForwardClick(),
            active: (item: any) => false,
            enabled: (item: any) =>
              this.parent.wikiService.historyPos < this.parent.wikiService.historyInfoList.length - 1,
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
            html: (item: any) => "wiki.view.edit.action",
            icon: (item: any) => "edit",
            click: (item: any) => this.parent.wikiService.onBtnEditClick(),
            active: (item: any) => this.parent.wikiService.options.isEditMode,
            enabled: (item: any) => true,
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "wiki.view.save.action",
            icon: (item: any) => "save",
            click: (item: any) => this.parent.wikiService.onBtnSaveClick(),
            active: (item: any) => false,
            enabled: (item: any) => this.parent.wikiService.options.isDirty,
            visible: (item: any) => true,
          },
        ],
      },
    ],
  };

  constructor(private parent: any) {}
}
