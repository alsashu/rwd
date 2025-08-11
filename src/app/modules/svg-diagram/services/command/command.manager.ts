import { clone } from "lodash";
import { ICommand } from "./commands/icommand";
import { ICommandService } from "./command.service";
import { IncreaseZoomCommand } from "./commands/increase-zoom.cmd";
import { DecreaseZoomCommand } from "./commands/decrease-zoom.cmd";
import { ResetZoomCommand } from "./commands/reset-zoom.cmd";
import { IInputEvent } from "../events/input-event.service";
import { ISvgDiagramService } from "../diagram/svg-diagram.service";
import { SelectAllCommand } from "./commands/select-all.cmd";

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
  onDestroy();
  canExecute(key: string): boolean;
  execute(key: string): boolean;
  // handleInputEvent(diagramEvent: IInputEvent);
  addCommands(commands: ICommand[]);
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

  public constructor(public svgDiagramService: ISvgDiagramService) {
    this.commandService = this.svgDiagramService.commandService;
    this.initCommands();

    this.inputEventSubscription = this.svgDiagramService.inputEventService.inputEventEmitter.subscribe((e: any) =>
      this.handleInputEvent(e)
    );
  }

  public onDestroy() {
    this.inputEventSubscription.unsubscribe();
  }

  private initCommands() {
    this.addCommands([
      new IncreaseZoomCommand(this.svgDiagramService),
      new DecreaseZoomCommand(this.svgDiagramService),
      new ResetZoomCommand(this.svgDiagramService),
      // new AutoScrollCommand(this.svgDiagramService),

      new SelectAllCommand(this.svgDiagramService),

      // new UndoCommand(this.svgDiagramService),
      // new RedoCommand(this.svgDiagramService),

      // ["F2", "EditTextCommand"],
      // ["ContextMenu", "ShowContextMenuCommand"],
      // ["Esc", "StopCommand"],
    ]);
  }

  public addCommands(commands: ICommand[]) {
    commands.forEach((command) => this.commandMap.set(command.key, command));
  }

  public getCommand(key: string): ICommand {
    return this.commandMap.get(key);
  }

  public execute(key: string): boolean {
    const command: any = this.getCommand(key);
    if (command) {
      // delete command.svgDiagramService;
      const cloneCommand = clone(command);
      // cloneCommand.svgDiagramService = this.svgDiagramService;
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
