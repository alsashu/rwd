import { IChangeEvent } from './change-event';

export interface ITransaction {
  getDescription(): string;
  begin();
  end();
  canUndo(): boolean;
  undo();
  redo();
  handleChangeEvent(event: IChangeEvent);
}

export class Transaction implements ITransaction {
  static idCtr = 0;
  private changeEvents: IChangeEvent[] = [];

  constructor(
    private description: string = null,
    private id = ++Transaction.idCtr,
  ) {
  }

  public getDescription(): string {
    return (this.description ? this.description  : "");
  }

  public begin() {
  }

  public end() {
  }

  public handleChangeEvent(changeEvent: IChangeEvent) {
    this.changeEvents.push(changeEvent);
  }

  public undo() {
    for(let i = this.changeEvents.length - 1; i >= 0; i--) {
      this.changeEvents[i].undo();
    }
  }

  public redo() {
    this.changeEvents.forEach(event => event.redo());
  }

  public canUndo(): boolean {
    return this.changeEvents.length > 0;
  }
}
