import { cloneDeep } from "lodash";
import { ChangeEvent } from "./change-event";
import { ITransactionService } from "./transaction.service";

export class QueryService {
  constructor(public transactionService: ITransactionService) {}

  public commit(cb: any, description: string = null) {
    if (cb) {
      this.transactionService.start(description);
      cb(this);
      this.transactionService.commit();
    }
  }

  public modify(object: any, propertyName: string, value: any): any {
    //    console.log(">> modify", object, propertyName, value, object[propertyName]);

    if (
      object &&
      propertyName && // value != undefined &&
      (object[propertyName] === undefined || object[propertyName] !== value)
    ) {
      const oldValue = object[propertyName] === undefined ? undefined : cloneDeep(object[propertyName]);
      //      console.log(">> modify", object, propertyName, value, oldValue);
      object[propertyName] = value;
      this.transactionService.handleChangeEvent(
        new ChangeEvent({
          changeType: ChangeEvent.Property,
          object,
          propertyName,
          newValue: value,
          oldValue,
        })
      );
    }
    return object;
  }

  public add(parent: any, propertyName: string, object: any): any {
    if (
      object &&
      parent &&
      ((propertyName && parent[propertyName] && parent[propertyName].forEach) || parent.forEach)
    ) {
      const list = !propertyName && parent.forEach ? parent : parent[propertyName];
      list.push(object);

      this.transactionService.handleChangeEvent(
        new ChangeEvent({
          changeType: ChangeEvent.Insert,
          object: parent,
          propertyName,
          newValue: object,
          newParam: { index: parent[propertyName].length - 1 },
        })
      );
    }
    return object;
  }

  public remove(parent: any, propertyName: string, object: any): any {
    if (
      object &&
      propertyName &&
      ((propertyName && parent[propertyName] && parent[propertyName].forEach) || parent.forEach)
    ) {
      const list = !propertyName && parent.forEach ? parent : parent[propertyName];
      const index = list.indexOf(object);
      if (index > -1) {
        list.splice(index, 1);
      }
      this.transactionService.handleChangeEvent(
        new ChangeEvent({
          changeType: ChangeEvent.Remove,
          object: parent,
          propertyName,
          newValue: object,
          newParam: { index },
        })
      );
    }
    return object;
  }

  public modifyCollection(objects: any, propertyName: string, value: any): any[] {
    objects.forEach((object: any) => this.modify(object, propertyName, value));
    return objects;
  }

  public addCollection(parent: any, propertyName: string, objects: any): any[] {
    objects.forEach((object: any) => this.add(parent, propertyName, object));
    return objects;
  }

  public removeCollection(parent: any, propertyName: string, objects: any): any[] {
    objects.forEach((object: any) => this.remove(parent, propertyName, object));
    return objects;
  }
}
