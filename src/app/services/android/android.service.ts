import { Router } from "@angular/router";
import { IInjectableUtilsService } from "../injectable/injectable-utils.service";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { environment } from "src/environments/environment";

/**
 * Returns window object
 * @returns
 */
function _window(): any {
  return window;
}

/**
 * Interface of android service
 */
export interface IAndroidService {
  // options: {
  //   isMobileStyle: boolean;
  // };
  // toggleMobileStyle();

  isAndroidApp(): boolean;
  cordova(): any;
  openMobileBrowser(url: string);
}

/**
 * Android service managing specific android functionalities
 */
export class AndroidService implements IAndroidService {
  private router: Router;
  private injectableUtilsService: IInjectableUtilsService;

  /**
   * Constructor
   * @param servicesService Ther services service
   */
  constructor(public servicesService: IServicesService) {}

  /**
   * Init service
   * @returns
   */
  public initService() {
    if (!this.cordova) {
      return;
    }
    this.injectableUtilsService = this.servicesService.getService(
      ServicesConst.InjectableUtilsService
    ) as IInjectableUtilsService;
    this.router = this.injectableUtilsService.router;
    this.handleAndroidSSORedirection();
  }

  /**
   * Is tablet environnement
   * @returns
   */
  public isAndroidApp(): boolean {
    return environment.cordova || environment.debugCordova;
  }

  /**
   * Get cordova object
   */
  get cordova(): any {
    return _window().cordova;
  }

  /**
   * Open Mobile browser
   * @param url The url
   */
  public openMobileBrowser(url: string) {
    const cordova: any = this.cordova;
    if (cordova && cordova.InAppBrowser) {
      cordova.InAppBrowser.open(url, "_system", "location=yes,hidden=no");
    }
  }

  /**
   * Handle sso redirection
   */
  private handleAndroidSSORedirection() {
    _window().handleOpenURL = (url: any) => {
      let theUrl = new URL(url);
      const code = theUrl.searchParams.get("code");
      if (code) {
        this.router.navigate(["user-info"], { queryParams: { code } });
      } else {
        this.router.navigate([""]);
      }
    };
  }

  // public static localStorageName = "right-viewer-tablet-service-options";
  // public options = {
  //   isMobileStyle: true,
  // };

  // /**
  //  * Init mobile style
  //  */
  // public initMobileStyle() {
  //   if (localStorage.getItem(AndroidService.localStorageName)) {
  //     const lsData = JSON.parse(localStorage.getItem(AndroidService.localStorageName));
  //     this.options = lsData;
  //   } else {
  //     this.resetConfig();
  //   }
  //   this.applyMobileStyle();
  // }

  // /**
  //  * Reset config
  //  */
  // public resetConfig() {
  //   this.options.isMobileStyle = false;
  //   localStorage.removeItem(AndroidService.localStorageName);
  // }

  // /**
  //  * Save to local storage
  //  */
  // public saveToLocalStorage() {
  //   const lsData = this.options;
  //   localStorage.setItem(AndroidService.localStorageName, JSON.stringify(lsData));
  // }

  // /**
  //  * Toggle mobile style
  //  */
  // public toggleMobileStyle() {
  //   this.options.isMobileStyle = !this.options.isMobileStyle;
  //   this.applyMobileStyle();
  //   this.saveToLocalStorage();
  // }

  // /**
  //  * Apply mobile style or web style
  //  */
  // public applyMobileStyle() {
  //   const style = document.querySelector("body").style;
  //   if (this.options.isMobileStyle) {
  //     style.setProperty("--font-size", "1.1em");
  //     style.setProperty("--tool-bar-font-size", "1.2em");
  //     style.setProperty("--view-content-height-minus", "12px");
  //   } else {
  //     style.setProperty("--font-size", "0.9em");
  //     style.setProperty("--tool-bar-font-size", "1.0em");
  //     style.setProperty("--view-content-height-minus", "2px");
  //   }
  // }
}
