import { ModelLoadSaveService } from "src/app/services/model/model-load-save.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { SvgViewComponent } from "../svg-view.component";
import { ASubTypeSvgDiagramController } from "./asvg-diagram-controller";

/**
 * Track plan svg diagram controller
 */
export class TrackPlanSvgDiagramController extends ASubTypeSvgDiagramController {
  /**
   * Constructor
   * @param svgViewComponent The svg ViewComponent
   */
  constructor(protected svgViewComponent: SvgViewComponent) {
    super(svgViewComponent);
  }

  /**
   * Init layer
   */
  protected initLayers() {
    this.initCommonLayers();

    // Track plan specific layers
    this.svgDiagramService.layerService.layerOptions.layers =
      this.svgDiagramService.layerService.layerOptions.layers.concat([
        {
          layerType: "typeLayer",
          label: "Route",
          projectIndex: 0,
          isVisible: false,
          isDisplayed: true,
          type: "ROUTE",
          applyToSvgObjectCB: null,
        },
        {
          layerType: "typeLayer",
          label: "TVD Section",
          projectIndex: 0,
          isVisible: false,
          isDisplayed: true,
          type: "TVDSECTION",
          applyToSvgObjectCB: null,
        },
        {
          layerType: "typeLayer",
          label: "Archi control link groups",
          projectIndex: 0,
          isVisible: false,
          isDisplayed: true,
          type: "ARCHICONTROLLINKGROUP",
          applyToSvgObjectCB: null,
        },
        {
          layerType: "typeLayer",
          label: "Cable",
          projectIndex: 0,
          isVisible: false,
          isDisplayed: true,
          type: "CABLE",
          applyToSvgObjectCB: null,
        },
      ]);

      // --- Add logical groups from the model (project) ---
      const project = this.svgViewComponent.project;
      const logicalElements = project["GenericADM:logicalElements"];
      if (logicalElements) {
        const groupTypes = [
          { key: "GenericADM:alphaLogicalAreaGroups", label: "Alpha Logical Group", type: "GENERICADM:ALPHALOGICALAREAGROUP" },
          { key: "GenericADM:betaLogicalAreaGroups", label: "Beta Logical Group", type: "GENERICADM:BETALOGICALAREAGROUP" },
          { key: "GenericADM:logicalAreaGroups", label: "Logical Area Group", type: "GENERICADM:LOGICALAREAGROUP" },
          { key: "GenericADM:specificLogicalAreaGroups", label: "Specific Logical Area Group", type: "GENERICADM:SPECIFICLOGICALAREAGROUP" }
        ];

        groupTypes.forEach(groupType => {
          const groups = logicalElements[groupType.key];
          if (Array.isArray(groups) && groups.length > 0) {
            groups.forEach((group: any) => {
              this.svgDiagramService.layerService.layerOptions.layers.push({
                layerType: "typeLayer",
                label: group.name || group.label || groupType.label,
                projectIndex: 0,
                isVisible: false,
                isDisplayed: true,
                type: groupType.type,
                applyToSvgObjectCB: (svgObject: any) => {
                  // Enhanced callback for logical group filtering
                  return this.applyLogicalGroupFilter(svgObject, group, groupType.key);
                }
              });
            });
          }
        });
      }
  }

  /**
   * Apply logical group filter to SVG objects
   * @param svgObject The SVG object
   * @param group The logical group
   * @param groupTypeKey The group type key
   * @returns boolean indicating if object should be visible
   */
  private applyLogicalGroupFilter(svgObject: any, group: any, groupTypeKey: string): boolean {
    if (svgObject.logicalGroup && svgObject.logicalGroup.id === group.id) {
      return true;
    }
    
    // Check if the SVG object's business object belongs to this logical group
    if (svgObject.bo && group["GenericADM:LinkedLogicalAreas"]) {
      const linkedAreas = group["GenericADM:LinkedLogicalAreas"];
      const foundLink = linkedAreas.find((link: any) => {
        const idMatch = link.elementIDRef === svgObject.bo.id || 
                       link.elementIDRef === svgObject.bo.itemId;
        
        // Handle type matching with and without GenericADM: prefix
        const svgObjectType = svgObject.bo.type;
        const linkType = link.elementtypeRef;
        const typeMatch = svgObjectType === linkType || 
                         svgObjectType === `GenericADM:${linkType}` ||
                         svgObjectType.endsWith(`:${linkType}`);
        
        // Both ID and type must match for precise filtering
        return idMatch && typeMatch;
      });
      return !!foundLink;
    }
    
    return false;
  }

  /**
   * Lazy load visualization
   * @param project The project
   * @param diagram The diagram
   */
  public testAndLazyLoadVisualization(project: any, diagram: any) {
    if (project && diagram) {
      const modelLoadSaveService = this.svgViewComponent.servicesService.getService(
        ServicesConst.ModelLoadSaveService
      ) as ModelLoadSaveService;
      const svgFileName = (diagram.svgFileName || diagram.id).replace(".svg", "") + ".svg";
      modelLoadSaveService.testAndLoadSvgDiagram(project, diagram, svgFileName, (loadedData: any) => {
        this.svgViewComponent.onSvgDataLoaded(loadedData, project);
      });
    }
  }
}
