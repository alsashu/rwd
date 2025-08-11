import { IModelCommandsService } from "src/app/services/model/model-commands.service";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

export class SearchViewActionsService {
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
            type: "input",
            html: (item: any) => "search bar",
            value: this.parent.searchValue,
            click: (event: any, item: any) => {
              this.parent.search();
            },
            onChange: (event: any) => {
              this.parent.searchValue = event;
            },
            typeahead: (text: Observable<string>) => {
              return text.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                map((term) =>
                  term.length < 2
                    ? []
                    : this.parent.lastSearch
                        .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
                        .slice(0, 10)
                )
              );
            },
            enabled: (item: any) => true,
            visible: (item: any) => true,
            actions: [],
          },
          {
            type: "button",
            html: (item: any) => "search.view.search.action",
            icon: (item: any) => "search",
            click: (event: any, item: any) => {
              this.parent.search();
            },
            enabled: (item: any) => true,
            visible: (item: any) => true,
            actions: [],
          },
        ],
      },

      {
        type: "btn-group",
        visible: (item: any) => true,
        actions: [
          {
            type: "button",
            html: (item: any) => "view.options.action",
            icon: (item: any) => "cog",
            click: (event: any, item: any) => {
              this.parent.onOptionsClick();
            },
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
            enabled: (item: any) => true,
            visible: (item: any) => true,
          },
        ],
      },
    ],
  };

  public contextMenuActions = [
    {
      html: (item: any) => "Search View",
      enabled: (item: any) => true,
      visible: (item: any) => true,
      subMenuId: "smTable",
      contextMenuActions: [],
    },
  ];

  // Actions
  public nodeActionsMap = new Map([]);

  // Node actions map
  public objectTypeActionsMap = new Map([]);

  constructor(private parent: any) {}

  private getModelCommandsService(): IModelCommandsService {
    return this.parent.modelCommandsService;
  }
}
