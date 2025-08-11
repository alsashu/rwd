import { IApiService } from "../api/api.service";
import { IMessageService } from "../message/message.service";
import { ModelConstService } from "../model/model-const.service";
import { IModelPropertiesService } from "../model/model-properties.service";
import { ModelService } from "../model/model.service";
import { IMvcService } from "../mvc/imvc.service";
import { MvcConst } from "../mvc/mvc.const";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ITranslateService } from "../translate/translate.service";

/**
 * Interface of the compare service
 */
export interface ICompareData {
  label: string;
  type: string;
  projectList: any[];
  compareDataByProjectMap: any;
  compareObjectsMap: any;
  compareError: boolean;
  compareErrorMessage: string;
}

/**
 * Interface of the compare service
 */
export interface ICompareService {
  compareData: ICompareData;
  comparisonIsEnabled(): boolean;
  comparisonIsComputed(): boolean;
  multiVersionComparisonIsComputed(): boolean;
  getCompareProjectList(): any[];
  getCompareProjectIndex(project: any): number;
  resetCompareProjectList();
  compareSelectedProjectWithAProject(project: any, addToList?: boolean);
  getCompareObjectsData(object: any, compareProjectData: any): any;
  getCompareDataBetweenTwoVersions(object: any, objectPrevious: any, project: any): any;
  getCompareObjectsDataMap(object: any): any;
}

/**
 * Compare service
 */
export class CompareService implements ICompareService {
  /**
   * Compare status values
   */
  public static CompareState = {
    none: "none",
    new: "new",
    deleted: "deleted",
    equal: "equal",
    modified: "modified",
    graphicalModifiedOnly: "graphicalModifiedOnly",
    error: "error",
  };

  /**
   * Comparison data
   */
  public compareData: ICompareData = null;

  // Services
  private modelService: ModelService;
  private mvcService: IMvcService;
  private apiService: IApiService;
  public modelPropertiesService: IModelPropertiesService;
  public translateService: ITranslateService;
  private messageService: IMessageService;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(private servicesService: IServicesService) {
    // Here and not in init function because called in HMI by compare view tree
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as IModelPropertiesService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.messageService = this.servicesService.getService(ServicesConst.MessageService) as IMessageService;

    this.resetCompareData();
  }

  /**
   * Get the list of compared projects
   * @returns The list of projects
   */
  public getCompareProjectList(): any[] {
    return this.compareData.projectList;
  }

  /**
   * Get project index in compare project list
   * @param project The project
   * @returns Number
   */
  public getCompareProjectIndex(project: any): number {
    let projectIndex = 0;
    const projectList = this.getCompareProjectList();
    if (projectList.length) {
      projectIndex = -1;
      projectList.find((p: any) => {
        projectIndex++;
        return p.id === project.id;
      });
    }
    return projectIndex;
  }

  /**
   * Returns is comparison is enabled
   * @returns boolean value
   */
  public comparisonIsEnabled(): boolean {
    return this.getCompareProjectList().length > 1;
  }

  /**
   * Returns is comparison is enabled and computed (diff file exported by editor and loaded)
   * @returns boolean value
   */
  public comparisonIsComputed(): boolean {
    const projectCount = this.getCompareProjectList().length;
    const diffDataCount = this.compareData.compareDataByProjectMap.size;
    return projectCount > 1 && diffDataCount === projectCount - 1;
  }

  /**
   * Returns is comparison is enabled and computed (diff file exported by editor and loaded) for more than 2 projects
   * @returns boolean value
   */
  public multiVersionComparisonIsComputed(): boolean {
    return this.getCompareProjectList().length > 2 && this.comparisonIsComputed();
  }

  /**
   * Service init
   */
  public initService() {
    this.mvcService.mvcEvent.subscribe((message: any) => {
      if ([MvcConst.MSG_END_SELECTING_PROJECT].includes(message.type)) {
        this.initTestProjectComparison();
      } else if (message.type === MvcConst.MSG_END_LOADING_PROJECT_FOR_COMPARISON) {
        // this.compareData.projectList.push(message.project); // TODO test

        // Replace project data by loaded full project
        const projectIndex = this.compareData.projectList.findIndex(
          (p: any) => message.project && p.id === message.project.id
        );
        if (projectIndex > -1) {
          this.compareData.projectList[projectIndex] = message.project;
        }
      } else if ([MvcConst.MSG_START_SELECTING_PROJECT, MvcConst.MSG_PROJECT_CLOSED].includes(message.type)) {
        this.resetCompareData();
      }
    });
  }

  /**
   * Reset comparison data
   */
  private resetCompareData() {
    this.compareData = {
      label: "Projects comparison",
      type: ModelConstService.COMPARE_DATA_TYPE,
      projectList: [],
      compareDataByProjectMap: new Map(),
      compareObjectsMap: new Map(),
      compareError: false,
      compareErrorMessage: "",
    };
  }

  /**
   * Init project comparison for test (TODO TO BE DELETED)
   */
  public initTestProjectComparison() {
    const selectedProject = this.modelService.getSelectedProject();
    // if (selectedProject && selectedProject.label === "Montbard_V1.2") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("Montbard_V1.1"));
    // }

    // if (selectedProject && selectedProject.label === "Project_2") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("Project_1"));
    // }
    // if (selectedProject && selectedProject.label === "Project_3") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("Project_2"));
    // }
    // if (selectedProject && selectedProject.label === "Project_5") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("Project_4"));
    // }

    // if (selectedProject && selectedProject.label === "WDRailml_Test") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("WDRailml"));
    // }
    // if (selectedProject && selectedProject.label === "Montbard_V1.3") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("Montbard_V1.2"));
    // }
    // if (selectedProject && selectedProject.label === "Montbard_06.10_v1.1") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("Montbard_06.10_v1.0"));
    // }
    // if (selectedProject && selectedProject.label === "Montbard_06.10_v8.0") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("Montbard_06.10_v2.0"));
    // }
    // if (selectedProject && selectedProject.label === "RIGHT_TestLine_System_Testing_v04_Diff_New") {
    //   this.compareSelectedProjectWithAProject(
    //     this.modelService.getProjectByName("RIGHT_TestLine_System_Testing_v04_New")
    //   );
    // }
    // if (selectedProject && selectedProject.label === "RIGHT_TestLine_Alpha_v18_IOM_v02") {
    //   this.compareSelectedProjectWithAProject(this.modelService.getProjectByName("RIGHT_TestLine_Alpha_v18_IOM_v01"));
    // }
  }

  /**
   * Reset comparison
   */
  public resetCompareProjectList() {
    this.resetCompareData();
    this.mvcService.emit({ type: MvcConst.MSG_RESET_COMPARISON });
  }

  /**
   * Compare selected project with a project
   * @param project
   */
  public compareSelectedProjectWithAProject(project: any, addToList: boolean = false) {
    const selectedProject = this.modelService.getSelectedProject();
    if (project && project.type === ModelConstService.PROJECT_TYPE && selectedProject) {
      if (!addToList) {
        this.resetCompareData();
        this.mvcService.emit({ type: MvcConst.MSG_RESET_COMPARISON });
      }
      if (project.id !== selectedProject.id) {
        if (!this.compareData.projectList.length) {
          this.compareData.projectList.push(selectedProject);
        }
        const previousProject = this.compareData.projectList.slice().pop();
        this.compareData.projectList.push(project);
        this.loadProjectAndRunComparison(project, previousProject);
      }
    }
  }

  /**
   * Load project for comparison
   * @param project The project
   * @param referenceProject The reference project (more recent one)
   */
  public loadProjectAndRunComparison(project: any, referenceProject: any) {
    console.log("loadProjectForComparison", project, referenceProject);
    if (project && referenceProject) {
      this.compareData.label = this.translateService.translateFromMap("Projects comparison (Loading project...)");
      this.modelService.loadProjectFromId(project, { loadProjectForComparison: true });
      this.compareData.label = this.translateService.translateFromMap("Projects comparison (Computing...)");
      this.apiService
        .compareProjects(
          referenceProject.path + referenceProject.projectName + "\\" + referenceProject.railMlFileName,
          project.path + project.projectName + "\\" + project.railMlFileName,
          referenceProject.path + referenceProject.projectName
        )
        .then(
          (res: any) => {
            if (res.error) {
              // const compareErrorMessage = res.error.toString();
              this.compareData.label = this.translateService.translateFromMap("Projects comparison error");
              this.mvcService.emit({
                type: MvcConst.MSG_END_LOADING_PROJECT_COMPARISON_FILE,
                project,
                referenceProject,
              });
              this.compareData.compareError = true;
              // this.compareData.compareErrorMessage = compareErrorMessage;
              this.mvcService.emit({
                type: MvcConst.MSG_COMPARISON_ERROR,
                project,
                referenceProject,
                // error: compareErrorMessage,
              });
              this.messageService.addTextMessage(this.translateService.translateFromMap("Projects comparison error"));
              // console.error(compareErrorMessage);
            } else {
              const compareProjectData = res;
              this.setCompareProjectData(project, referenceProject, compareProjectData);
              this.compareData.label = this.translateService.translateFromMap("Projects comparison");
              this.mvcService.emit({
                type: MvcConst.MSG_END_LOADING_PROJECT_COMPARISON_FILE,
                project,
                referenceProject,
              });
            }
          },
          (res: any) => {}
        );
    }
  }

  /**
   * Set the compare data computed by the right editor -diff command
   * @param project The project (previous version)
   * @param selectedProject The selected project
   * @param compareProjectData The diff project
   */
  private setCompareProjectData(project: any, selectedProject: any, compareProjectData: any) {
    this.compareData.compareDataByProjectMap.set(selectedProject.id, compareProjectData);
  }

  /**
   * Get the compare data for an object
   * @param object The object with id and type
   * @param compareProjectData Compare data for the project
   * @returns Compare data for the object if found
   */
  public getCompareObjectsData(object: any, compareProjectData: any): any {
    let res = null;
    try {
      if (object && compareProjectData && compareProjectData.objects) {
        compareProjectData.objects.forEach((cpd: any) => {
          const objectClass = object && object.type ? object.type.split(":").pop() : null;
          if (!res && cpd.id === object.id && cpd.class === objectClass) {
            res = cpd;
            return;
          }
          if (!res && cpd.children && cpd.children.find) {
            res = this.getCompareObjectsDataInChildrenRec(object, cpd, objectClass);
            if (res) {
              return;
            }
          }
        });
      }
    } catch (ex) {
      console.error(ex);
    }
    return res;
  }

  /**
   * Get compare data recursively in children
   * @param object The object
   * @param compareProjectData The compare Project Data
   * @param objectClass The object class
   * @returns The object compare data if found
   */
  public getCompareObjectsDataInChildrenRec(object: any, compareProjectData: any, objectClass: string): any {
    let res = null;
    if (compareProjectData && compareProjectData.children && compareProjectData.children.find) {
      compareProjectData.children.forEach((child: any) => {
        if (!res) {
          if (child.id === object.id && child.class === objectClass) {
            res = child;
          } else {
            res = this.getCompareObjectsDataInChildrenRec(object, child, objectClass);
          }
        }
      });
    }
    return res;
  }

  /**
   * Get comparison result of comparison of two instances of the same object of two different projects
   * @param object The object
   * @param objectPrevious The same instance of the object belonging to the previous project
   * @returns The comparison data
   */
  public getCompareDataBetweenTwoVersions(object: any, objectPrevious: any, project: any): any {
    const res = {
      compareState: CompareService.CompareState.equal,
      properties: [],
      graphicalProperties: [],
    };
    if (object && object.id && object.type && project && project.id) {
      const compareData = this.compareData;
      const compareProjectData = compareData.compareDataByProjectMap.get(project.id);

      if (compareProjectData) {
        const compareOjectsData = this.getCompareObjectsData(object, compareProjectData);
        if (compareOjectsData) {
          if (compareOjectsData.state === "CHANGED") {
            const propOptions = { getMetaData: false, isUndefinedValueVisible: false, calcRedAndYellowOldValue: false };
            const objectProperties = this.modelPropertiesService.getObjectProperties(object, null, propOptions);
            const objectPreviousProperties = this.modelPropertiesService.getObjectProperties(
              objectPrevious,
              null,
              propOptions
            );

            res.compareState =
              compareOjectsData.state === "GRAPHICALCHANGEONLY"
                ? CompareService.CompareState.graphicalModifiedOnly
                : CompareService.CompareState.modified;

            res.properties = [];
            if (compareOjectsData.properties && compareOjectsData.properties.forEach) {
              compareOjectsData.properties.forEach((cp: any) => {
                const cpName = cp.name.split(":").pop();
                const propertyName = cpName === "KP" ? "absPos" : cpName;
                if (propertyName) {
                  const prop = objectProperties.find((p: any) => p.name === propertyName);
                  const propPrevious = objectPreviousProperties.find((p: any) => p.name === propertyName);
                  if (prop) {
                    const compareProperty = {
                      name: cpName,
                      nameWithPrefix: cp.name,
                      displayedName: prop.displayedName,
                      value: prop.value,
                      displayedValue: prop.displayedValue,
                      displayedValueOld: propPrevious
                        ? propPrevious.displayedValue
                        : cp.displayedValueOld
                        ? cp.displayedValueOld
                        : "",
                    };
                    res.properties.push(compareProperty);
                  }
                }
              });
            }
          }

          res.graphicalProperties = [];
          if (compareOjectsData.graphicalProperties && compareOjectsData.graphicalProperties.forEach) {
            compareOjectsData.graphicalProperties.forEach((gp: any) => {
              const cpName = gp.name.split(":").pop();
              const compareProperty = {
                name: cpName,
                nameWithPrefix: gp.name,
                displayedName: cpName,
                value: gp.newValue,
                displayedValue: gp.newValue,
                displayedValueOld: gp.originalValue,
              };
              res.graphicalProperties.push(compareProperty);
            });
          }
        }
      }
    }
    return res;
  }

  /**
   * Get compare data map for an object
   * @param object An object with id and type
   * @returns The found map, null instead
   */
  public getCompareObjectsDataMap(object: any): any {
    let res = null;
    if (object && object.id) {
      const key = object.type + "-" + object.id;
      res = this.compareData.compareObjectsMap.get(key);
    }
    return res;
  }
}
