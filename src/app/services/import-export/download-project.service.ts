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
 * Interface of the DownloadProjectService
 */
export interface IDownloadProjectService {
  apiService: IApiService;
  translateService: ITranslateService;
  modelService: IModelService;

  downloadProject(projectData: any);
}

/**
 * Project upload service
 */
export class DownloadProjectService implements IDownloadProjectService {
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

  // /**
  //  * Download project
  //  */
  // public downloadProjectOld(projectData: any) {
  //   if (projectData && projectData.label && projectData.path) {
  //     this.apiService
  //       .downloadProject(projectData.label, projectData.path)
  //       .then((res: any) => {
  //         console.log(res);
  //         // TODO server
  //         window.open("https://localhost:3000/download/file/" + projectData.label + ".zip");
  //       })
  //       .catch((ex: any) => {
  //         console.log(ex);
  //       });
  //     // window.open("https://localhost:3000/download/file/compare.zip");
  //   }
  // }

  /**
   * Download a project
   * @param projectData Project data
   */
  public downloadProject(projectData: any) {
    if (projectData && projectData.label && projectData.path) {
      this.modalViewService.openMessageModalComponent(
        {
          message: this.translateService.translateFromMap("Zipping project for download. Please wait..."),
          cb: (messageModalComponent: MessageModalComponent) => {
            messageModalComponent.buttonsDisabled = true;
            this.apiService
              .downloadProject(projectData.label, projectData.path)
              .then((res: any) => {
                messageModalComponent.message = "Project downloaded.";
                messageModalComponent.buttonsDisabled = false;

                // Openning file for dowloading
                const zipName = res ? res.zipName : null;
                if (zipName) {
                  window.open(this.apiService.serverUrl + "/download/file/" + zipName);
                }
              })
              .catch((ex: any) => {
                console.log(ex);
                messageModalComponent.buttonsDisabled = false;
              });
          },
        },
        null
      );
    }
  }
}
