import { MessageModalComponent } from "src/app/components/modal/message-modal/message-modal.component";
import { IApiService } from "../api/api.service";
import { IMessageService } from "../message/message.service";
import { IModalViewService } from "../modal/imodal-view.service";
import { IModelService } from "../model/model.service";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ITranslateService } from "../translate/translate.service";
import { IUserService } from "../user/user.service";

/**
 * Interface of the GitService
 */
export interface IGitService {
  apiService: IApiService;
  translateService: ITranslateService;
  modelService: IModelService;

  gitCloneProject(projectName?: string);
  gitPushProject(project: any);
}

/**
 * Git service
 */
export class GitService implements IGitService {
  public apiService: IApiService;
  public modalViewService: IModalViewService;
  public messageService: IMessageService;
  public translateService: ITranslateService;
  public modelService: IModelService;
  private userService: IUserService;

  /**
   * Constructor
   * @param servicesService
   */
  constructor(public servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.modalViewService = this.servicesService.getService(ServicesConst.ModalViewService) as IModalViewService;
    this.messageService = this.servicesService.getService(ServicesConst.MessageService) as IMessageService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.userService = this.servicesService.getService(ServicesConst.UserService) as IUserService;
  }

  /**
   * Git clone a project
   * @param gitUrl The project repository name
   */
  public gitCloneProject(gitUrl: string = null) {
    this.modalViewService.openGitModalComponent(
      {
        gitService: this,
      },
      (result: any) => {}
    );
  }

  /**
   * Git push project
   * @param project The project with projectName and path properties
   */
  public gitPushProject(project: any) {
    if (project && project.label && project.isGitProject && project.projectName && project.path) {
      this.modalViewService.openTextModal(
        { text: "", textLabel: this.translateService.translateFromMap("Git token"), rows: 1 },
        (result: any) => {
          this.doGitPushProject(project, result.text);
        }
      );
    }
  }

  /**
   * Execute git push
   * @param project The project
   * @param token The token
   * @param user The user
   */
  private doGitPushProject(project: any, token: string) {
    if (project && project.label && project.isGitProject && project.projectName && project.path) {
      const userName = this.userService.getCurrentUserName();
      this.modalViewService.openMessageModalComponent(
        {
          message: this.translateService.translateFromMap("Git push project ") + project.label + "...",
          cb: (messageModalComponent: MessageModalComponent) => {
            messageModalComponent.buttonsDisabled = true;
            const params = {
              path: project.path + project.projectName,
              token,
              userName,
            };
            this.apiService.gitPushProject(params).then((res: any) => {
              let message =
                res.result === "ok"
                  ? this.translateService.translateFromMap("Git push done.")
                  : res.result + ": " + res.message
                  ? res.message
                  : "";
              this.messageService.addTextMessage(message);
              messageModalComponent.message = message;
              messageModalComponent.buttonsDisabled = false;
            });
          },
        },
        null
      );
    }
  }
}
