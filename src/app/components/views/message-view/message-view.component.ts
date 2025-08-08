import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MessageService } from "../../../services/message/message.service";
import { MessageViewActionsService } from "./message-view-actions.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { AViewComponent } from "../base/aview.component";

@Component({
  selector: "app-message-view",
  templateUrl: "./message-view.component.html",
  styleUrls: ["./message-view.component.css"],
})
/**
 * Message view component
 */
export class MessageViewComponent extends AViewComponent implements OnInit {
  public static viewType = "message-view";

  @ViewChild("viewContent", { static: false })
  public viewContent: ElementRef;

  public actionsService = new MessageViewActionsService(this);

  private messageService: MessageService;

  /**
   * Constructor
   * @param servicesService The ServicesService
   */
  constructor(public servicesService: ServicesService) {
    super(MessageViewComponent.viewType, servicesService);
    this.messageService = this.servicesService.getService(ServicesConst.MessageService) as MessageService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {}

  /**
   * Get the messages to be displayed
   * @returns The list of the messages
   */
  public getMessages() {
    // TODO this.scrollToBottom();
    return this.messageService.messages;
  }

  /**
   * Scroll the view to the bottom
   */
  public scrollToBottom() {
    try {
      this.viewContent.nativeElement.scrollTop = this.viewContent.nativeElement.scrollHeight;
    } catch (ex) {}
  }
}
