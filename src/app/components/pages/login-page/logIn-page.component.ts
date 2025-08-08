import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, LOCALE_ID, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { IUserService } from "src/app/services/user/user.service";
import { ISessionService, SessionService } from "src/app/services/session/session.service";
import { IApiService } from "src/app/services/api/api.service";
import { IWebsocketService } from "src/app/services/websocket/websocket.service";
import { ITranslateService, TranslateService } from "src/app/services/translate/translate.service";
import { AppConfigConst } from "src/app/services/app/app-config-const.service";
import { IAppConfigService } from "src/app/services/app/app-config.service";
import { IAuthentificationService } from "src/app/services/user/authentification.service";
import { IAndroidService } from "src/app/services/android/android.service";
import { environment } from "src/environments/environment";
import { IOfflineApiService } from "src/app/services/android/offline-api.service";

function _window(): any {
  return window;
}

@Component({
  selector: "app-LogIn",
  templateUrl: "./logIn-page.component.html",
  styleUrls: ["./logIn-page.component.css"],
})
/**
 * Login page component
 */
export class LogInPageComponent implements OnInit, AfterViewInit {
  public static localStorageKey = {
    email: "alm-rvw-email",
    pwd: "alm-rvw-pwd",
    rememberMe: "alm-rvw-rememberMe",
    failedAttempts: "alm-rvw-failedAttempts",
    ipServer: "alm-rvw-ipServer",
    offline: "alm-rvw-offline",
  };

  // public showDisconnectedMessage: boolean = false;
  public setServerUrlDelayOn = false;
  public showErrorMessage: boolean;
  public showInformationMessage: boolean;
  public informationMessage: string;
  public loginForm: UntypedFormGroup;
  public submitted = false;
  public failedAttempts =
    0 || parseInt(localStorage.getItem(LogInPageComponent.localStorageKey.failedAttempts), 10) || 0;
  public failedAttemptsMessage = false;
  public loginButtonDisabled = false;
  public waitingTimeMin = 0;
  // private _isLoggedIn = false;
  public usernameHTML = $localize`:@@logIn.page.username:Username`;
  public passwordHTML = $localize`:@@logIn.page.password:Password`;
  public defaultIpServer = localStorage.getItem(LogInPageComponent.localStorageKey.ipServer) || "localhost";
  public language;
  public setLanguage = "en-US";
  public availableLanguages: any;
  public supportedLanguages = [
    { code: "fr", language: "fr" },
    { code: "en-US", language: "en-US" },
    { code: "es", language: "es" },
    { code: "it", language: "it" },
  ];
  public hidePassword = true;
  public offlineVisible = this.isAndroidApp();

  public userService: IUserService;
  public sessionService: ISessionService;
  public apiService: IApiService;
  public websocketService: IWebsocketService;
  public translateService: ITranslateService;
  public appConfigService: IAppConfigService;
  public authentificationService: IAuthentificationService;
  public androidService: IAndroidService;
  private offlineApiService: IOfflineApiService;

  @ViewChild("ipServer")
  public ipServer: ElementRef;

  @ViewChild("rememberMe")
  public rememberMe: ElementRef;

  @ViewChild("offline")
  public offline: ElementRef;

  /**
   * Constructor
   * @param servicesService The ServicesService
   * @param formBuilder The FormBuilder
   * @param router The Router
   * @param localeId The localeId
   */
  constructor(
    public servicesService: ServicesService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    @Inject(LOCALE_ID) protected localeId: string
  ) {}

  /**
   * Component init
   */
  public ngOnInit() {
    this.userService = this.servicesService.getService(ServicesConst.UserService) as IUserService;
    this.sessionService = this.servicesService.getService(ServicesConst.SessionService) as ISessionService;
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.websocketService = this.servicesService.getService(ServicesConst.WebsocketService) as IWebsocketService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.appConfigService = this.servicesService.getService(ServicesConst.AppConfigService) as IAppConfigService;
    this.authentificationService = this.servicesService.getService(
      ServicesConst.AuthentificationService
    ) as IAuthentificationService;
    this.androidService = this.servicesService.getService(ServicesConst.AndroidService) as IAndroidService;
    this.offlineApiService = this.servicesService.getService(ServicesConst.OfflineApiService) as IOfflineApiService;

    this.loginForm = this.formBuilder.group({
      email: [localStorage.getItem(LogInPageComponent.localStorageKey.email) || "", Validators.required],
      password: [localStorage.getItem(LogInPageComponent.localStorageKey.pwd) || "", Validators.required],
    });

    this.language = localStorage.getItem(TranslateService.localStorageKey.language) || "en-US";
    this.setLanguage = "en-US";
    this.availableLanguages = this.supportedLanguages.filter((l: any) => l.code !== this.language);
  }

  /**
   * Indicates if android app
   * @returns
   */
  public isAndroidApp(): boolean {
    return environment.cordova || environment.debugCordova;
  }

  /**
   * After view init
   */
  public ngAfterViewInit() {
    this.rememberMe.nativeElement.checked =
      localStorage.getItem(LogInPageComponent.localStorageKey.rememberMe) === "checked";
    if (this.offlineVisible) {
      this.offline.nativeElement.checked =
        localStorage.getItem(LogInPageComponent.localStorageKey.offline) === "checked" && this.offlineVisible;
    }
    this.setServerUrl();
  }

  /**
   * Convenience getter for easy access to form fields
   */
  public get f() {
    return this.loginForm.controls;
  }

  /**
   * Login button call back
   * @param event The event
   * @param login The login
   * @param pwd The password
   */
  public loginClicked(event: any, login: string, pwd: string) {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log("Login form is invalid");
      return;
    }

    // check if account is locked or not
    if (this.failedAttempts >= 3) {
      this.waitingTimeMin = Math.max(this.failedAttempts - 2, 0);
      this.failedAttemptsMessage = true;
      setTimeout(() => {
        this.loginButtonDisabled = false;
        this.failedAttemptsMessage = false;
        this.failedAttempts = 0;
        localStorage.setItem(LogInPageComponent.localStorageKey.failedAttempts, "" + this.failedAttempts);
      }, 1 * this.waitingTimeMin * 60000);
      console.log("Login failed attempts locked");
      return;
    }
    const userData = {
      userName: login,
      password: pwd,
    };

    // Call user service login
    this.userService.logIn(userData).then((res: any) => {
      // User found
      if (Object.keys(res).length !== 0 && pwd !== "default") {
        this.userService.setCurrentUser(res);
        this.sessionService.setCurrentUser(res);
        this.rememberMe.nativeElement.checked ? this.saveUserToLocalStorage(login, pwd) : this.clearLocalStorageData();
        this.failedAttempts = 0;
        localStorage.setItem(LogInPageComponent.localStorageKey.failedAttempts, "" + this.failedAttempts);
        this.router.navigate(["main"]);
      } else if (Object.keys(res).length !== 0 && pwd === "default") {
        // User not found
        this.router.navigate(["reset-password"]);
      } else {
        this.onLoginFailed();
      }
    });
  }

  /**
   * Login button disable function
   * @returns
   */
  public isLoginButtonDisabled(): boolean {
    return this.loginButtonDisabled || !(this.isConnectedToServer() || this.isOfflineChecked());
  }

  /**
   * SSO Login button disable function
   * @returns
   */
  public isSSOLoginButtonDisabled(): boolean {
    return this.loginButtonDisabled || !this.isConnectedToServer();
  }

  /**
   * Test if is connected to the server
   * @returns
   */
  public isConnectedToServer(): boolean {
    return this.websocketService && this.websocketService.isConnected;
  }

  /**
   * Test if offline check box is checked
   * @returns
   */
  public isOfflineChecked(): boolean {
    return this.offlineVisible && this.offline && this.offline.nativeElement && this.offline.nativeElement.checked;
  }

  /**
   * Login fail
   */
  public onLoginFailed() {
    this.failedAttempts++;
    localStorage.setItem(LogInPageComponent.localStorageKey.failedAttempts, "" + this.failedAttempts);
    if (this.failedAttempts >= 3) {
      this.loginButtonDisabled = true;
      this.waitingTimeMin = Math.max(this.failedAttempts - 2, 0);
      this.failedAttemptsMessage = true;
      setTimeout(() => {
        this.loginButtonDisabled = false;
        this.failedAttemptsMessage = false;
        this.failedAttempts = 0;
        localStorage.setItem(LogInPageComponent.localStorageKey.failedAttempts, "" + this.failedAttempts);
      }, 1 * this.waitingTimeMin * 60000);
      return;
    }
    if (this.failedAttempts < 3) {
      this.showErrorMessage = true;
    } else {
      this.showErrorMessage = false;
      this.failedAttemptsMessage = true;
    }
  }

  /**
   * On reset click
   * @param event The event
   * @param login The login
   * @param pwd The password
   */
  public resetClicked(event: any, login: string, pwd: string) {
    this.loginForm.reset();
    this.showErrorMessage = false;
  }

  /**
   * On change language
   * @param event The event
   */
  public onChangeLanguage(event: any) {
    this.applyLanguage(event.target.value);
  }

  /**
   * Apply a language
   * @param languageCode The language code
   */
  public applyLanguage(languageCode: string) {
    if (this.language !== languageCode) {
      this.language = languageCode;
      localStorage.setItem(TranslateService.localStorageKey.language, this.language);
      this.translateService.setLanguage(this.language);

      let url = window.location.href;
      this.supportedLanguages.forEach((language: any) => {
        if (language.code !== languageCode) {
          url = url.replace("/" + language.code, "/" + languageCode);
        }
      });
      window.location.href = url;

      this.setLanguage = this.language;
      this.availableLanguages = this.supportedLanguages.filter((l) => l.code !== this.language);
    }
  }

  /**
   * Set server url
   */
  public setServerUrl() {
    this.setServerUrlDelayOn = true;
    setTimeout(() => {
      this.setServerUrlDelayOn = false;
    }, 300);

    const ipServerValue = this.ipServer.nativeElement.value;
    const base = ipServerValue.split("://")[0] === "http" ? "http" : "https";
    const baseIpAdress = this.ipServer.nativeElement.value.split("://")[1] || ipServerValue;
    AppConfigConst.config.SERVER_URL = base + "://" + baseIpAdress;
    localStorage.setItem(LogInPageComponent.localStorageKey.ipServer, ipServerValue);
    localStorage.setItem(SessionService.sessionVar.serverUrl, AppConfigConst.config.SERVER_URL);

    const isOffLine =
      this.offlineVisible && this.offline.nativeElement.checked && this.offlineVisible ? "checked" : "unchecked";
    AppConfigConst.config.OFFLINE = this.offlineVisible && this.offline.nativeElement.checked;
    localStorage.setItem(LogInPageComponent.localStorageKey.offline, isOffLine);
    localStorage.setItem(SessionService.sessionVar.offline, isOffLine);

    console.log("New serverUrl:", AppConfigConst.config.SERVER_URL);
    if (this.websocketService) {
      this.websocketService.resetConnection();
    }
    this.apiService.resetConnection();
  }

  /**
   * Save data in local storage
   * @param userName The user name
   * @param password The password
   */
  public saveUserToLocalStorage(userName: string, password: string) {
    localStorage.setItem(LogInPageComponent.localStorageKey.email, userName);
    localStorage.setItem(LogInPageComponent.localStorageKey.pwd, password);
    localStorage.setItem(LogInPageComponent.localStorageKey.rememberMe, "checked");
  }

  /**
   * Clear local storage data
   */
  public clearLocalStorageData() {
    localStorage.removeItem(LogInPageComponent.localStorageKey.email);
    localStorage.removeItem(LogInPageComponent.localStorageKey.pwd);
    localStorage.removeItem(LogInPageComponent.localStorageKey.rememberMe);
  }

  /**
   * Connect with SSO
   */
  public connectWithSSOClicked(event: any) {
    this.authentificationService.connectWithSSO(this.router);
  }

  /**
   * On offline checkbox change
   * @param event
   */
  public onOffLineCBChange(event: Event) {
    this.setServerUrl();
  }

  /**
   * On logo double click, hidden function for cleaning admin offline data
   * @param event
   */
  public onLogoDblClick(event: Event) {
    if (this.isAndroidApp()) {
      this.offlineApiService.cleanFileSystem();
    }
  }
}
