import { EventEmitter } from "@angular/core";

export class ErrorMessage {
  public static INFO_LEVEL = "Info";
  public static OK_LEVEL = "OK";
  public static WARNING_LEVEL = "Avertissement";
  public static ERROR_LEVEL = "Erreur";

  public type = "error-message";
  public label = "Erreur";

  constructor(
    public text = "",
    public level = ErrorMessage.WARNING_LEVEL,
    public errorId = "",
    public bo = null,
    public boId = null,
    public rule = null,
    public projectId = null,
    public project = null
  ) {}

  public setVersion(project: any) {
    this.project = project;
    this.projectId = project ? project.id : "";
  }

  public setObject(o: any) {
    this.bo = o;
    this.boId = o ? o.id : "";
  }
}

// export class ErrorMessageConstService {
// //TODO NU
//   public static INFRA_ERROR_01_ID = "INFRA-ERROR-01";
//   public static INFRA_OK_01_ID = "INFRA-OK-01";
//   public static N_DEF_01_ID = "N-DEF-01";
//   public static N_DEF_02_ID = "N-DEF-02";
//   public static NPARENT_CHECK_OK_ID = "N-ASSOC-01";
//   public static NPARENT_ERROR_ID = "N-ASSOC-02";
// }

// tslint:disable-next-line: max-classes-per-file
export class ErrorMessageFactoryService {
  constructor() {}

  public buildErrorMessage(errorId: string, params: any = null): ErrorMessage {
    let errorMessage = new ErrorMessage();
    errorMessage.errorId = errorId;

    if (params) {
      if (params.label) {
        errorMessage.label = params.label;
      }
      if (params.text) {
        errorMessage.text = params.text;
      }
      if (params.level) {
        errorMessage.level = params.level;
      }
      if (params.project) {
        errorMessage.setVersion(params.project);
      }
      if (params.bo) {
        errorMessage.setObject(params.bo);
      }
      if (params.rule) {
        errorMessage.rule = params.rule;
      }
    }

    return errorMessage;
  }
}

export interface IErrorMessageService {
  errorMessages: ErrorMessage[];
  errorMessageEvent: EventEmitter<any>;
  addErrorMessage(errorMessage: ErrorMessage);
  clear();
  clearMessagesLinkedToRule(rule: any);
}

// tslint:disable-next-line: max-classes-per-file
export class ErrorMessageService implements IErrorMessageService {
  public errorMessages: ErrorMessage[] = [];
  public errorMessageEvent = new EventEmitter<any>();

  constructor() {}

  public addErrorMessage(errorMessage: ErrorMessage) {
    errorMessage.level = errorMessage.level ? errorMessage.level : ErrorMessage.INFO_LEVEL;
    this.errorMessages.push(errorMessage);
    this.errorMessageEvent.emit(errorMessage);
  }

  public clear() {
    this.errorMessages = [];
  }

  public clearMessagesLinkedToRule(rule: any) {
    if (rule) {
      this.errorMessages = this.errorMessages.filter((m) => m.rule !== rule);
    }
  }
}
