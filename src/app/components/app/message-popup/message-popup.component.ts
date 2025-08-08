import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "../../../services/message/message.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { TranslateService } from "src/app/services/translate/translate.service";

/**
 * Component that displays a pop-up message
 */
@Component({
  selector: "app-message-popup",
  templateUrl: "./message-popup.component.html",
  styleUrls: ["./message-popup.component.css"],
})
export class MessagePopupComponent implements OnInit, OnDestroy {
  public message: string;
  private timeOut: any;
  private displayDelayMs = 3000;

  private messageEventSubscription: any;
  private messageService: MessageService;

  /**
   * Constructor
   * @param servicesService The services Service
   */
  constructor(public servicesService: ServicesService) {}

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.messageService = this.servicesService.getService(ServicesConst.MessageService) as MessageService;
    this.messageEventSubscription = this.messageService.messageEvent.subscribe((message: any) =>
      this.displayMessage(message.text)
    );
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    if (this.messageEventSubscription) {
      this.messageEventSubscription.unsubscribe();
    }
  }

  /**
   * Display a message
   * @param message The text message
   */
  private displayMessage(message: string) {
    this.message = message;
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => (this.message = null), this.displayDelayMs);
  }
}
