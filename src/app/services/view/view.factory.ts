import { ModelConstService } from "../model/model-const.service";
import { IServicesService } from "../services/iservices.service";
import { IView } from "./iview";

/** Interface of the view factory class */
export interface IViewFactory {
  buildViewFromBo(bo: any, options?: any): IView;
}

/**
 * View factory that builds a view from a business object
 */
export class ViewFactory implements IViewFactory {
  constructor(public servicesService: IServicesService) {}

  public buildViewFromBo(bo: any, options: any = null): IView {
    let view: IView = null;
    if (bo && bo.type) {
      options = options || {};

      const optionProjectId = options && options.project ? options.project.id : null;
      const boProjectId = bo.projectId ? bo.projectId : optionProjectId;
      const title = bo.label || bo.id;
      // const useSvgDiagram = bo.useSvgDiagram;

      if (
        [
          ModelConstService.VISUALIZATION_TYPE,
          ModelConstService.TYPICAL_ITF_DIAGRAM_TYPE,
          ModelConstService.INSTANTIATED_ITF_DIAGRAM_TYPE,
          ModelConstService.TYPICAL_FRAME_DIAGRAM_TYPE,
          ModelConstService.INSTANTIATED_FRAME_DIAGRAM_TYPE,
        ].includes(bo.type)
      ) {
        if (bo.viewType === ModelConstService.LOGICAL_INTERFACE_PAGE_DIAGRAM_TYPE) {
          view = {
            type: "graphic-view",
            title,
            config: {
              diagramId: bo.visualization ? bo.visualization.id : null,
              page: bo.page,
              projectId: boProjectId,
              viewType: bo.visualization.viewType,
            },
          };
          if (bo.visualization && bo.visualization.useSvgDiagram) {
            view.type = "svg-view";
          }
        } else if (bo.viewType === ModelConstService.LOGICAL_INTERFACE_DIAGRAM_TYPE) {
          view = {
            type: "graphic-view",
            title,
            config: { diagramId: bo.id, page: "1", projectId: boProjectId, viewType: bo.viewType },
          };
        } else if (!bo.viewType && bo.visualization) {
          // Wiring diagram
          view = {
            type: "graphic-view",
            title,
            config: {
              diagramId: bo.visualization ? bo.visualization.id : null,
              diagramVisId: bo.id,
              projectId: boProjectId,
              viewType: bo.visualization.viewType,
              visType: bo.type,
              viewTitle: bo.label,
            },
          };
        } else {
          view = {
            type: "graphic-view",
            title,
            config: { diagramId: bo.id, projectId: boProjectId, viewType: bo.viewType },
          };
        }

        // // svg-view instead of graphic-view
        // if (view && view.type === "graphic-view" && useSvgDiagram === true) {
        //   view.type = "svg-view";
        // }

        // Force svg-view in any case
        view.type = "svg-view";
      } else if (bo.type === ModelConstService.ASSEMBLY_TYPE) {
        view = {
          type: "iomapping-view",
          title,
          config: { boId: bo.id, projectId: boProjectId },
        };
      } else if (bo.type === "GenericADM:assemblyConfiguration") {
        // Handle assembly configuration objects - route to IO mapping view with a flag
        view = {
          type: "iomapping-view",
          title,
          config: { boId: bo.id, projectId: boProjectId, isConfiguration: true },
        };
      }
    }
    return view;
  }
}
