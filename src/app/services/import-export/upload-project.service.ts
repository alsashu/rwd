import { IApiService } from "../api/api.service";
import { IMessageService } from "../message/message.service";
import { IModalViewService } from "../modal/imodal-view.service";
import { IModelService } from "../model/model.service";
import { IMvcService } from "../mvc/imvc.service";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ITranslateService } from "../translate/translate.service";
import { IUserService } from "../user/user.service";

/**
 * Interface of the UploadProjectService
 */
export interface IUploadProjectService {
  apiService: IApiService;
  translateService: ITranslateService;
  modelService: IModelService;
  mvcService: IMvcService;

  uploadProject();
  getProjectFileName(files: any[]): string;
  checkIfProjectUploadIsValid(files: any[]): any;
  uploadProjectFiles(files: any[], downloadFileDoneCB: any);
  finalizeProjectUploadAndConvertion(projectName: string): any;
}

/**
 * Project upload service
 */
export class UploadProjectService implements IUploadProjectService {
  public apiService: IApiService;
  public modalViewService: IModalViewService;
  public messageService: IMessageService;
  public translateService: ITranslateService;
  public modelService: IModelService;
  public mvcService: IMvcService;
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
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    this.userService = this.servicesService.getService(ServicesConst.UserService) as IUserService;
  }

  /**
   * Upload project
   */
  public uploadProject() {
    this.modalViewService.openUploadProjectModalComponent(
      {
        uploadProjectService: this,
      },
      (result: any) => {}
    );
  }

  /**
   * Check if project upload is valid
   */
  public checkIfProjectUploadIsValid(files: any[]): any {
    const res = {
      ok: true,
      projectExists: false,
      noRailml: false,
    };
    // TODO: find railml and check if same name as folder name and not yet existing project
    if (files && files.length) {
      const projectName = this.getProjectFileName(files);
      if (this.modelService.getProjectByName(projectName)) {
        res.ok = false;
        res.projectExists = true;
      }
      const projectNameLC = projectName.toLowerCase();
      const railmlOrXmlFileNames = [
        projectNameLC + "/" + projectNameLC + ".xml",
        projectNameLC + "/" + projectNameLC + ".railml",
      ];
      const railmlOrXmlFile = Array.from(files).find((file: any) =>
        railmlOrXmlFileNames.includes(file.webkitRelativePath.toLowerCase())
      );
      if (!railmlOrXmlFile) {
        res.ok = false;
        res.noRailml = true;
      }
    }
    return res;
  }

  /**
   * Get project file name from uploaded files
   * @param files
   * @returns
   */
  public getProjectFileName(files: any[]): string {
    let res = null;
    if (files && files.length) {
      res = files[0].webkitRelativePath.split("/")[0];
    }
    return res;
  }

  /**
   * Upload project files
   */
  public async uploadProjectFiles(files: any[], downloadFileDoneCB: any) {
    if (files && files.length) {
      for (const file of Array.from(files)) {
        await this.apiService.uploadFileASync(file);
        if (downloadFileDoneCB) {
          downloadFileDoneCB();
        }
      }
    }
  }

  /**
   * Finalize project upload
   */
  public finalizeProjectUploadAndConvertion(projectName: string): any {
    return this.apiService.finalizeProjectUpload(projectName);
  }
}
