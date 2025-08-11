import { ICommand } from "./icommand";
import { ISvgDiagramService } from "../../diagram/svg-diagram.service";

export abstract class AbstractCommand implements ICommand {
  public constructor(
    public svgDiagramService: ISvgDiagramService,
    public key: string,
    protected description: string = null
  ) {}

  public getDescription(): string {
    return this.description;
  }

  public getOptions() {
    return null;
  }

  public canExecute(): boolean {
    return true;
  }

  abstract execute(): boolean;

  public undo() {}

  public redo() {
    this.execute();
  }
}
