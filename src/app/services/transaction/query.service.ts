import { cloneDeep } from "lodash";
import { ChangeEvent } from "./change-event";
import { ITransaction } from "./transaction";
import { TransactionService } from "./transaction.service";

export class QueryService {
  constructor(public transactionService: TransactionService) {}

  public commit(cb: any, description: string = null): ITransaction {
    let res: ITransaction = null;
    if (cb) {
      res = this.transactionService.begin(description);
      cb(this);
      this.transactionService.end();
    }
    return res;
  }

  public modify(object: any, propertyName: string, value: any): any {
    if (
      object &&
      propertyName && //value != undefined &&
      (object[propertyName] == undefined || object[propertyName] != value)
    ) {
      let oldValue = object[propertyName] != undefined ? cloneDeep(object[propertyName]) : undefined;
      // console.log(">> modify", object, propertyName, value, oldValue);
      object[propertyName] = value;
      this.transactionService.handleChangeEvent(
        new ChangeEvent({
          changeType: ChangeEvent.Property,
          object: object,
          propertyName: propertyName,
          newValue: value,
          oldValue: oldValue,
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
      let list = !propertyName && parent.forEach ? parent : parent[propertyName];
      list.push(object);

      this.transactionService.handleChangeEvent(
        new ChangeEvent({
          changeType: ChangeEvent.Insert,
          object: parent,
          propertyName: propertyName,
          newValue: object,
          newParam: { index: list.length - 1 },
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
      let list = !propertyName && parent.forEach ? parent : parent[propertyName];
      let index = list.indexOf(object);
      if (index > -1) {
        list.splice(index, 1);
      }
      this.transactionService.handleChangeEvent(
        new ChangeEvent({
          changeType: ChangeEvent.Remove,
          object: parent,
          propertyName: propertyName,
          newValue: object,
          newParam: { index: index },
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
