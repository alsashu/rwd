import { ModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { SvgViewComponent } from "../svg-view.component";
import { ASubTypeSvgDiagramController } from "./asvg-diagram-controller";

/**
 * Controller for Wiring Svg Diagrams
 */
export class WiringSvgDiagramController extends ASubTypeSvgDiagramController {
  private diagramVisId = "1";
  private viewType = "";
  private viewTitle = "";

  /**
   * Constructor
   * @param svgViewComponent The svg view component
   */
  constructor(protected svgViewComponent: SvgViewComponent) {
    super(svgViewComponent);

    if (svgViewComponent && svgViewComponent.config && svgViewComponent.config.diagramVisId) {
      this.diagramVisId = svgViewComponent.config.diagramVisId;
      this.viewType = svgViewComponent.config.viewType;
      this.viewTitle = svgViewComponent.config.viewTitle;
    }

    // TODO
    svgViewComponent.getViewTitleCB = () => {
      const translateService = this.svgViewComponent.translateService;
      let title = this.viewTitle;
      return title;
    };
  }

  /**
   * Test if diagram not loaded and load it if not
   * @param project The project
   * @param diagram The diagram
   */
  public testAndLazyLoadVisualization(project: any, diagram: any) {
    if (project && diagram) {
      const svgFileName = this.viewType + "_" + this.diagramVisId + ".svg";
      const modelLoadSaveService = this.svgViewComponent.servicesService.getService(
        ServicesConst.ModelLoadSaveService
      ) as ModelLoadSaveService;
      modelLoadSaveService.testAndLoadSvgDiagram(project, diagram, svgFileName, (loadedData: any) => {
        this.svgViewComponent.onSvgDataLoaded(loadedData, project);
      });
    }
  }
}
