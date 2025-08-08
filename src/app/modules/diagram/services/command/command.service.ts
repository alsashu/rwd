import { ICommand } from "./commands/icommand";
import { CompositeCommand } from "./commands/composite.cmd";
import { IDiagramService } from "../diagram/diagram.service";

export interface ICommandService {
  diagramService: IDiagramService;

  execute(command: ICommand, options?: any): boolean;
  executeCommands(cmds: ICommand[], description?: string);

  canUndo(): boolean;
  undo();
  canRedo(): boolean;
  redo();
  canRepeat(): boolean;
  repeat();

  beginGroup(description: string);
  endGroup();
}

export class CommandService implements ICommandService {
  private commands: ICommand[] = [];
  private undoCommands: ICommand[] = [];

  private groupCommand: CompositeCommand;
  private groupCommands = [];

  constructor(public diagramService: IDiagramService) {}

  public execute(command: ICommand, executeOptions: any = null): boolean {
    let res = null;
    try {
      const options = this.calcOptions(command);
      console.log("Exécution commande", command.getDescription(), command, options);
      res = command.execute();
      if (res) {
        if (!this.groupCommand) {
          this.sendMessage(command.getDescription());
        }

        if (!options.doNotSave) {
          if (this.groupCommand) {
            this.groupCommand.commands.push(command);
          } else {
            this.commands.push(command);
          }
          this.undoCommands = [];
        }
      }
      if (!options.doNotNotify) {
        // this.emit({ type: this.mvcService.MSG_COMMAND_EXECUTE });
      }
    } catch (e) {
      console.log("execute Exception:", e);
    }
    return res;
  }

  public executeCommands(cmds: ICommand[], description: string = null) {
    if (cmds && cmds.length) {
      this.execute(new CompositeCommand(this.diagramService).init(cmds, description));
    }
  }

  public canUndo(): boolean {
    return this.commands.length > 0;
  }

  public undo() {
    try {
      if (this.canUndo()) {
        const command = this.commands.pop();
        const options = this.calcOptions(command);
        this.sendMessage("Annulation de la commande " + command.getDescription());
        command.undo();
        this.undoCommands.push(command);
        if (!options.doNotNotify) {
          // this.emit({ type: this.mvcService.MSG_COMMAND_UNDO });
        }
      }
    } catch (e) {
      console.log("execute Exception:", e);
      // this.sendMessage("Exception: " + e, this.messageService.EXCEPTION_LEVEL);
    }
  }

  public canRedo(): boolean {
    return this.undoCommands.length > 0;
  }

  public redo() {
    try {
      if (this.canRedo()) {
        const command = this.undoCommands.pop();
        const options = this.calcOptions(command);
        this.sendMessage("Rétablissement de la commande " + command.getDescription());
        command.redo();
        this.commands.push(command);
        if (!options.doNotNotify) {
          // this.emit({ type: this.mvcService.MSG_COMMAND_REDO });
        }
      }
    } catch (e) {
      console.log("execute Exception:", e);
      // this.sendMessage("Exception: " + e, this.messageService.EXCEPTION_LEVEL);
    }
  }

  public canRepeat(): boolean {
    return this.canUndo();
  }

  public repeat() {
    // TODO clone & execute
  }

  public beginGroup(description: string = null) {
    if (this.groupCommand) {
      this.groupCommands.push(this.groupCommand);
    }
    this.groupCommand = new CompositeCommand(this.diagramService).init([], description);
    this.sendMessage(this.groupCommand.getDescription());
  }

  public endGroup() {
    this.commands.push(this.groupCommand);
    this.groupCommand = this.groupCommands.pop();
    //    this.emit({ type: this.mvcService.MSG_COMMAND_EXECUTE });
  }

  private sendMessage(message: string) {
    // this.messageService.addTextMessage(message);
  }

  private emit(event: any) {
    // this.mvcService.emit(event);
  }

  private calcOptions(command: ICommand): any {
    const options = command.getOptions() || {};
    return options;
  }
}
