import { ModelConstService } from "src/app/services/model/model-const.service";
import { ModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { TracksidePhysicalArchitectureDiagramFactory } from "../factories/trackside-physical-arch-diagram-factory";
import { GraphicViewComponent } from "../graphic-view.component";
import { ISubTypeDiagramController } from "./idiagram-controller";

export class TracksidePhysicalArchitectureDiagramController implements ISubTypeDiagramController {
  private diagramFactory: TracksidePhysicalArchitectureDiagramFactory;

  constructor(private graphicViewComponent: GraphicViewComponent) {
    this.diagramFactory = new TracksidePhysicalArchitectureDiagramFactory(graphicViewComponent);
  }

  public initDiagram(diagram: any) {
    if (diagram.type === ModelConstService.VISUALIZATION_TYPE) {
      diagram.svgObject = this.diagramFactory.buildSvgObjectFromDiagram(diagram);
    }
  }

  public init() {}

  public testAndLazyLoadVisualization(project: any, diagram: any) {
    if (project && diagram) {
      const modelLoadSaveService = this.graphicViewComponent.servicesService.getService(
        ServicesConst.ModelLoadSaveService
      ) as ModelLoadSaveService;
      modelLoadSaveService.testAndLazyLoadVisualization(project, diagram);
    }
  }
}
