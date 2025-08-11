import { ModelConstService } from "src/app/services/model/model-const.service";
import { ModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { TPEDiagramFactory } from "../factories/tpe-diagram-factory";
import { GraphicViewComponent } from "../graphic-view.component";
import { ISubTypeDiagramController } from "./idiagram-controller";

export class TrackPlanDiagramController implements ISubTypeDiagramController {
  private diagramFactory: TPEDiagramFactory;

  private addedToolBarActions = [
    {
      type: "btn-group",
      id: "tpe-toolbar-actions-group",
      visible: (item: any) => true,
      actions: [
        {
          type: "dropdown",
          html: (item: any) => "tpe.diagram.show.dropdown.action",
          icon: (item: any) => "eye",
          enabled: (item: any) => true,
          visible: (item: any) => true,
          actions: [
            {
              type: "dropdown-item",
              html: (item: any) => "tpe.diagram.show.routes.action",
              click: (event: any, item: any) => {
                this.options.isRouteVisible = !this.options.isRouteVisible;
                this.refreshDiagram();
              },
              active: (item: any) => this.options.isRouteVisible,
              enabled: (item: any) => true,
              visible: (item: any) => true,
            },
            {
              type: "dropdown-item",
              html: (item: any) => "tpe.diagram.show.tvdsections.action",
              click: (event: any, item: any) => {
                this.options.isTVDSectionsVisible = !this.options.isTVDSectionsVisible;
                this.refreshDiagram();
              },
              active: (item: any) => this.options.isTVDSectionsVisible,
              enabled: (item: any) => true,
              visible: (item: any) => true,
            },
          ],
        },
      ],
    },
  ];

  private options = {
    isRouteVisible: false,
    isTVDSectionsVisible: false,
  };

  private diagram: any = null;

  constructor(private graphicViewComponent: GraphicViewComponent) {
    this.diagramFactory = new TPEDiagramFactory(graphicViewComponent, {
      isRouteVisible: () => this.options.isRouteVisible,
      isTVDSectionVisible: () => this.options.isTVDSectionsVisible,
    });
  }

  public init() {
    this.initActions();
  }

  private initActions() {
    this.graphicViewComponent.viewActionsService.addToolBarActions(this.addedToolBarActions);
  }

  public initDiagram(diagram: any) {
    if (diagram.type === ModelConstService.VISUALIZATION_TYPE) {
      this.diagram = diagram;
      this.refreshDiagram();
    }
  }

  public refreshDiagram() {
    if (this.diagram) {
      const svgObject = this.diagramFactory.buildSvgObjectFromDiagram(this.diagram);
      this.diagram.svgObject = svgObject;
    }
  }

  public testAndLazyLoadVisualization(project: any, diagram: any) {
    if (project && diagram) {
      const modelLoadSaveService = this.graphicViewComponent.servicesService.getService(
        ServicesConst.ModelLoadSaveService
      ) as ModelLoadSaveService;
      modelLoadSaveService.testAndLazyLoadVisualization(project, diagram);
    }
  }
}
