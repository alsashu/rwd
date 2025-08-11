import { Component, ElementRef, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IApiService } from "src/app/services/api/api.service";
import { IUploadProjectService } from "src/app/services/import-export/upload-project.service";
import { IModelService } from "src/app/services/model/model.service";
import { IMvcService } from "src/app/services/mvc/imvc.service";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { ITranslateService } from "src/app/services/translate/translate.service";

@Component({
  selector: "app-upload-project-modal",
  templateUrl: "./upload-project-modal.component.html",
  styleUrls: ["./upload-project-modal.component.css"],
})
export class UploadProjectModalComponent {
  @ViewChild("closeButton")
  public closeButtonRef: ElementRef;

  @ViewChild("uploadButton")
  public uploadButtonRef: ElementRef;

  public title = "RIGHT VIEWER";
  public uploadButtonDisabled = true;
  public buttonsDisabled = false;
  public selectButtonDisabled = false;
  public invalidProjectWarningVisible = false;
  public existingProjectWarningVisible = false;
  public overwriteExistingProjects = false;
  public messageUploadingDoneVisible = false;
  public messageConversionDoneVisible = false;

  public params: any;

  public uploadProjectService: IUploadProjectService;
  public apiService: IApiService;
  public translateService: ITranslateService;
  public modelService: IModelService;
  public mvcService: IMvcService;

  public uploadData = {
    files: [],
    projectName: "",
    progressValue: 0,
    filesUploadedCount: 0,
    filesToBeUploadedCount: 0,
    uploadedComplete: false,
  };

  /**
   * Constructor
   * @param activeModal
   */
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Init function
   * @param params Params
   */
  public init(params: any) {
    this.params = params;
    this.uploadProjectService = this.params.uploadProjectService;
    this.apiService = this.uploadProjectService.apiService;
    this.translateService = this.uploadProjectService.translateService;
    this.modelService = this.uploadProjectService.modelService;
    this.mvcService = this.uploadProjectService.mvcService;
  }

  /**
   * On folder selected event
   */
  public onFolderSelected(event: any) {
    this.invalidProjectWarningVisible = false;
    this.existingProjectWarningVisible = false;

    this.uploadData.progressValue = 0;
    this.uploadData.filesUploadedCount = 0;
    this.uploadData.filesToBeUploadedCount = 0;
    this.uploadData.files = [];

    if (event.target.files.length > 0) {
      this.buttonsDisabled = true;
      this.uploadButtonDisabled = true;
      this.uploadData.files = event.target.files;
      this.uploadData.projectName = this.uploadProjectService.getProjectFileName(this.uploadData.files);

      let canUploadProject = false;
      const checkUploadProject = this.uploadProjectService.checkIfProjectUploadIsValid(this.uploadData.files);
      if (checkUploadProject.noRailml) {
        this.invalidProjectWarningVisible = true;
        event.target.value = "";
      } else if (checkUploadProject.projectExists && !this.overwriteExistingProjects) {
        this.existingProjectWarningVisible = true;
        canUploadProject = true;
      } else {
        canUploadProject = true;
      }

      this.buttonsDisabled = false;
      this.uploadButtonDisabled = !canUploadProject;
      if (canUploadProject) {
        setTimeout(() => this.uploadButtonRef.nativeElement.focus(), 100);
      }
    }
  }

  /**
   * On upload button click event
   */
  public async onUploadBtnClick() {
    if (this.uploadData.uploadedComplete) {
      this.activeModal.close("done");
      return;
    }

    this.buttonsDisabled = true;
    this.uploadButtonDisabled = true;

    if (this.uploadData.files.length) {
      this.uploadData.filesToBeUploadedCount = this.uploadData.files.length;
      let cptr = 0;
      await this.uploadProjectService.uploadProjectFiles(this.uploadData.files, () => {
        this.uploadData.filesUploadedCount++;
        if (this.uploadData.filesUploadedCount % 10 === 0) {
          // Sending mvc event to restart session count down
          this.mvcService.emit({ type: MvcConst.MSG_UPLOADING_FILE });
        }
        this.uploadData.progressValue = Math.round(
          100 * (this.uploadData.filesUploadedCount / this.uploadData.filesToBeUploadedCount)
        );
      });
      this.messageUploadingDoneVisible = true;

      const promise = this.uploadProjectService
        .finalizeProjectUploadAndConvertion(this.uploadData.projectName)
        .then((res: any) => {
          this.messageUploadingDoneVisible = false;
          this.messageConversionDoneVisible = true;

          this.uploadData.uploadedComplete = true;
          this.selectButtonDisabled = true;
          this.buttonsDisabled = false;
          this.modelService.closeProject();
          this.modelService.reloadProjectList();
          setTimeout(() => this.closeButtonRef.nativeElement.focus(), 100);
        });
    } else {
      this.buttonsDisabled = false;
    }
  }
}
