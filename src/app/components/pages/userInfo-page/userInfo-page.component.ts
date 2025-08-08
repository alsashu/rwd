import { AfterViewInit, Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { UntypedFormBuilder } from "@angular/forms";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ISessionService } from "src/app/services/session/session.service";
import { IUserService } from "src/app/services/user/user.service";
import { IApiService } from "src/app/services/api/api.service";
import { IAuthentificationService } from "src/app/services/user/authentification.service";
import { TranslateService } from "src/app/services/translate/translate.service";
import { IMvcService } from "src/app/services/mvc/imvc.service";
import { MvcConst } from "src/app/services/mvc/mvc.const";

/**
 * User info page called by sso redirection
 */
@Component({
  selector: "app-user-profile",
  templateUrl: "./userInfo-page.component.html",
  styleUrls: ["./userInfo-page.component.css"],
})
export class UserInfoPageComponent implements OnInit, OnDestroy, AfterViewInit {
  private static RedirectToLoginPageDelayMs = 4000;

  public userService: IUserService;
  public sessionService: ISessionService;
  public apiService: IApiService;
  public authentificationService: IAuthentificationService;
  public mvcService: IMvcService;

  public mvcEventSubscription: any;
  public showErrorMessage = true;

  /**
   * Constructor
   * @param servicesService The services service
   * @param formBuilder The form builder
   * @param router The router
   */
  constructor(
    public servicesService: ServicesService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {
    this.userService = this.servicesService.getService(ServicesConst.UserService) as IUserService;
    this.sessionService = this.servicesService.getService(ServicesConst.SessionService) as ISessionService;
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.authentificationService = this.servicesService.getService(
      ServicesConst.AuthentificationService
    ) as IAuthentificationService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
  }

  /**
   * Component init
   */
  public ngOnInit() {
    this.initMvc();
  }

  /**
   * On destroy
   */
  public ngOnDestroy() {
    if (this.mvcEventSubscription) {
      this.mvcEventSubscription.unsubscribe();
    }
  }

  /**
   * Init mvc
   */
  private initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      // Wait for config loading, then call user management
      if (message.type === MvcConst.MSG_END_LOADING_APP_CONFIG) {
        this.callUserManagement();
      }
    });
  }

  /**
   * After view init
   */
  public ngAfterViewInit() {
    // Android app, config already loaded
    this.callUserManagement();
  }

  /**
   * Call user management
   */
  public callUserManagement() {
    console.log("sso call User Management");

    if (!this.authentificationService.isConfigLoaded) {
      console.log("callUserManagement: config not loaded. Aborting*.");
      return;
    }

    this.showErrorMessage = false;
    this.authentificationService
      .getResponseFromMicrosoft()
      .then(
        (res: string) => {
          // Call user management to get authorizationKey
          const msRes = this.authentificationService.getUserInfoFromMSResponse(res);
          if (msRes && msRes.subscribe) {
            msRes.subscribe((res: any) => {
              try {
                // Get authorization key from server
                this.userService.getKey().then((keyData: any) => {
                  // Store user
                  res.authorizationKey = keyData.authorizationKey;
                  this.userService.setCurrentUser(res);
                  this.sessionService.setCurrentUser(res);
                  this.redirectToMainPage();
                });
              } catch (e) {
                this.onLoginError(e);
              }
            });
          } else {
            this.onLoginError("Error");
          }
        },
        (error: any) => {
          this.onLoginError(error);
        }
      )
      .catch((error: any) => {
        this.onLoginError(error);
      });
  }

  /**
   * On login error
   * @param error The error string
   */
  private onLoginError(error: any) {
    console.error("error", error);
    this.showErrorMessage = true;
    setTimeout(() => {
      this.router.navigate([""]);
    }, UserInfoPageComponent.RedirectToLoginPageDelayMs);
  }

  /**
   * Redirect to main page
   */
  private redirectToMainPage() {
    const language = localStorage.getItem(TranslateService.localStorageKey.language) || "en-US";
    let url = window.location.href.split("?")[0];
    if (this.authentificationService.isCurrentUrlLocalhost()) {
      console.log("Redirecting to main page via router");
      this.router.navigate(["main"]);
    } else {
      url = url.replace("/en-US/user-info", "/" + language + "/main");
      console.log("Redirecting to main page", url);
      window.location.href = url;
    }
  }
}
