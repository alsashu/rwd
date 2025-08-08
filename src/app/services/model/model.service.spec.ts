import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { IApiService } from "../api/api.service";
import { IModelService } from "./model.service";
import { testsUtils } from "src/test";

describe("ModelService", () => {
  let servicesService: IServicesService;

  let modelService: IModelService;
  let apiService: IApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    testsUtils.init(servicesService);

    modelService = servicesService.getService(ServicesConst.ModelService) as IModelService;
    apiService = servicesService.getService(ServicesConst.ApiService) as IApiService;
  });

  it("should be created", () => {
    expect(modelService).toBeTruthy();
  });

  it("should have no selected project", () => {
    expect(modelService.getSelectedProject()).toBeFalsy();
  });

  it("should be able to set a project", () => {
    const project = { id: "proj1" };
    modelService.setSelectedProject(project);
    expect(modelService.getSelectedProject()).toBeTruthy();
    expect(modelService.getSelectedProject().id === project.id).toBeTruthy();
  });

  it("should be able to open a project", (done) => {
    const testProject = testsUtils.testProject1;
    const testProjectData = testsUtils.testProject1Data;
    modelService.getModel().projects = [testProject];
    const spy = spyOn(apiService, "loadProjectFromId").and.returnValue(Promise.resolve(testProjectData));
    modelService.setSelectedProject(null);
    modelService.openProject(testProject);
    spy.calls.mostRecent().returnValue.then(() => {
      expect(modelService.getSelectedProject().id === testProject.id).toBeTruthy();
      done();
    });
  });
});
