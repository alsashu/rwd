import { IServicesService } from "../services/iservices.service";
import { IApiService } from "../api/api.service";
import { ServicesConst } from "../services/services.const";
import { Router } from "@angular/router";
import { IAndroidService } from "../android/android.service";
import { IAppConfigService } from "../app/app-config.service";
import { environment } from "src/environments/environment";
import * as CryptoJS from "crypto-js";

/**
 * Interface of the AuthentificationService
 */
export interface IAuthentificationService {
  connectWithSSO(router: Router);
  getResponseFromMicrosoft(): any;
  getUserInfoFromMSResponse(res: string): any;
  isCurrentUrlLocalhost(): boolean;
  isConfigLoaded(): boolean;
}

/**
 * Service for authentification
 */
export class AuthentificationService implements IAuthentificationService {
  public static sessionStorageKey = {
    codeVerifier: "code_verifier",
    codeChallenge: "code_challenge",
  };

  private msSSOUrlTemplate =
    "https://login.microsoftonline.com/_APPID_/oauth2/v2.0/authorize?response_type=code&state=_STATE_&client_id=_CLIENTID_&scope=openid&redirect_uri=_REDIRECTURI_&code_challenge=_CODECHALLENGE_&code_challenge_method=S256";
  private msAuthTokenUrlTemplate = "https://login.microsoftonline.com/_APPID_/oauth2/v2.0/token";
  private languages = ["en-US", "fr", "it", "es"];
  private redirectUserInfoEndPoint = "user-info";
  private appId = "0d993ad3-fa73-421a-b129-1fe5590103f3";
  private ssoClientIdConfig = [];

  private apiService: IApiService;
  private androidService: IAndroidService;
  public appConfigService: IAppConfigService;

  public mvcEventSubscription: any;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(public servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.androidService = this.servicesService.getService(ServicesConst.AndroidService) as IAndroidService;
    this.appConfigService = this.servicesService.getService(ServicesConst.AppConfigService) as IAppConfigService;
  }

  /**
   * Test if config is loaded from the server
   * @returns boolean
   */
  public isConfigLoaded(): boolean {
    return this.ssoClientIdConfig.length > 0;
  }

  /**
   * Connect with SSO
   */
  public connectWithSSO(router: Router) {
    console.log("SSO connection");
    this.requestToMicrosoft(router);
  }

  /**
   * Request authentification to Microsoft
   * @param codeChallenge The code challenge... ???
   */
  private requestToMicrosoft(router: Router, codeChallenge: string = null) {
    const redirectUri = this.getRedirectUrlToUserInfoPage();
    const clientId = this.getClientId();
    codeChallenge = codeChallenge || this.produceCodeChallenge();
    const url = this.msSSOUrlTemplate
      .replace("_APPID_", this.appId)
      .replace("_CLIENTID_", clientId)
      .replace("_CODECHALLENGE_", codeChallenge)
      .replace("_REDIRECTURI_", redirectUri)
      .replace("_STATE_", "RIGHTEDITOR"); // TODO RIGHTVIEWER?

    // Not mobile?
    if (!environment.cordova) {
      document.location.assign(url);
    } else {
      this.androidService.openMobileBrowser(url);
    }
  }

  /**
   * Get redirect url to user info
   * @returns The url
   */
  private getRedirectUrlToUserInfoPage(): string {
    let currentUrl = window.location.href;
    const isLocalHost = this.isUrlLocalHost(currentUrl);

    // Remove language form url
    this.languages.forEach((language: string) => {
      currentUrl = currentUrl.replace("/" + language, "");
    });

    // Force en-US if not localhost and add user info end point
    let redirectUrl =
      currentUrl +
      (currentUrl.endsWith("/") ? "" : "/") +
      (isLocalHost ? "" : "en-US/") +
      this.redirectUserInfoEndPoint;

    if (environment.cordova) {
      redirectUrl = this.getAndroidRedirectUrl();
    }
    return redirectUrl;
  }

  /**
   * Get redirect url for android app
   * @returns string
   */
  private getAndroidRedirectUrl(): string {
    let res = "";
    this.loadSsoClientIdConfig();
    this.ssoClientIdConfig.forEach((clientDef: any) => {
      if ("android".indexOf(clientDef.urlPattern) > -1) {
        res = clientDef.redirectUrl;
      }
    });
    return res;
  }

  /**
   * Get sso config from config file
   */
  private loadSsoClientIdConfig() {
    if (this.ssoClientIdConfig.length === 0) {
      this.ssoClientIdConfig = this.appConfigService.configFile
        ? this.appConfigService.configFile.ssoClientIdConfig
        : this.ssoClientIdConfig;
    }
  }

  /**
   * Get client Id depending on url
   * @returns String value
   */
  private getClientId(): string {
    let clientId = "UNDEFINED";
    let currentUrl = String(window.location.href);
    if (environment.cordova) {
      currentUrl = "android";
    }
    this.loadSsoClientIdConfig();
    this.ssoClientIdConfig.forEach((clientDef: any) => {
      if (currentUrl.indexOf(clientDef.urlPattern) > -1) {
        clientId = clientDef.clientId;
      }
    });
    return clientId;
  }

  /**
   * Get response from Microsoft
   * @returns
   */
  public getResponseFromMicrosoft(): any {
    let sUrl = window.location.href;
    let url = new URL(sUrl);
    let code = url.searchParams.get("code");
    return this.authorizeUser(code);
  }

  /**
   * Authorize a user
   * @param code The code
   * @returns The response from ms authen url
   */
  private authorizeUser(code: string): any {
    const codeVerifier = sessionStorage.getItem(AuthentificationService.sessionStorageKey.codeVerifier);
    const clientId = this.getClientId();
    let url = window.location.href.split("?").shift();
    if (environment.cordova) {
      url = this.getAndroidRedirectUrl();
    }

    const headers = new Headers();
    headers.append("Origin", url);
    const body = new FormData();
    body.append("grant_type", "authorization_code");
    body.append("redirect_uri", url);
    body.append("client_id", clientId);
    body.append("code_verifier", codeVerifier);
    body.append("code", code);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: body,
      redirect: "follow",
    };

    const msAuthTokenUrl = this.msAuthTokenUrlTemplate.replace("_APPID_", this.appId);
    return fetch(msAuthTokenUrl, requestOptions)
      .then(
        (response: any) => response.text(),
        (reject: any) => {
          console.error("error", reject);
          return reject.text();
        }
      )
      .catch((error: any) => console.error("error", error)); // TODO redirect back to login?
  }

  /**
   * Generate a code verifier
   * @returns String value
   */
  private generateCodeVerifier(): string {
    return this.generateRandomString(128);
  }

  /**
   * Generates a random string
   * @param length The length of the string
   * @returns String value
   */
  private generateRandomString(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Generates the code challenge from the code verifier
   * @param codeVerifier The code verifier
   * @returns The code challenge
   */
  private generateCodeChallenge(codeVerifier: string): string {
    return this.base64URL(CryptoJS.SHA256(codeVerifier));
  }

  /**
   * Converts string to base 64 string
   * @param string The string value
   * @returns Base64 string
   */
  private base64URL(string: any): string {
    return string.toString(CryptoJS.enc.Base64).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }

  /**
   * Produces a code challenge
   * @returns A string value
   */
  public produceCodeChallenge(): string {
    let codeVerifier = this.generateCodeVerifier();
    let codeChallenge = this.generateCodeChallenge(codeVerifier);
    sessionStorage.setItem(AuthentificationService.sessionStorageKey.codeVerifier, codeVerifier);
    sessionStorage.setItem(AuthentificationService.sessionStorageKey.codeChallenge, codeChallenge);
    return codeChallenge;
  }

  /**
   * getUserInfoFromMSResponse
   * @param res The response from ms sso call
   */
  public getUserInfoFromMSResponse(res: string): any {
    try {
      const parseToken = JSON.parse(res);
      return this.apiService.getUserInfo({
        token: parseToken.access_token,
      });
    } catch (ex: any) {
      console.error(ex);
      return new Promise((resolve, reject) => reject(ex));
    }
  }

  /**
   * Is current url localhost
   * @returns Boolean
   */
  public isCurrentUrlLocalhost(): boolean {
    return this.isUrlLocalHost(window.location.href);
  }

  /**
   * Tests if url is localhost or 127.0.0.1
   * @param url The url
   * @returns Boolean value
   */
  public isUrlLocalHost(url: string): boolean {
    return url && (url.toLocaleLowerCase().includes("localhost") || url.includes("127.0.0.1"));
  }
}
