import { ModelConstService } from "src/app/services/model/model-const.service";
import { environment } from "src/environments/environment";

/**
 * Service managing action of the Model View
 */
export class ModelViewActionsService {
  /**
   * Tool bar actions
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
            html: (item: any) => "model.view.showproject.action",
            icon: (item: any) => "file-alt",
            click: (event: any, item: any) => {
              this.parent.options.openProjectMode = !this.parent.options.openProjectMode;
              this.parent.refresh();
            },
            active: (item: any) => this.parent.options.openProjectMode,
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
            html: (item: any) => "model.view.save.action",
            icon: (item: any) => "save",
            click: (event: any, item: any) => this.parent.onBtnSaveClick(item),
            active: (item: any) => false,
            enabled: (item: any) => this.parent.canSave(),
            visible: (item: any) => true,
          },
          {
            type: "button",
            html: (item: any) => "model.view.close-project.action",
            icon: (item: any) => "window-close",
            click: (event: any, item: any) => this.parent.closeProject(),
            active: (item: any) => false,
            enabled: (item: any) => this.parent.canCloseProject(),
            visible: (item: any) => true,
          },
        ],
      },

      {
        type: "btn-group",
        visible: (item: any) => this.parent.userHasAdminRights(),
        actions: [
          {
            type: "button",
            html: (item: any) => "model.view.convert.action",
            icon: (item: any) => "arrow-alt-circle-right",
            click: (event: any, item: any) => this.parent.convertProjects(item),
            active: (item: any) => false,
            enabled: (item: any) => true,
            visible: (item: any) => this.parent.userHasAdminRights() && !this.parent.getIsOffLine(),
          },
          {
            type: "button",
            html: (item: any) => "model.view.upload-project.action",
            icon: (item: any) => "arrow-alt-circle-up",
            click: (event: any, item: any) => this.parent.commandService.execute(this.parent.uploadProjectCommand),
            active: (item: any) => false,
            enabled: (item: any) => this.parent.uploadProjectCommand.canExecute(),
            visible: (item: any) => !environment.cordova,
          },
          {
            type: "button",
            html: (item: any) => "model.view.download-project.action",
            icon: (item: any) => "arrow-alt-circle-down",
            click: (event: any, item: any) => this.parent.commandService.execute(this.parent.downloadProjectCommand),
            active: (item: any) => false,
            enabled: (item: any) => this.parent.downloadProjectCommand.canExecute(),
            visible: (item: any) => !environment.cordova,
          },
        ],
      },
    ],
  };

  /**
   * Context menu actions
   */
  public contextMenuActions = [
    // Project
    {
      html: (item: any) => "model.view.project.action",
      enabled: (item: any) => true,
      visible: (item: any) => true,
      subMenuId: "smVersion",
      contextMenuActions: [
        {
          html: (item: any) => "model.view.open.action",
          click: (item: any) => this.parent.openProject({ project: item.object }),
          enabled: (item: any) => item.object && item.object.type === ModelConstService.PROJECT_TYPE,
          visible: (item: any) => true,
        },
        {
          html: (item: any) => "model.view.save.action",
          click: (item: any) => this.parent.onBtnSaveClick({ project: item.object }),
          enabled: (item: any) => this.parent.canSave(),
          visible: (item: any) => true,
        },
        {
          html: (item: any) => "model.view.close-project.action",
          click: (item: any) => this.parent.closeProject(),
          enabled: (item: any) => this.parent.canCloseProject(),
          visible: (item: any) => true,
        },

        { divider: true, visible: (item: any) => this.parent.userHasAdminRights() && !this.parent.getIsOffLine() },
        {
          html: (item: any) => "model.view.delete-project.action",
          click: (item: any) => this.parent.commandService.execute(this.parent.deleteProjectCommand),
          enabled: (item: any) => this.parent.deleteProjectCommand.canExecute() && !this.parent.getIsOffLine(),
          visible: (item: any) => this.parent.userHasAdminRights() && !this.parent.getIsOffLine(),
        },

        { divider: true, visible: (item: any) => this.parent.userHasAdminRights() && !this.parent.getIsOffLine() },
        {
          html: (item: any) => "model.view.convert.project.action",
          click: (item: any) => this.parent.convertProjects(),
          enabled: (item: any) => true,
          visible: (item: any) => this.parent.userHasAdminRights() && !this.parent.getIsOffLine(),
        },

        { divider: true, visible: (item: any) => !this.parent.getIsOffLine() },
        {
          html: (item: any) => "model.view.set-project-for-comparison.action",
          click: (item: any) => this.parent.commandService.execute(this.parent.setProjectToComparisonCommand),
          enabled: (item: any) => this.parent.setProjectToComparisonCommand.canExecute(),
          visible: (item: any) => !this.parent.getIsOffLine(),
        },

        { divider: true, visible: (item: any) => this.parent.userHasAdminRights() && !environment.cordova },
        {
          html: (item: any) => "model.view.upload.download",
          enabled: (item: any) => true,
          visible: this.parent.userHasAdminRights() && !environment.cordova,
          subMenuId: "smUploadDownload",
          contextMenuActions: [
            {
              html: (item: any) => "model.view.upload-project.action",
              click: (item: any) => this.parent.commandService.execute(this.parent.uploadProjectCommand),
              enabled: (item: any) => this.parent.uploadProjectCommand.canExecute(),
              visible: (item: any) => this.parent.userHasAdminRights() && !environment.cordova,
            },
            {
              html: (item: any) => "model.view.download-project.action",
              click: (item: any) => this.parent.commandService.execute(this.parent.downloadProjectCommand),
              enabled: (item: any) => this.parent.downloadProjectCommand.canExecute(),
              visible: (item: any) => this.parent.userHasAdminRights() && !environment.cordova,
            },
          ],
        },

        { divider: true, visible: (item: any) => this.parent.userHasAdminRights() },
        {
          html: (item: any) => "model.view.git",
          enabled: (item: any) => true,
          visible: this.parent.userHasAdminRights(),
          subMenuId: "smGit",
          contextMenuActions: [
            {
              html: (item: any) => "model.view.git-clone-project.action",
              click: (item: any) => this.parent.commandService.execute(this.parent.gitCloneProjectCommand),
              enabled: (item: any) => this.parent.gitCloneProjectCommand.canExecute() && !this.parent.getIsOffLine(),
              visible: (item: any) => this.parent.userHasAdminRights(),
            },
            {
              html: (item: any) => "model.view.git-push-project.action",
              click: (item: any) => this.parent.commandService.execute(this.parent.gitPushProjectCommand),
              enabled: (item: any) => this.parent.gitPushProjectCommand.canExecute() && !this.parent.getIsOffLine(),
              visible: (item: any) => this.parent.userHasAdminRights(),
            },
          ],
        },
      ],
    },

    // Tablet
    { divider: true, visible: (item: any) => this.parent.isAndroidApp() },
    {
      html: (item: any) => "model.view.tablet",
      enabled: (item: any) => true,
      visible: this.parent.isAndroidApp(),
      subMenuId: "smTablet",
      contextMenuActions: [
        {
          html: (item: any) => "model.view.open-save-project-to-tablet.action",
          click: (item: any) => this.parent.openAndSaveProjectOnTablet({ project: item.object }),
          enabled: (item: any) =>
            item.object && item.object.type === ModelConstService.PROJECT_TYPE && !this.parent.getIsOffLine(),
          visible: (item: any) => this.parent.isAndroidApp(),
        },

        {
          html: (item: any) => "model.view.delete-project-from-tablet.action",
          click: (item: any) => this.parent.deleteProjectFromTablet({ project: item.object }),
          enabled: (item: any) =>
            item.object &&
            item.object.type === ModelConstService.PROJECT_TYPE &&
            !this.parent.getIsOffLine() &&
            this.parent.isProjectSavedOnTablet(item.object),
          visible: (item: any) => this.parent.isAndroidApp(),
        },

        // {
        //   html: (item: any) => "model.view.save-project-to-tablet.action",
        //   click: (item: any) => this.parent.commandService.execute(this.parent.saveProjectOnTabletCommand),
        //   enabled: (item: any) => this.parent.saveProjectOnTabletCommand.canExecute(),
        //   visible: (item: any) => this.parent.isAndroidApp(),
        // },

        {
          html: (item: any) => "model.view.synchronize-project-with-server.action",
          click: (item: any) => this.parent.synchronizeProjectWithServer({ project: item.object }),
          enabled: (item: any) =>
            item.object &&
            item.object.type === ModelConstService.PROJECT_TYPE &&
            !this.parent.getIsOffLine() &&
            this.parent.isProjectSavedOnTablet(item.object),
          visible: (item: any) => this.parent.isAndroidApp(),
        },
      ],
    },

    { divider: true, visible: (item: any) => true },
    {
      html: (item: any) => "view.refresh.action",
      click: (item: any) => this.parent.refresh(),
      enabled: (item: any) => true,
      visible: (item: any) => true,
    },

    { divider: true, visible: (item: any) => !this.parent.getIsOffLine() },

    {
      html: (item: any) => "model.view.documentation",
      enabled: (item: any) => true,
      visible: (item: any) => !this.parent.getIsOffLine(),
      subMenuId: "smDocumentation",
      contextMenuActions: [
        {
          html: (item: any) => "model.view.documentation.open",
          click: (item: any) => this.parent.onBtnOpenWikiClick(item),
          active: (item: any) => false,
          enabled: (item: any) => true,
          visible: (item: any) => !this.parent.getIsOffLine(),
        },
        {
          html: (item: any) => "model.view.documentation.generate",
          enabled: (item: any) =>
            this.parent.userHasAdminRights() && item.object && item.object.type === ModelConstService.PROJECT_TYPE,
          visible: (item: any) => !this.parent.getIsOffLine(),
          subMenuId: "smGenerateDocumentation",
          contextMenuActions: [],
        },
      ],
    },
  ];

  /**
   * Node Actions
   */
  public nodeActionsMap = new Map([
    [
      "open-project-action",
      {
        label: (node: any) => this.parent.translateFromMap("Open project"),
        tooltip: (node: any) => this.parent.translateFromMap("Open project"),
        icon: (node: any) => "folder-open",
        click: (node: any) => {
          this.parent.openProject({ project: node.object });
        },
      },
    ],
    [
      "open-view-action",
      {
        label: (node: any) => this.parent.translateFromMap("Open diagram"),
        tooltip: () => this.parent.translateFromMap("Open diagram"),
        icon: (node: any) => "eye",
        click: (node: any) => {
          this.parent.onBtnOpenViewClick(node);
        },
      },
    ],
  ]);

  /**
   * Node actions map
   */
  public objectTypeActionsMap = new Map([
    [
      ModelConstService.PROJECT_TYPE,
      {
        actionNames: ["open-project-action"],
      },
    ],
    [ModelConstService.VISUALIZATION_TYPE, { actionNames: ["open-view-action"] }],
    [ModelConstService.TYPICAL_ITF_DIAGRAM_TYPE, { actionNames: ["open-view-action"] }],
    [ModelConstService.INSTANTIATED_ITF_DIAGRAM_TYPE, { actionNames: ["open-view-action"] }],
    [ModelConstService.TYPICAL_FRAME_DIAGRAM_TYPE, { actionNames: ["open-view-action"] }],
    [ModelConstService.INSTANTIATED_FRAME_DIAGRAM_TYPE, { actionNames: ["open-view-action"] }],
    [ModelConstService.ASSEMBLY_TYPE, { actionNames: ["open-view-action"] }],
  ]);

  /**
   * Construtor
   * @param parent The parent view
   */
  constructor(private parent: any) {}

  public getContextMenuActions(): any {
    return this.contextMenuActions;
  }

  /**
   * Generate the generate project documentation menus from config.json data
   * @returns The generate project documentation menu & sub menus
   */
  public generateDocumentationMenus() {
    try {
      const docMenu: any = this.contextMenuActions.find((cm: any) => cm.subMenuId === "smDocumentation");
      const genDocMenu =
        docMenu && docMenu.contextMenuActions && docMenu.contextMenuActions.find
          ? docMenu.contextMenuActions.find((cm: any) => cm.subMenuId === "smGenerateDocumentation")
          : null;
      if (
        docMenu &&
        genDocMenu &&
        this.parent.appConfigService &&
        this.parent.appConfigService.configFile &&
        this.parent.appConfigService.configFile.wikiTemplates
      ) {
        this.parent.appConfigService.configFile.wikiTemplates.forEach((wikiTemplate: any) => {
          genDocMenu.contextMenuActions.push({
            html: (item: any) => wikiTemplate.label,
            click: (item: any) => this.parent.onBtnGenerateDocumentationClick(item, wikiTemplate),
            enabled: (item: any) =>
              this.parent.userHasAdminRights() && item.object && item.object.type === ModelConstService.PROJECT_TYPE,
            visible: (item: any) => true,
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}
