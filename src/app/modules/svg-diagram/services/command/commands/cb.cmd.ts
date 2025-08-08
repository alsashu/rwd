import { ISvgDiagramService } from "../../diagram/svg-diagram.service";
import { AbstractCommand } from "./acommand";

export class CBCommand extends AbstractCommand {
  public constructor(
    svgDiagramService: ISvgDiagramService,
    key: string,
    description: string,
    protected canExecuteCB: any = (): boolean => false,
    protected executeCB: any = (): boolean => false,
    protected undoCB: any = () => {}
  ) {
    super(svgDiagramService, key, description);
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
