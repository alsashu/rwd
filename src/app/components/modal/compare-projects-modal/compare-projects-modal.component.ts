import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IApiService } from "src/app/services/api/api.service";
import { ICompareService } from "src/app/services/compare/compare.service";
import { IModelService } from "src/app/services/model/model.service";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ITranslateService } from "src/app/services/translate/translate.service";

@Component({
  selector: "app-compare-projects-modal",
  templateUrl: "./compare-projects-modal.component.html",
  styleUrls: ["./compare-projects-modal.component.css"],
})
export class CompareProjectsModalComponent {
  public title = "RIGHT VIEWER";
  public btnOKLabel = "OK";
  public buttonsDisabled = false;
  public message = "";
  public messageVisible = true;

  public servicesService: IServicesService;
  public translateService: ITranslateService;
  public modelService: IModelService;
  public compareService: ICompareService;
  public apiService: IApiService;

  public params: any;

  public maxWarningVisible = true;

  /**
   * Form data
   */
  public formData: any = {
    maxCompareProjectCount: 4,
    projectFilter: "",
    selectedProjectId: "",
    projectsList: [],
    selectedCompareProjectId: "",
    compareProjectsList: [],
    selectedProjectLabel: "",
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
    this.servicesService = params.servicesService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.compareService = this.servicesService.getService(ServicesConst.CompareService) as ICompareService;
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;

    const projectList = this.modelService.getProjectList();
    const selectedProject = this.modelService.getSelectedProject();
    const compareProjectList = this.compareService.getCompareProjectList();

    // Fill project list
    projectList.forEach((project: any) => {
      if (!compareProjectList.includes(project) && (selectedProject === null || project.id !== selectedProject.id)) {
        this.formData.projectsList.push(project);
      }
    });
    this.formData.selectedProjectLabel = selectedProject.label;
    this.formData.projectFilter = selectedProject.label.substring(0, 4);

    // Fill comparison project list
    this.compareService.compareData.projectList.forEach((p: any) => {
      if (p !== selectedProject) {
        this.addProject(p);
      }
    });
    // this.debugInit(); // TODO DEBUG
  }

  /**
   * Debug init (to be deleted)
   */
  private debugInit() {
    if (!this.apiService.isServerLocalhost()) {
      return;
    }
    const selectedProject = this.modelService.getSelectedProject();
    if (selectedProject && selectedProject.label === "Project_5") {
      this.addProject(this.formData.projectsList.find((p: any) => p.label === "Project_4"));
      this.addProject(this.formData.projectsList.find((p: any) => p.label === "Project_3"));
      this.addProject(this.formData.projectsList.find((p: any) => p.label === "Project_2"));
      this.addProject(this.formData.projectsList.find((p: any) => p.label === "Project_1"));
      this.onOKBtnClick();
    }
  }

  /**
   * Add a project button click
   */
  public onAddBtnClick() {
    if (this.formData.compareProjectsList.length < this.formData.maxCompareProjectCount) {
      this.addProject(this.formData.projectsList.find((p: any) => p.id === this.formData.selectedProjectId));
      this.formData.selectedProjectId = "";
    }
  }

  /**
   * Remove a project button click
   */
  public onRemoveBtnClick() {
    if (this.formData.selectedCompareProjectId) {
      this.removeProject(
        this.formData.compareProjectsList.find((p: any) => p.id === this.formData.selectedCompareProjectId)
      );
      this.formData.selectedCompareProjectId = "";
    }
  }

  /**
   * Move up a project button click
   */
  public onUpBtnClick() {
    const arr = this.formData.compareProjectsList;
    const i = arr.findIndex((p: any) => p.id === this.formData.selectedCompareProjectId);
    if (i > 0) {
      arr.splice(i - 1, 0, arr.splice(i, 1)[0]);
    }
  }

  /**
   * Up button disable state
   * @returns Boolean
   */
  public onUpBtnDisabled() {
    return !(
      this.formData.selectedCompareProjectId &&
      this.formData.compareProjectsList.findIndex((p: any) => p.id === this.formData.selectedCompareProjectId) > 0
    );
  }

  /**
   * Move down a project button click
   */
  public onDownBtnClick() {
    const arr = this.formData.compareProjectsList;
    const i = arr.findIndex((p: any) => p.id === this.formData.selectedCompareProjectId);
    if (i < this.formData.compareProjectsList.length - 1) {
      arr.splice(i + 1, 0, arr.splice(i, 1)[0]);
    }
  }

  /**
   * Down button disable state
   * @returns Boolean
   */
  public onDownBtnDisabled() {
    return !(
      this.formData.selectedCompareProjectId &&
      this.formData.compareProjectsList.findIndex((p: any) => p.id === this.formData.selectedCompareProjectId) <
        this.formData.compareProjectsList.length - 1
    );
  }

  /**
   * Add a project to the comparison list
   * @param project
   */
  private addProject(project: any) {
    if (project) {
      this.formData.projectsList = this.formData.projectsList.filter((p: any) => p.id !== project.id);
      this.formData.compareProjectsList.push(project);
    }
  }

  /**
   * Remove a project to the comparison list
   * @param project
   */
  private removeProject(project: any) {
    if (project) {
      this.formData.compareProjectsList = this.formData.compareProjectsList.filter((p: any) => p.id !== project.id);
      this.formData.projectsList.push(project);
    }
  }

  /**
   * On ok button click event
   */
  public onOKBtnClick() {
    if (this.formData.compareProjectsList.length) {
      this.compareService.resetCompareProjectList();
      this.formData.compareProjectsList.forEach((project: any) => {
        this.compareService.compareSelectedProjectWithAProject(project, true);
      });
    }
    this.activeModal.close("done");
  }

  /**
   * Get project list
   * @returns
   */
  public getProjectsList() {
    const filter = this.formData.projectFilter.toUpperCase();
    return this.formData.projectsList
      .filter((p: any) => filter === "" || p.label.toUpperCase().indexOf(filter) === 0)
      .sort((p1: any, p2: any) =>
        p1.label.toUpperCase().localeCompare(p2.label.toUpperCase().toUpperCase(), "en", { numeric: true })
      );
  }
}
