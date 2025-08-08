import { MvcService } from "../mvc/mvc.service";
import { ServicesConst } from "../services/services.const";
import { NavigationEnd, Router } from "@angular/router";
import { IServicesService } from "../services/iservices.service";
import { IInjectableUtilsService } from "../injectable/injectable-utils.service";
import Utf8 from "crypto-js/enc-utf8";
import * as CryptoJS from "crypto-js";
import { ITranslateService } from "../translate/translate.service";

/**
 * Interface of the session service class
 */
export interface ISessionService {
  initCountdown();
  goToLoginPage();
  clearSession();
  setCurrentUser(user: any);
  getCurrentUser();
  getCurrentUserRoles(): any[];
}

/**
 * Service managing the session
 */
export class SessionService implements ISessionService {
  private static encryptKey = "SessionServiceKey";

  public static sessionVar = {
    userName: "userName",
    authorizationKey: "authorizationKey",
    id: "id",
    roles: "roles",
    password: "password",
    selectedProject: "selectedProject",
    selectedProjectName: "selectedProjectName",
    serverUrl: "alm-rw-serverUrl",
    offline: "offline",
  };

  private mvcService: MvcService;
  private inactiveTimer: any;
  private maxInactiveTimeMin = 120;

  private router: Router;
  private translateService: ITranslateService;

  /**
   * Constructor
   * @param servicesService
   */
  constructor(private servicesService: IServicesService) {}

  /**
   * Init the service
   */
  public initService() {
    this.router = (
      this.servicesService.getService(ServicesConst.InjectableUtilsService) as IInjectableUtilsService
    ).router;

    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as MvcService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
  }

  /**
   * Function that encrypts the data using the encrypt key
   * @param encryptKey string used to encrypt or decrypt data
   * @param data string reprsenting the data
   */
  public encryptData(encryptKey: string, data: string): string {
    return CryptoJS.AES.encrypt(data, encryptKey).toString();
  }

  /**
   * Function that decrypts the data using the encrypt key
   * @param encryptKey string used to encrypt or decrypt data
   * @param encryptData string reprsenting the crypted data
   */
  public decryptData(encryptKey: string, encryptData: string): string {
    return CryptoJS.AES.decrypt(encryptData, encryptKey).toString(Utf8);
  }

  /**
   * Init the session time out
   * @param router
   */
  public initCountdown() {
    this.inactiveTimer = setTimeout(() => {
      this.logOut();
    }, this.maxInactiveTimeMin * 60000);
    this.mvcService.mvcEvent.subscribe((message: any) => {
      clearTimeout(this.inactiveTimer);
      this.inactiveTimer = setTimeout(() => {
        this.logOut();
      }, this.maxInactiveTimeMin * 60000);
    });
  }

  /**
   * Log out
   * @param router
   */
  public logOut() {
    this.clearSession();
    alert(this.translateService.translateFromMap("Session closed due to inactivity"));
    this.goToLoginPage();
  }

  /**
   * Go to the login page
   * @param router
   */
  public goToLoginPage() {
    if (this.router) {
      this.router.events.subscribe((value) => {
        if (value instanceof NavigationEnd) {
          window.location.reload();
        }
      });
      this.router.navigate([""]);
    }
  }

  /**
   * Clear the session
   */
  public clearSession() {
    const keys = Object.keys(SessionService.sessionVar);
    keys.forEach((element: string) => {
      sessionStorage.setItem(SessionService.sessionVar[element], null);
    });
  }

  /**
   * Set the current user and save it in the session data
   * @param user The user
   */
  public setCurrentUser(user: any) {
    sessionStorage.setItem(SessionService.sessionVar.userName, user.userName);
    sessionStorage.setItem(SessionService.sessionVar.password, user.password);
    sessionStorage.setItem(SessionService.sessionVar.id, user.id);
    sessionStorage.setItem(SessionService.sessionVar.authorizationKey, user.authorizationKey);
    // Encryption to avoid penetration
    sessionStorage.setItem(
      SessionService.sessionVar.roles,
      this.encryptData(SessionService.encryptKey, JSON.stringify(user.roles))
    );
    // sessionStorage.setItem(SessionService.sessionVar.roles, JSON.stringify(user.roles));
  }

  /**
   * Get the current user stored in the session
   * @returns
   */
  public getCurrentUser(): any {
    const user = {};
    user[SessionService.sessionVar.userName] = sessionStorage.getItem(SessionService.sessionVar.userName);
    user[SessionService.sessionVar.password] = sessionStorage.getItem(SessionService.sessionVar.password);
    user[SessionService.sessionVar.id] = sessionStorage.getItem(SessionService.sessionVar.id);
    user[SessionService.sessionVar.authorizationKey] = sessionStorage.getItem(
      SessionService.sessionVar.authorizationKey
    );
    user[SessionService.sessionVar.roles] = this.getCurrentUserRoles();
    return user;
  }

  /**
   * Get the current roles
   * @returns The list of roles
   */
  public getCurrentUserRoles(): any[] {
    // Encryption to avoid penetration
    return JSON.parse(
      this.decryptData(SessionService.encryptKey, sessionStorage.getItem(SessionService.sessionVar.roles) || "")
    );
    // return JSON.parse(sessionStorage.getItem(SessionService.sessionVar.roles));
  }
}
