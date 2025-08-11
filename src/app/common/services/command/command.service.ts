import { ICommand } from "./commands/icommand";
import { CompositeCommand } from "./commands/composite.cmd";
import { EventEmitter } from "events";

export interface ICommandService {
  eventEmitter: any;

  execute(command: ICommand, options?: any);
  executeCommands(cmds: ICommand[], label: string);

  beginGroup(description: string);
  endGroup();

  canUndo(): boolean;
  undo();
  canRedo(): boolean;
  redo();

  emitAfterExecuteCommand(command: ICommand, res: boolean);
}

export interface ICommandEvent {
  eventType: string;
  command: any;
  commandService: ICommandService;
  res?: boolean;
  ex?: string | undefined;
}

export class CommandEventConst {
  public static CommandExecuteEndGroup = "CommandExecuteEndGroup";
  public static BeforeCommandExecute = "BeforeCommandExecute";
  public static AfterCommandExecute = "AfterCommandExecute";
  public static CommandExecuteException = "CommandExecuteException";
  public static BeforeCommandUndo = "BeforeCommandUndo";
  public static AfterCommandUndo = "AfterCommandUndo";
  public static CommandUndoException = "CommandUndoException";
  public static BeforeCommandRedo = "BeforeCommandRedo";
  public static AfterCommandRedo = "AfterCommandRedo";
  public static CommandRedoException = "CommandRedoException";

  public static CommandExecuteUndoOrRedo = [
    CommandEventConst.AfterCommandExecute,
    CommandEventConst.AfterCommandUndo,
    CommandEventConst.AfterCommandRedo,
  ];
}

// tslint:disable-next-line: max-classes-per-file
export class CommandService implements ICommandService {
  private commands: ICommand[] = [];
  private undoCommands: ICommand[] = [];

  private groupCommand: CompositeCommand;
  private groupCommands = [];

  public eventEmitter = new EventEmitter();

  constructor() {}

  public execute(command: ICommand, cmdOptions: any = null) {
    try {
      const options = this.calcOptions(command);
      console.log("Command execution", command.getDescription(), command, options);
      if (!options.doNotNotify) {
        this.emitEvent({ eventType: CommandEventConst.BeforeCommandExecute, command, commandService: this });
      }
      const res = command.execute();

      if (res) {
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
        this.emitAfterExecuteCommand(command, res);
        // this.emitEvent({
        //   eventType: CommandEventConst.AfterCommandExecute,
        //   command,
        //   res,
        //   commandService: this,
        // });
      }
    } catch (e) {
      console.log("execute Exception:", e);
      this.emitEvent({
        eventType: CommandEventConst.CommandExecuteException,
        command,
        ex: e,
        commandService: this,
      });
    }
  }

  public emitAfterExecuteCommand(command: ICommand, res: boolean) {
    this.emitEvent({
      eventType: CommandEventConst.AfterCommandExecute,
      command,
      res,
      commandService: this,
    });
  }

  public executeCommands(cmds: ICommand[], label: string) {
    if (cmds && cmds.length) {
      this.execute(new CompositeCommand(cmds, label));
    }
  }

  public beginGroup(description: string = null) {
    if (this.groupCommand) {
      this.groupCommands.push(this.groupCommand);
    }
    this.groupCommand = new CompositeCommand([], description);
  }

  public endGroup() {
    this.emitEvent({
      eventType: CommandEventConst.CommandExecuteEndGroup,
      command: this.groupCommand,
      commandService: this,
    });
    this.commands.push(this.groupCommand);
    this.groupCommand = this.groupCommands.pop();
  }

  public canUndo(): boolean {
    return this.commands.length > 0;
  }

  public undo() {
    let command: ICommand = null;
    try {
      if (this.canUndo()) {
        command = this.commands.pop();
        const options = this.calcOptions(command);
        if (!options.doNotNotify) {
          this.emitEvent({ eventType: CommandEventConst.BeforeCommandUndo, command, commandService: this });
        }
        command.undo();
        this.undoCommands.push(command);
        if (!options.doNotNotify) {
          this.emitEvent({ eventType: CommandEventConst.AfterCommandUndo, command, commandService: this });
        }
      }
    } catch (e) {
      console.log("execute Exception:", e);
      this.emitEvent({
        eventType: CommandEventConst.CommandUndoException,
        command,
        ex: e,
        commandService: this,
      });
    }
  }

  public canRedo(): boolean {
    return this.undoCommands.length > 0;
  }

  public redo() {
    let command: ICommand = null;
    try {
      if (this.canRedo()) {
        command = this.undoCommands.pop();
        const options = this.calcOptions(command);
        if (!options.doNotNotify) {
          this.emitEvent({ eventType: CommandEventConst.BeforeCommandRedo, command, commandService: this });
        }
        command.redo();
        this.commands.push(command);
        if (!options.doNotNotify) {
          this.emitEvent({ eventType: CommandEventConst.AfterCommandRedo, command, commandService: this });
        }
      }
    } catch (e) {
      console.log("execute Exception:", e);
      this.emitEvent({
        eventType: CommandEventConst.CommandRedoException,
        command,
        commandService: this,
        ex: e,
      });
    }
  }

  private calcOptions(command: ICommand): any {
    const options = command.getOptions() || {};
    return options;
  }

  public emitEvent(commandEvent: ICommandEvent) {
    console.log(">> emitEvent", commandEvent.eventType, commandEvent);
    this.eventEmitter.emit("event", commandEvent);
  }
}
