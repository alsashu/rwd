import { AbstractCommand } from "src/app/common/services/command/commands/acommand";
import { QueryService } from "../services/transaction/query.service";
import { ServicesConst } from "../services/services/services.const";
import { TransactionService } from "../services/transaction/transaction.service";
import { ITransaction } from "../services/transaction/transaction";

export class TransactionCommand extends AbstractCommand {
  private executeCB = (qs: QueryService) => false;
  private queryService: QueryService;
  private transactionService: TransactionService;
  public transaction: ITransaction;

  constructor(description: string, executeCB = null) {
    super(description);
    this.executeCB = executeCB;
    this.queryService = <QueryService>this.servicesService.getService(ServicesConst.QueryService);
    this.transactionService = <TransactionService>this.servicesService.getService(ServicesConst.TransactionService);
  }

  public execute(): boolean {
    let res = false;
    this.queryService.commit((qs: QueryService) => {
      if (this.executeCB) {
        res = this.executeCB(qs);
      } else {
        res = this.doExecute(qs);
      }
    }, this.description);
    return res;
  }

  public doExecute(qs: QueryService): boolean {
    return false;
  }

  public undo() {
    this.transactionService.undo();
  }

  public redo() {
    this.transactionService.redo();
  }
}
