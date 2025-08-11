export class PropertiesViewActionsService {
  public static BO_OBJECT_TYPE = 1;
  public static GO_OBJECT_TYPE = 2;
  public static LIB_OBJECT_TYPE = 3;

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
                html: (item: any) => "properties.view.bo.properties",
                icon: (item: any) => "stream",
                click: (event: any, item: any) =>
                  this.parent.selectObjectType(PropertiesViewActionsService.BO_OBJECT_TYPE),
                active: (item: any) => this.parent.objectType === PropertiesViewActionsService.BO_OBJECT_TYPE,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },
              // {
              //   type: "button",
              //   html: (item: any) => "properties.view.lo.properties",
              //   icon: (item: any) => "cubes",
              //   click: (event: any, item: any) =>
              //     this.parent.selectObjectType(PropertiesViewActionsService.LIB_OBJECT_TYPE),
              //   active: (item: any) => this.parent.objectType === PropertiesViewActionsService.LIB_OBJECT_TYPE,
              //   enabled: (item: any) => true,
              //   visible: (item: any) => true,
              // },
              // {
              //   type: "button",
              //   html: (item: any) => "properties.view.go.properties",
              //   icon: (item: any) => "draw-polygon",
              //   click: (event: any, item: any) =>
              //     this.parent.selectObjectType(PropertiesViewActionsService.GO_OBJECT_TYPE),
              //   active: (item: any) => this.parent.objectType === PropertiesViewActionsService.GO_OBJECT_TYPE,
              //   enabled: (item: any) => true,
              //   visible: (item: any) => true,
              // },
            ],
          },
        ],
      },

      {
        type: "btn-group",
        visible: (item: any) => true,
        class: (item: any) => "btn-right",
        actions: [
          {
            type: "dropdown",
            html: (item: any) => "view.options.action",
            icon: (item: any) => "cog",
            enabled: (item: any) => true,
            visible: (item: any) => true,
            actions: [
              {
                type: "dropdown-item",
                html: (item: any) => "properties.view.hide.undefined.action",
                click: (event: any, item: any) => {
                  this.parent.getPcOptions().isUndefinedValueVisible =
                    !this.parent.getPcOptions().isUndefinedValueVisible;
                  this.parent.refresh();
                },
                active: (item: any) => !this.parent.getPcOptions().isUndefinedValueVisible,
                enabled: (item: any) => true,
                visible: (item: any) => true,
              },

              // {
              //   type: "divider",
              //   visible: (item: any) => true,
              // },
              // {
              //   type: "dropdown-item",
              //   html: (item: any) => "properties.view.rawdata.action",
              //   click: (event: any, item: any) =>
              //     (this.parent.getPcOptions().isDebugVisible = !this.parent.getPcOptions().isDebugVisible),
              //   active: (item: any) => this.parent.getPcOptions().isDebugVisible,
              //   enabled: (item: any) => true,
              //   visible: (item: any) => true,
              // },
            ],
          },
        ],
      },
    ],
  };

  public contextMenuActions = [];

  constructor(private parent: any) {}
}
