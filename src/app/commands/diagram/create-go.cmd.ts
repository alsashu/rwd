import { IServicesService } from "src/app/services/services/iservices.service";
import { SelectionService } from "src/app/common/services/selection/selection.service";
import { AbstractCommand } from "../../common/services/command/commands/acommand";
import { DiagramService } from "src/app/modules/diagram/services/diagram/diagram.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesServiceSingleton } from "src/app/services/services/services-service.singleton";

export class CreateGOCommand extends AbstractCommand {
  protected servicesService: IServicesService;
  protected selectionService: SelectionService;

  public params: any = {};
  public diagramService: DiagramService;

  constructor() {
    super("Create graphical objects");
    this.servicesService = ServicesServiceSingleton.instance;
    this.selectionService = <SelectionService>this.servicesService.getService(ServicesConst.SelectionService);
  }

  // [{ svgObject: svgObject, parentSvgObject: parentSvgObject }]
  // {
  //   diagramService: DiagramService,
  //   svgObjects: svgObjects
  //   parentSvgObject: parentSvgObject
  //   parentAndSvgObjects: [{ svgObject: svgObject, parentSvgObject: parentSvgObject }]
  // }

  init(params: any): CreateGOCommand {
    this.params = params;
    this.diagramService = this.params.diagramService;
    return this;
  }

  execute(): boolean {
    if (this.params && this.diagramService) {
      if (this.params.parentAndSvgObjects) {
        this.params.parentAndSvgObjects.forEach((param) => {
          this.diagramService.addSvgObject(param.svgObject, param.parentSvgObject);
        });
      } else if (this.params.svgObjects) {
        this.params.svgObjects.forEach((svgObject) => {
          this.diagramService.addSvgObject(svgObject, this.params.parentSvgObject);
        });
      }
      return true;
    }
    return false;
  }

  undo() {
    if (this.params && this.diagramService) {
      this.params.forEach((param: any) => {
        this.diagramService.removeSvgObject(param.svgObject);
      });
    }
  }

  redo() {
    this.execute();
  }
}
