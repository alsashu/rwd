import { IDiagramService } from '../diagram/diagram.service';
import { EventEmitter } from '@angular/core';

export interface INotificationService {
}

export class NotificationService implements INotificationService {
  public diagramEvent = new EventEmitter<any>();

  constructor(
    public diagramService: IDiagramService,
  ) {
  }

  public fireEvent(event) {
    this.diagramEvent.emit(event);
  }
}