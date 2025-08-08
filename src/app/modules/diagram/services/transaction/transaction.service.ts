import { IDiagramService } from '../diagram/diagram.service';
import { ITransaction, Transaction } from './transaction';
import { IChangeEvent, ChangeEvent } from './change-event';
import { EventEmitter } from '@angular/core';

export interface ITransactionService {
  diagramService: IDiagramService;
  start(description?: string);
  commit();
  canUndo(): boolean;
  undo();
  canRedo(): boolean;
  redo();
  handleChangeEvent(event: any);
}

export class TransactionService implements ITransactionService  {
//  public changeEventEmitter = new EventEmitter<IChangeEvent>();

  private transaction: ITransaction;
  private transactionsStack: ITransaction[] = [];
  private transactions: ITransaction[] = [];
  private undoTransactions: ITransaction[] = [];

  constructor(
    public diagramService: IDiagramService,
  ) {
  }

  public start(description: string = null) {
    if (this.transaction) {
      this.transactionsStack.push(this.transaction);
    }
    this.transaction = new Transaction(description);
    this.emitTransactionChangeEvent(this.transaction, "StartedTransaction"); 
  }

  public commit() {
    if (this.transaction) {
      this.emitTransactionChangeEvent(this.transaction, "CommittingTransaction"); 
      if (this.transaction.canUndo()) {
        this.transactions.push(this.transaction);
        this.undoTransactions = [];
      }
      this.emitTransactionChangeEvent(this.transaction, "CommittedTransaction"); 
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
      this.emitTransactionChangeEvent(this.transaction, "StartingUndo"); 
      transaction.undo();
      this.emitTransactionChangeEvent(this.transaction, "FinishedUndo"); 
      this.undoTransactions.push(transaction);
    }
  }

  public canRedo(): boolean {
    return this.undoTransactions.length > 0;
  }

  public redo() {
    if (this.canRedo()) {
      let transaction = this.undoTransactions.pop();
      this.emitTransactionChangeEvent(this.transaction, "StartingRedo"); 
      transaction.redo();
      this.transactions.push(transaction);
      this.emitTransactionChangeEvent(this.transaction, "FinishedRedo"); 
    }
  }

  public handleChangeEvent(changeEvent: IChangeEvent) {
//    console.log(">> changeEvent", changeEvent);
    if (this.transaction) {
      this.transaction.handleChangeEvent(changeEvent);
    }
    this.emitChangeEvent(changeEvent);
  }

  public emitChangeEvent(changeEvent: IChangeEvent) {
    this.diagramService.changeEventEmitter.emit(changeEvent);
  }

  public emitTransactionChangeEvent(transaction: any, propertyName: string, newValue: any = null) {
    this.emitChangeEvent(new ChangeEvent({
      changeType: ChangeEvent.Transaction,
      object: transaction,
      propertyName: propertyName,
      newValue: newValue,
    }))
  }
}