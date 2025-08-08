import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { ServicesService } from "./services/services/services.service";
import { ServicesFactory } from "./services/services/services.factory";
import { ITranslateService } from "./services/translate/translate.service";
import { ServicesConst } from "./services/services/services.const";
import { IMessageService } from "./services/message/message.service";
import { IAppConfigService } from "./services/app/app-config.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
/**
 * App Component
 */
export class AppComponent implements OnInit, OnDestroy {
  private translateService: ITranslateService;
  private messageService: IMessageService;
  public appConfigService: IAppConfigService;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(private servicesService: ServicesService) {
    this.buildServices();
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.messageService = this.servicesService.getService(ServicesConst.MessageService) as IMessageService;
    this.appConfigService = this.servicesService.getService(ServicesConst.AppConfigService) as IAppConfigService;
  }

  /**
   * Component init
   */
  public ngOnInit() {
    this.messageService.addTextMessage(
      this.translateService.translateFromMap("Welcome to the RIGHT VIEWER") + " " + this.appConfigService.getVersion()
    );
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {}

  /**
   * Build the services
   */
  private buildServices() {
    new ServicesFactory().buildServices(this.servicesService);
    this.servicesService.initServices();
  }

  /**
   * Disable html page zoom events
   * @param event Event
   */
  @HostListener("wheel", ["$event"])
  public wheelEvent(event: any) {
    if (event.ctrlKey || event.altKey) {
      event.preventDefault();
    }
  }

  /**
   * Remove default context menu
   * @param event Event
   * @returns False
   */
  @HostListener("contextmenu", ["$event"])
  public contextMenuEvent(event: any): boolean {
    event.preventDefault();
    return false;
  }

  /**
   * Ask confirmation if closing tab
   * @param event: any
   */
  @HostListener("window:beforeunload", ["$event"])
  public unload(event: any) {
    // TODO ask for saving modificationsif any
    // const msg = this.translateService.translateFromMap("refresh.confirm.message");
    // return confirm(msg);
  }
}
