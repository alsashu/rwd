import { AbstractCommand } from "./acommand";
import { IDiagramService } from "../../diagram/diagram.service";

export class CBCommand extends AbstractCommand {
  public constructor(
    diagramService: IDiagramService,
    key: string,
    description: string,
    protected canExecuteCB: any = () => false,
    protected executeCB: any = () => false,
    protected undoCB: any = () => {}
  ) {
    super(diagramService, key, description);
  }

  public canExecute(): boolean {
    return this.canExecuteCB();
  }

  public execute(): boolean {
    return this.executeCB();
  }

  public undo(): boolean {
    return this.undoCB();
  }
}
