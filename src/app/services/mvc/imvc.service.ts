import { EventEmitter } from "@angular/core";

export interface IMvcService {
  mvcEvent: EventEmitter<any>;
  emit(mvcMessage: any);
  startLoader();
  stopLoader();
}
