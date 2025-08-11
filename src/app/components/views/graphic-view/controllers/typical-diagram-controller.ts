import { ModelConstService } from "src/app/services/model/model-const.service";
import { ModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { TypicalDiagramFactory } from "../factories/typical-diagram-factory";
import { GraphicViewComponent } from "../graphic-view.component";
import { ISubTypeDiagramController } from "./idiagram-controller";

export class TypicalDiagramController implements ISubTypeDiagramController {
  private diagramFactory: TypicalDiagramFactory;

  constructor(private graphicViewComponent: GraphicViewComponent) {
    this.diagramFactory = new TypicalDiagramFactory(graphicViewComponent);
  }

  public initDiagram(diagram: any) {
    if (diagram.type === ModelConstService.TYPICAL_ITF_DIAGRAM_TYPE) {
      diagram.svgObject = this.diagramFactory.buildSvgObjectFromDiagram(diagram);
    }
  }

  public init() {}

  public testAndLazyLoadVisualization(project: any, diagram: any) {
    if (project && diagram) {
      const modelLoadSaveService = this.graphicViewComponent.servicesService.getService(
        ServicesConst.ModelLoadSaveService
      ) as ModelLoadSaveService;
      modelLoadSaveService.testAndLazyLoadTypicalITFDiagram(project, diagram);
    }
  }
}
