import { ModelConstService } from "src/app/services/model/model-const.service";
import { ModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { LogicalInterfaceDiagramFactory } from "../factories/logical-interface-diagram-factory";
import { GraphicViewComponent } from "../graphic-view.component";
import { ISubTypeDiagramController } from "./idiagram-controller";

// TODO add page N to diagram title + isthis page

export class LogicalInterfaceDiagramController implements ISubTypeDiagramController {
  private diagramFactory: LogicalInterfaceDiagramFactory;
  private page = "1";

  constructor(private graphicViewComponent: GraphicViewComponent) {
    if (graphicViewComponent && graphicViewComponent.config && graphicViewComponent.config.page) {
      this.page = graphicViewComponent.config.page;
    }
    this.diagramFactory = new LogicalInterfaceDiagramFactory(graphicViewComponent, this.page);

    graphicViewComponent.getViewTitleCB = () => {
      const translateService = this.graphicViewComponent.translateService;
      let title = translateService.translateFromMap("LogicalInterface");
      if (this.page) {
        title += "-" + translateService.translateFromMap("Page") + " " + this.page;
      }
      return title;
    };
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
