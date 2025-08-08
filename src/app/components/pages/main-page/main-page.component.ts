import { Component, OnInit, HostListener } from "@angular/core";
import { ServicesService } from "../../../services/services/services.service";
import { ServicesConst } from "../../../services/services/services.const";
import { Router } from "@angular/router";
import { IModelService } from "src/app/services/model/model.service";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { IRightsService } from "src/app/services/rights/rights.service";
import { ISessionService, SessionService } from "src/app/services/session/session.service";
import { IViewService } from "src/app/services/view/view.service";
import { IWebsocketService } from "src/app/services/websocket/websocket.service";
import { IMvcService } from "src/app/services/mvc/imvc.service";

/**
 * Main page component
 */
@Component({
  selector: "app-root",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"],
})
export class MainPageComponent implements OnInit {
  private mvcService: IMvcService;
  private modelService: IModelService;
  private sessionService: ISessionService;
  private rightsService: IRightsService;
  private webSocketService: IWebsocketService;
  private viewService: IViewService;

  /**
   * Constructor
   * @param servicesService The services Service
   * @param router The router
   */
  constructor(private servicesService: ServicesService, private router: Router) {
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.sessionService = this.servicesService.getService(ServicesConst.SessionService) as ISessionService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as IRightsService;
    this.webSocketService = this.servicesService.getService(ServicesConst.WebsocketService) as IWebsocketService;
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    if (sessionStorage.getItem(SessionService.sessionVar.authorizationKey) === "null") {
      this.sessionService.goToLoginPage();
    }

    this.mvcService.emit({ type: MvcConst.MSG_MODEL_CHANGED });
    this.sessionService.initCountdown();

    this.webSocketService.eventEmitter.subscribe((wsMessage: any) => {
      if (wsMessage.status === "connected") {
        this.initOnServerConnection();
      }
    });
    if (this.webSocketService.isConnected) {
      this.initOnServerConnection();
    } else {
      this.initOffline();
    }
  }

  /**
   * Init main page on server connection
   */
  private initOnServerConnection() {
    this.rightsService.initRights();
    this.viewService.initViews();
    this.modelService.initModel();
  }

  /**
   * Init main page on server connection
   */
  private initOffline() {
    this.rightsService.initRights();
    this.viewService.initViews();
    this.modelService.initModel();
  }

  /**
   * Wheel event prevent defaulkt
   * @param event The event
   */
  @HostListener("wheel", ["$event"])
  public wheelEvent(event: any) {
    if (event.ctrlKey || event.altKey) {
      event.preventDefault();
    }
  }

  /**
   * Context menu event prevent defaulkt
   * @param event The event
   * @returns false
   */
  @HostListener("contextmenu", ["$event"])
  public contextMenuEvent(event: any): boolean {
    event.preventDefault();
    return false;
  }
}
