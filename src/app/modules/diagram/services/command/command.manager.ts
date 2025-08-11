import { cloneDeep, clone } from "lodash";
import { ICommand } from "./commands/icommand";
import { IDiagramService } from "../diagram/diagram.service";
import { ICommandService } from "./command.service";
import { SelectAllCommand } from "./commands/select-all.cmd";
import { UndoCommand } from "./commands/undo.cmd";
import { RedoCommand } from "./commands/redo.cmd";
import { DeleteCommand } from "./commands/delete.cmd";
import { CutCommand } from "./commands/cut.cmd";
import { CopyCommand } from "./commands/copy.cmd";
import { PasteCommand } from "./commands/paste.cmd";
import { IncreaseZoomCommand } from "./commands/increase-zoom.cmd";
import { DecreaseZoomCommand } from "./commands/decrease-zoom.cmd";
import { ResetZoomCommand } from "./commands/reset-zoom.cmd";
import { IInputEvent } from "../events/input-event.service";
import { AutoScrollCommand } from "./commands/auto-scroll.cmd";

// Ctrl-X & Shift-Del invoke cutSelection
// Ctrl-C & Ctrl-Insert invoke copySelection
// Ctrl-V & Shift-Insert invoke pasteSelection
// Del & Backspace invoke deleteSelection
// Ctrl-A invokes selectAll
// Ctrl-Z & Alt-Backspace invoke undo
// Ctrl-Y & Alt-Shift-Backspace invoke redo
// Up & Down & Left & Right (arrow keys) call Diagram.scroll
// PageUp & PageDown call Diagram.scroll
// Home & End call Diagram.scroll
// Space invokes scrollToPart
// Ctrl-- & Keypad-- (minus) invoke decreaseZoom
// Ctrl-+ & Keypad-+ (plus) invoke increaseZoom
// Ctrl-0 invokes resetZoom
// Shift-Z invokes zoomToFit; repeat to return to the original scale and position
// Ctrl-G invokes groupSelection
// Ctrl-Shift-G invokes ungroupSelection
// F2 invokes editTextBlock
// Menu Key invokes showContextMenu
// Esc invokes stopCommand

export interface ICommandManager {
  canExecute(key: string): boolean;
  execute(key: string): boolean;
  handleInputEvent(diagramEvent: IInputEvent);
}

export class CommandManager implements ICommandManager {
  public commandService: ICommandService;
  private commandMap: Map<string, ICommand> = new Map();
  private shortCutsMap: Map<string, string> = new Map([
    ["Ctrl-X", "CutCommand"],
    ["Ctrl-C", "CopyCommand"],
    ["Ctrl-V", "PasteCommand"],
    ["Delete", "DeleteCommand"],

    ["Ctrl-A", "SelectAllCommand"],

    ["Ctrl-Z", "UndoCommand"],
    ["Ctrl-Y", "RedoCommand"],
    ["Alt-Backspace", "UndoCommand"],

    ["Ctrl--", "DecreaseZoomCommand"],
    ["Ctrl-+", "IncreaseZoomCommand"],
    ["Ctrl-0", "ResetZoomCommand"],
    ["Ctrl-Q", "AutoScrollCommand"],

    ["F2", "EditTextCommand"],

    ["ContextMenu", "ShowContextMenuCommand"],

    ["Esc", "StopCommand"],
  ]);

  public inputEventSubscription: any;

  public constructor(public diagramService: IDiagramService) {
    this.commandService = this.diagramService.commandService;
    this.initCommands();

    if (this.diagramService.diagramController) {
      this.inputEventSubscription = this.diagramService.inputEventService.inputEventEmitter.subscribe((e: any) =>
        this.handleInputEvent(e)
      );
    }
  }

  public onDestroy() {
    this.inputEventSubscription.unsubscribe();
    this.commandMap = new Map();
  }

  private initCommands() {
    this.addCommands([
      new CutCommand(this.diagramService),
      new CopyCommand(this.diagramService),
      new PasteCommand(this.diagramService),
      new DeleteCommand(this.diagramService),

      new SelectAllCommand(this.diagramService),

      new UndoCommand(this.diagramService),
      new RedoCommand(this.diagramService),

      new IncreaseZoomCommand(this.diagramService),
      new DecreaseZoomCommand(this.diagramService),
      new ResetZoomCommand(this.diagramService),
      new AutoScrollCommand(this.diagramService),

      // ["F2", "EditTextCommand"],
      // ["ContextMenu", "ShowContextMenuCommand"],
      // ["Esc", "StopCommand"],
    ]);
  }

  private addCommands(commands: ICommand[]) {
    commands.forEach((command) => this.commandMap.set(command.key, command));
  }

  public getCommand(key: string): ICommand {
    return this.commandMap.get(key);
  }

  public execute(key: string): boolean {
    const command: any = this.getCommand(key);
    if (command) {
      // delete command.diagramService;
      // const cloneCommand = cloneDeep(command);
      const cloneCommand = clone(command);
      // cloneCommand.diagramService = this.diagramService;
      return this.commandService.execute(cloneCommand);
    }
    return false;
  }

  public canExecute(key: string): boolean {
    const command = this.getCommand(key);
    if (command) {
      return command.canExecute();
    }
    return false;
  }

  public handleInputEvent(diagramEvent: IInputEvent) {
    if (diagramEvent.simpleType === "keyDown") {
      const event = diagramEvent.event;
      let key = event.key;
      if (key && key.length === 1) {
        key = key.toUpperCase();
      }
      if (event.ctrlKey) {
        key = "Ctrl-" + key;
      }
      if (event.altKey) {
        key = "Alt-" + key;
      }
      if (event.shiftKey) {
        key = "Shift-" + key;
      }
      const command = this.shortCutsMap.get(key);
      if (command) {
        this.execute(command);
        event.preventDefault();
      }
    }
  }
}
