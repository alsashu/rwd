import { ModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { SvgViewComponent } from "../svg-view.component";
import { ASubTypeSvgDiagramController } from "./asvg-diagram-controller";

/**
 * Controller for OnBoard Physical Architecture Svg Diagrams
 */
export class OnBoardPhysicalArchitectureSvgDiagramController extends ASubTypeSvgDiagramController {
  /**
   * Constructor
   * @param svgViewComponent The svg view component
   */
  constructor(protected svgViewComponent: SvgViewComponent) {
    super(svgViewComponent);
  }

  /**
   * Test if diagram not loaded and load it if not
   * @param project The project
   * @param diagram The diagram
   */
  public testAndLazyLoadVisualization(project: any, diagram: any) {
    if (project && diagram) {
      const modelLoadSaveService = this.svgViewComponent.servicesService.getService(
        ServicesConst.ModelLoadSaveService
      ) as ModelLoadSaveService;
      const svgFileName = diagram.svgFileName || diagram.id + ".svg";
      modelLoadSaveService.testAndLoadSvgDiagram(project, diagram, svgFileName, (loadedData: any) => {
        this.svgViewComponent.onSvgDataLoaded(loadedData, project);
      });
    }
  }
}
