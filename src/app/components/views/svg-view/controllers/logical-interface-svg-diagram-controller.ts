import { IModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { SvgViewComponent } from "../svg-view.component";
import { ASubTypeSvgDiagramController } from "./asvg-diagram-controller";

// TODO add page N to diagram title + isthis page

/**
 * Controller of logical interface svg diagrams view
 */
export class LogicalInterfaceSvgDiagramController extends ASubTypeSvgDiagramController {
  /**
   * Page number
   */
  private page = "1";

  /**
   * Constructor
   * @param svgViewComponent The svg view component
   */
  constructor(protected svgViewComponent: SvgViewComponent) {
    super(svgViewComponent);

    if (svgViewComponent && svgViewComponent.config && svgViewComponent.config.page) {
      this.page = svgViewComponent.config.page;
    }

    svgViewComponent.getViewTitleCB = () => {
      const translateService = this.svgViewComponent.translateService;
      let title = translateService.translateFromMap("LogicalInterface");
      if (this.page) {
        title += "-" + translateService.translateFromMap("Page") + " " + this.page;
      }
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
      const modelLoadSaveService = this.svgViewComponent.servicesService.getService(
        ServicesConst.ModelLoadSaveService
      ) as IModelLoadSaveService;
      const svgFileName =
        (diagram.svgFileName || diagram.id).replace("_page_1", "").replace(".svg", "") + "_page_" + this.page + ".svg";
      modelLoadSaveService.testAndLoadSvgDiagram(project, diagram, svgFileName, (loadedData: any) => {
        this.svgViewComponent.onSvgDataLoaded(loadedData, project);
      });
    }
  }
}
