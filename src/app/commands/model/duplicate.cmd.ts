import { CompositeCommand } from "../../common/services/command/commands/composite.cmd";
import { CopyCommand } from "./copy.cmd";
import { PasteCommand } from "./paste.cmd";

export class DuplicateCommand extends CompositeCommand {
  constructor() {
    super([], "Duplicate");
    this.commands = [new CopyCommand(), new PasteCommand()];
  }
}
