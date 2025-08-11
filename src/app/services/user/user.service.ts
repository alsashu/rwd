import { MvcService } from "../../services/mvc/mvc.service";
import { ModelService } from "../../services/model/model.service";
import { ServicesConst } from "../services/services.const";
import { AppConfigService } from "../app/app-config.service";
import { IApiService } from "../api/api.service";
import { MvcConst } from "../mvc/mvc.const";
import { NavigationEnd, Router } from "@angular/router";
import { ISessionService, SessionService } from "../session/session.service";
import { IServicesService } from "../services/iservices.service";

/**
 * Interface of the UserService
 */
export interface IUserService {
  currentUser: any;

  getUserConfig(): any;
  setUserConfig(userConfig: any);
  getCurrentUser(): any;
  setCurrentUser(user: any);
  getCurrentUserName(): string;
  logOut();
  logIn(userIdData: { userName: string; password: string }): any;
  getKey();
  signUp(newUser: any): any;
  saveViewConfig(config: any): any;
  loadViewConfig(): any;
  getRoleForProject(projectId: string): string;
}

/**
 * Service for user management
 */
export class UserService implements IUserService {
  public static encryptKey = "right-viewer";
  public currentUser = null;
  public userConfig = null;
  public isLoginVisible = true;
  public isLoggedIn = false;

  private modelService: ModelService;
  private mvcService: MvcService;
  private apiService: IApiService;
  private sessionService: ISessionService;

  constructor(public servicesService: IServicesService) {}

  public initService() {
    this.sessionService = this.servicesService.getService(ServicesConst.SessionService) as ISessionService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as MvcService;
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;

    this.mvcService.mvcEvent.subscribe((message: any) => {
      if (message.type === MvcConst.MSG_MODEL_CONFIG_CHANGED) {
        this.setUserConfig(this.modelService.getModel().config.userConfig);
      }
    });
  }

  public getUserConfig(): any {
    return this.userConfig;
  }

  public setUserConfig(userConfig: any) {
    this.userConfig = userConfig;
  }

  public getCurrentUser(): any {
    this.currentUser = this.sessionService.getCurrentUser();
    return this.currentUser;
  }

  public setCurrentUser(user: any) {
    this.currentUser = user;
    this.isLoginVisible = user === null;
    this.mvcService.emit({ type: MvcConst.MSG_USER_CHANGED, user });
  }

  public getCurrentUserName(): string {
    return this.currentUser ? this.currentUser.userName : "";
  }

  public logOut() {
    this.modelService.closeProject();
    this.setCurrentUser(null);
    this.sessionService.clearSession();
    this.sessionService.goToLoginPage();
  }

  public logIn(userIdData: { userName: string; password: string }): any {
    return this.apiService.getUser(userIdData);
  }

  public getKey(): any {
    return this.apiService.getKey();
  }

  public signUp(newUser: any): any {
    return this.apiService.addUser(newUser);
  }

  public saveViewConfig(config: any): any {
    console.log("Saving user config");
    const data = { userConfig: config, userId: sessionStorage.getItem(SessionService.sessionVar.id) };
    return this.apiService.saveUserConfig(data);
  }

  public loadViewConfig(): any {
    console.log("Loading user config");
    return this.apiService.getUserConfig(sessionStorage.getItem(SessionService.sessionVar.id));
  }

  public getRoleForProject(projectId: string): string {
    const roles = this.sessionService.getCurrentUserRoles();
    const roleForProject = roles.find(
      (roleData: any) => roleData.projectId === projectId || roleData.projectId === "*"
    );
    return roleForProject ? roleForProject.role : "none";
  }
}
