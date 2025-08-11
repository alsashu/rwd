import { EventEmitter } from "@angular/core";
import { ICommandEvent } from "src/app/common/services/command/command.service";
import { ICommand } from "src/app/common/services/command/commands/icommand";
import { IMvcService } from "../mvc/imvc.service";
import { MvcConst } from "../mvc/mvc.const";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ITranslateService } from "../translate/translate.service";

export interface IMessageService {
  addMessage(message: any);
  addTextMessage(text: string, level?: string);
  addExceptionMessage(e: any);
  clear();
}

export class MessageService implements IMessageService {
  public static INFO_LEVEL = "Info";
  public static WARNING_LEVEL = "Avertissement";
  public static ERROR_LEVEL = "Erreur";
  public static EXCEPTION_LEVEL = "Exception";
  public static OK_LEVEL = "OK";

  public messageEvent = new EventEmitter<any>();
  public messages: any[] = [];

  private mvcEventSubscription: any;

  private mvcService: IMvcService;
  private translateService: ITranslateService;

  constructor(private servicesService: IServicesService) {}

  public initService() {
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
    this.initMessageAggregator();
  }

  private initMessageAggregator() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if ([MvcConst.MSG_COMMAND_EXECUTE].includes(message.type)) {
        const commandEvent: ICommandEvent = message.event;
        const command: ICommand = commandEvent ? commandEvent.command : null;
        if (command) {
          const commandMessage = command.getDescription();
          if (commandMessage) {
            this.addTextMessage(this.translateService.translateFromMap(commandMessage));
          }
        }
      }
    });
  }

  public addMessage(message: any) {
    message.date = new Date(Date.now());
    message.level = message.level ? message.level : MessageService.INFO_LEVEL;
    this.messages.push(message);
    this.messageEvent.emit(message);
  }

  public addTextMessage(text: string, level: string = null) {
    this.addMessage({ text, level: level ? level : MessageService.INFO_LEVEL });
  }

  public addExceptionMessage(e: any) {
    this.addMessage({ text: e.toString(), level: MessageService.EXCEPTION_LEVEL });
  }

  public clear() {
    this.messages = [];
  }
}
