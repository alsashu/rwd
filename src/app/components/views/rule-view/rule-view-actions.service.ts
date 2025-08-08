/**
 * Actions of the RuleView
 */
export class RuleViewActionsService {
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
            html: (item: any) => "Run the rules",
            icon: (item: any) => "play",
            click: (event: any, item: any) => {
              this.parent.ruleService.executeTheRules();
            },
            active: (item: any) => false,
            enabled: (item: any) => this.parent.userCanUseRules() && this.parent.ruleService.rules.length,
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "Delete the selected rules",
            icon: (item: any) => "minus",
            click: (event: any, item: any) => {
              this.parent.ruleService.deleteTheSelectedRules();
            },
            active: (item: any) => false,
            enabled: (item: any) => this.parent.userCanUseRules() && this.parent.ruleService.rules.length,
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "Delete all rules",
            icon: (item: any) => "trash",
            click: (event: any, item: any) => {
              this.parent.ruleService.deleteTheRules();
            },
            active: (item: any) => false,
            enabled: (item: any) => this.parent.userCanUseRules() && this.parent.ruleService.rules.length,
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
            html: (item: any) => "Display rules",
            icon: (item: any) => "list",
            click: (event: any, item: any) => {
              this.parent.options.isLogVisible = false;
            },
            active: (item: any) => !this.parent.options.isLogVisible,
            enabled: (item: any) => this.parent.userCanUseRules(),
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
            html: (item: any) => "Display text log",
            icon: (item: any) => "file-alt",
            click: (event: any, item: any) => {
              this.parent.options.isLogVisible = true;
              this.parent.options.logType = this.parent.logTypes.textLog;
              // this.parent.displayTextLog();
            },
            active: (item: any) =>
              this.parent.options.isLogVisible && this.parent.options.logType === this.parent.logTypes.textLog,
            enabled: (item: any) => this.parent.userCanUseRules(),
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "Display rule engine log",
            icon: (item: any) => "file-medical-alt",
            click: (event: any, item: any) => {
              this.parent.options.isLogVisible = true;
              this.parent.options.logType = this.parent.logTypes.ruleEngineLog;
            },
            active: (item: any) =>
              this.parent.options.isLogVisible && this.parent.options.logType === this.parent.logTypes.ruleEngineLog,
            enabled: (item: any) => this.parent.userCanUseRules(),
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "Display rules log",
            icon: (item: any) => "tasks",
            click: (event: any, item: any) => {
              this.parent.options.isLogVisible = true;
              this.parent.options.logType = this.parent.logTypes.ruleLog;
            },
            active: (item: any) =>
              this.parent.options.isLogVisible && this.parent.options.logType === this.parent.logTypes.ruleLog,
            enabled: (item: any) => this.parent.userCanUseRules(),
            visible: (item: any) => true,
          },
        ],
      },
    ],
  };

  /**
   * Conext menu actions
   */
  public contextMenuActions = [];

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
