export interface IChangeEvent {
  changeType: string;
  object: any;
  propertyName: string;
  newValue: any;
  newParam: any;
  oldValue: any;
  oldParam: any;

  undo();
  redo();  
}

export class ChangeEvent implements IChangeEvent {
  public static Property: string = "Property";
  public static Insert: string = "Insert";
  public static Remove: string = "Remove";
  public static Transaction: string = "Transaction";

  public changeType: string;
  public object: any;
  public propertyName: string;
  public newValue: any;
  public newParam: any;
  public oldValue: any;
  public oldParam: any;

  constructor(params: any = null) {
    if (params) {
      for(let param in params) {
        this[param] = params[param];
      }
    }
  }

  public undo() {
    if (this.changeType == ChangeEvent.Property) {
//      console.log(">> undo", this, this.oldValue);
      if (this.oldValue == undefined) {
        delete this.object[this.propertyName];
      } else {
        this.object[this.propertyName] = this.oldValue;
      }
    }
    else if (this.changeType == ChangeEvent.Insert) {
      let list = (!this.propertyName && this.object.forEach ? this.object : this.object[this.propertyName]);
      list.splice(this.newParam.index, 1);
    }
    else if (this.changeType == ChangeEvent.Remove) {
      let list = (!this.propertyName && this.object.forEach ? this.object : this.object[this.propertyName]);
      list.splice(this.newParam.index, 0, this.newValue);
    }
  }

  public redo() {
    if (this.changeType == ChangeEvent.Property) {
      if (this.newValue == undefined) {
        delete this.object[this.propertyName];
      } else {      
        this.object[this.propertyName] = this.newValue;
      }
    }
    else if (this.changeType == ChangeEvent.Insert) {
      let list = (!this.propertyName && this.object.forEach ? this.object : this.object[this.propertyName]);
      list.splice(this.newParam.index, 0, this.newValue);
    }
    else if (this.changeType == ChangeEvent.Remove) {
      let list = (!this.propertyName && this.object.forEach ? this.object : this.object[this.propertyName]);
      list.splice(this.newParam.index, 1);
    }
  }
}
