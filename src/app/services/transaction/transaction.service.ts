import { ITransaction, Transaction } from "./transaction";
import { EventEmitter } from "@angular/core";
import { IChangeEvent, ChangeEvent } from "./change-event";

export interface ITransactionService {
  begin(description?: string);
  end();
  canUndo(): boolean;
  undo();
  canRedo(): boolean;
  redo();
  handleChangeEvent(event: any);
}

export class TransactionService implements ITransactionService {
  public changeEventEmitter = new EventEmitter<IChangeEvent>();

  private transaction: ITransaction;
  private transactionsStack: ITransaction[] = [];
  private transactions: ITransaction[] = [];
  private undoTransactions: ITransaction[] = [];

  constructor() {}

  public begin(description: string = null): ITransaction {
    if (this.transaction) {
      this.transactionsStack.push(this.transaction);
    }
    this.transaction = new Transaction(description);
    this.transaction.begin();
    this.emitTransactionChangeEvent(this.transaction, "begin");
    return this.transaction;
  }

  public end() {
    if (this.transaction) {
      this.transaction.end();
      this.emitTransactionChangeEvent(this.transaction, "end");

      if (this.transaction.canUndo()) {
        this.transactions.push(this.transaction);
        this.undoTransactions = [];
      }
    }
    if (this.transactionsStack.length) {
      this.transaction = this.transactionsStack.pop();
    }
  }

  public canUndo(): boolean {
    return this.transactions.length > 0;
  }

  public undo() {
    if (this.canUndo()) {
      let transaction = this.transactions.pop();
      transaction.undo();
      this.emitTransactionChangeEvent(this.transaction, "undo");
      this.undoTransactions.push(transaction);
      console.log(">> undo", this);
    }
  }

  public canRedo(): boolean {
    return this.undoTransactions.length > 0;
  }

  public redo() {
    if (this.canRedo()) {
      let transaction = this.undoTransactions.pop();
      transaction.redo();
      this.emitTransactionChangeEvent(this.transaction, "redo");
      this.transactions.push(transaction);
      console.log(">> redo", this);
    }
  }

  public handleChangeEvent(changeEvent: IChangeEvent) {
    if (this.transaction) {
      this.transaction.handleChangeEvent(changeEvent);
    }
    this.emitChangeEvent(changeEvent);
  }

  public emitChangeEvent(changeEvent: IChangeEvent) {
    console.log(">> changeEvent", changeEvent.changeType, changeEvent);
    this.changeEventEmitter.emit(changeEvent);
  }

  public emitTransactionChangeEvent(transaction: any, propertyName: string, newValue: any = null) {
    this.emitChangeEvent(
      new ChangeEvent({
        changeType: ChangeEvent.Transaction,
        object: transaction,
        propertyName: propertyName,
        newValue: newValue,
      })
    );
  }
}
