import { AbstractCommand } from "./acommand";
import { ICommand } from "./icommand";

export class CallbackCommand extends AbstractCommand {
  constructor(
    label: string,
    protected executeCB: any = (command: ICommand) => false,
    protected undoCB: any = (command: ICommand) => {}
  ) {
    super(label);
  }

  public execute(): boolean {
    return this.executeCB(this);
  }

  public undo(): boolean {
    return this.undoCB(this);
  }
}
