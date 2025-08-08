import { IApiService } from "../api/api.service";
import { IMvcService } from "../mvc/imvc.service";
import { MvcConst } from "../mvc/mvc.const";
import { ServicesConst } from "../services/services.const";
import { IServicesService } from "../services/iservices.service";
import { IUserService } from "../user/user.service";

export interface IRightsService {
  initRights();
  loadRights();
  userHasAdminRights(): boolean;
  setUserRightsForProject(projectId: string);
  canRead(subject: string): boolean;
  canWrite(subject: string): boolean;
  canReadProject(projectId: string): boolean;
}

/**
 * Service managing user's rights
 */
export class RightsService implements IRightsService {
  public static noneLevel = "none";
  public static readLevel = "read";
  public static writeLevel = "write";

  private rights: any = [];
  private userRightsForProject: any = {};

  private apiService: IApiService;
  private userService: IUserService;
  private mvcService: IMvcService;

  /**
   * Constructor
   * @param servicesService Services service
   */
  constructor(private servicesService: IServicesService) {}

  /**
   * Service initialization
   */
  public initService() {
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.userService = this.servicesService.getService(ServicesConst.UserService) as IUserService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
  }

  /**
   * Initialization
   */
  public initRights() {
    this.loadRights();
  }

  /**
   * Get the global rights of the user
   */
  public loadRights() {
    this.apiService.getRights().then((res: any) => {
      if (res && res.success === false) {
        console.error("loadRights error", res);
      } else {
        this.rights = res || [];
        console.error("loadRights ok:", this.rights);
      }
    });
  }

  /**
   * Test is current user is admin
   * @returns True if current user is admin
   */
  public userHasAdminRights(): boolean {
    let res = true;
    const userRights =
      this.rights && this.rights.find
        ? this.rights.find((r: any) => r.id === this.userService.getRoleForProject("*")) || {}
        : {};
    res = userRights && userRights.id === "admin";
    return res;
  }

  /**
   * Get specific right's related to a project
   * @param projectId The id of the project
   */
  public setUserRightsForProject(projectId: string) {
    this.userRightsForProject =
      this.rights && this.rights.find
        ? this.rights.find((r: any) => r.id === this.userService.getRoleForProject(projectId)) || {}
        : {};
    this.mvcService.emit({ type: MvcConst.MSG_RIGHTS_LOADED });
  }

  /**
   * Functions that return the boolean : the user has a specific level of right for a subject
   * @param subject String, the subject tested
   * @param level String, the level required
   * @returns Boolean
   */
  private canDo(subject: string, level: string): boolean {
    if (this.userRightsForProject && this.userRightsForProject.rights && this.userRightsForProject.rights.find) {
      const right = this.userRightsForProject.rights.find((r: any) => r.id === subject || r.id === "*");
      if (!right) {
        return false;
      } else {
        return right.level === level;
      }
    }
    return false;
  }

  /**
   * Functions that return the boolean : the user can read or write on this subject
   * @param subject String code defining the the subject of the right we are testing
   * @returns If the user can read or write on this subject
   */
  public canRead(subject: string): boolean {
    return this.canDo(subject, RightsService.readLevel) || this.canDo(subject, RightsService.writeLevel);
  }

  /**
   * Functions that return the boolean : the user can write on this subject
   * @param subject String code defining the the subject of the right we are testing
   * @returns If the user can write on this subject
   */
  public canWrite(subject: string): boolean {
    return this.canDo(subject, RightsService.writeLevel);
  }

  /**
   * Functions that return the boolean : the user can read a project
   * @param projectId The id of the project
   * @returns If the user can read the project
   */
  public canReadProject(projectId: string): boolean {
    return this.userService.getRoleForProject(projectId) !== "none";
  }
}
