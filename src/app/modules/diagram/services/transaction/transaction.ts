import { IChangeEvent } from "./change-event";

export interface ITransaction {
  changeEvents: IChangeEvent[];
  getDescription(): string;
  canUndo(): boolean;
  undo();
  redo();
  handleChangeEvent(event: IChangeEvent);
}

export class Transaction implements ITransaction {
  static idCtr = 0;
  public changeEvents: IChangeEvent[] = [];

  constructor(private description: string = null, private id = ++Transaction.idCtr) {}

  public getDescription(): string {
    return this.description ? this.description : "";
  }

  public handleChangeEvent(changeEvent: IChangeEvent) {
    this.changeEvents.push(changeEvent);
  }

  public undo() {
    for (let i = this.changeEvents.length - 1; i >= 0; i--) {
      this.changeEvents[i].undo();
    }
  }

  public redo() {
    this.changeEvents.forEach((event: any) => event.redo());
  }

  public canUndo(): boolean {
    return this.changeEvents.length > 0;
  }
}
