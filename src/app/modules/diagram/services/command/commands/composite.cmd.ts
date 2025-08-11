import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class CompositeCommand extends AbstractCommand {
  public commands: any[] = [];

  public constructor(diagramService: IDiagramService, description: string = null) {
    super(diagramService, "CompositeCommand", description);
  }

  public init(commands: any[], description: string = null): CompositeCommand {
    this.commands = commands;
    this.description = description;
    return this;
  }

  public getDescription(): string {
    let description = this.description;
    if (!description && this.commands && this.commands.length) {
      description = this.commands[0].getDescription();
    }
    return description;
  }

  public canExecute(): boolean {
    return true;
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
