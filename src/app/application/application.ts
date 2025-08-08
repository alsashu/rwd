import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ServicesFactory } from "../services/services/services.factory";
import { ServicesService } from "../services/services/services.service";
import { AApplication, ApplicationSingleton, IBasicApplication } from "./basic-application";

// tslint:disable-next-line: no-empty-interface
export interface IApplication extends IBasicApplication {}

@Injectable({
  providedIn: "root",
})
/**
 * Main application
 */
export class Application extends AApplication implements IApplication {
  /**
   * Constructor
   * @param httpClient
   * @param ngxService
   * @param modalService
   * @param sanitizer
   */
  constructor(
    public servicesService: ServicesService,
    public httpClient: HttpClient,
    public ngxService: NgxUiLoaderService,
    public modalService: NgbModal,
    public sanitizer: DomSanitizer
  ) {
    super();
    ApplicationSingleton.instance = this;
  }

  /**
   * Init the application
   */
  public init() {
    this.buildServices();
  }

  /**
   * Build the services
   */
  private buildServices() {
    new ServicesFactory().buildServices(this.servicesService);
    this.servicesService.initServices();
  }

  /**
   * Build the services
   */
  private buildOffLineServicesForTest() {
    new ServicesFactory().buildOffLineServicesForTest(this.servicesService);
    this.servicesService.initServices();
  }
}
