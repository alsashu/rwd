import { EventEmitter } from "@angular/core";
import { ISvgDiagramService } from "../diagram/svg-diagram.service";

export interface IInputEvent {
  type: string;
  simpleType: string;
  event: any;
  params: any;
}

export class InputEventService {
  public inputEventEmitter = new EventEmitter<IInputEvent>();

  constructor(public svgDiagramService: ISvgDiagramService) {}

  public emitInputEvent(inputEvent: IInputEvent) {
    this.inputEventEmitter.emit(inputEvent);
  }
}
