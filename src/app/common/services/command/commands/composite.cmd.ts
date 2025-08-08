import { AbstractCommand } from "./acommand";
import { ICommand } from "./icommand";

export class CompositeCommand extends AbstractCommand {
  constructor(public commands: ICommand[] = [], description: string = null) {
    super(description);
  }

  public getDescription(): string {
    let description = this.description;
    if (!description && this.commands && this.commands.forEach && this.commands.length) {
      description = this.commands[0].getDescription();
    }
    return description;
  }

  public execute(): boolean {
    let res = false;
    this.commands.forEach((command) => {
      let cmdRes = command.execute();
      res = res || cmdRes;
    });
    return res;
  }

  public undo() {
    let i = this.commands.length;
    while (i--) {
      this.commands[i].undo();
    }
  }

  public redo() {
    this.execute();
  }
}
