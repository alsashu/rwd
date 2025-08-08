// import { Injectable } from '@angular/core';

//import { ServicesService } from '../../services/services/services.service';
//import { DeleteCommand } from '../../commands/delete.cmd';

export interface ICommandFactoryService {
  buildCommandFromType(type);
//  buildDeleteCommand();
}

// @Injectable({
//   providedIn: 'root'
// })
export class CommandFactoryService implements ICommandFactoryService {
//  servicesService = null;

  constructor(
  ) { }

  buildCommandFromType(type) {
//    if (type == "DeleteCommand") { return this.buildDeleteCommand(); }
    return null;
  }
/*
  buildDeleteCommand() {
    return new DeleteCommand();
  }
*/
}
