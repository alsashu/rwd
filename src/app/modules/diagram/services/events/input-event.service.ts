import { IDiagramService } from '../diagram/diagram.service';
import { EventEmitter } from '@angular/core';

export interface IInputEvent {
  type: string,
  simpleType: string,
  event: any,
  params: any,
}

export class InputEventService {
  public inputEventEmitter = new EventEmitter<IInputEvent>();

  constructor(
    public diagramService: IDiagramService,
  ) {
  }

  public emitInputEvent(inputEvent: IInputEvent) {
    this.inputEventEmitter.emit(inputEvent);
  }
}
