import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ModelConstService } from "./model-const.service";
import { ModelService } from "./model.service";
import { ModelVerificationService } from "./model-verification.service";
import { ModelVisitor } from "./model.visitor";

/**
 * Interface of RailML service
 */
export interface IModelRailMLService {
  initProjectOnLoad(project: any);
}

/**
 * Service used for RailML model
 */
export class ModelRailMLService implements IModelRailMLService {
  private modelService: ModelService;
  private modelVerificationService: ModelVerificationService;

  constructor(private servicesService: IServicesService) {}

  /**
   * Service initialization
   */
  public initService() {
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as ModelVerificationService;
  }

  /**
   * Init project data after loading (create links)
   * @param project The project
   */
  public initProjectOnLoad(project: any) {
    const t0 = new Date();
    console.log(">> initModelOnLoad");

    if (project) {
      const idBoMap = this.calcIdBoMap(project);
      const visualizationList = this.getVisualizationList(project);

      new ModelVisitor().forEachCB(
        project,
        (o: any, parent: any, parentTypeName: string) => {
          this.modelVerificationService.initObjectSourceAndStateData(o);
          this.createLinks(project, o, this.modelService.getModelConfig().boLinks, idBoMap);

          if (o.type === ModelConstService.PROJECT_TYPE) {
            console.log("ModelRailMLService.initModelOnLoad projet", o.label);
            // } else if (o.type === ModelConstService.VISUALIZATION_TYPE) {
            //   console.log("ModelRailMLService.initModelOnLoad visualization", o);
            //   // visualizationList.push(o);

            // Create links to wiring diagrams visualizations
          } else if (o.type === ModelConstService.TYPICAL_ITF_DIAGRAM_TYPE) {
            const res = this.findWiringDiagramDataById(
              visualizationList,
              o.id,
              "TypicalITFDiagrams",
              "GenericADM:typicalITFDiagramVis"
            );
            if (res) {
              o.visualization = res.visualization;
              o.wiringDiagramsVis = res.wiringDiagramsVis;
              o.typicalITFDiagramVis = res.typicalITFDiagramVis;
            }
            // console.log("ModelRailMLService.initModelOnLoad typicalITFDiagram", o);
          } else if (o.type === ModelConstService.INSTANTIATED_ITF_DIAGRAM_TYPE) {
            const res = this.findWiringDiagramDataById(
              visualizationList,
              o.id,
              "InstantiatedITFDiagrams",
              "GenericADM:instantiatedITFDiagramVis"
            );
            if (res) {
              o.visualization = res.visualization;
              o.wiringDiagramsVis = res.wiringDiagramsVis;
              o.instantiatedITFDiagramVis = res.instantiatedITFDiagramVis;
            }
            // console.log("ModelRailMLService.initModelOnLoad instantiatedITFDiagramVis", o);
          } else if (o.type === ModelConstService.TYPICAL_FRAME_DIAGRAM_TYPE) {
            const res = this.findWiringDiagramDataById(
              visualizationList,
              o.id,
              "TypicalFrameDiagrams",
              "GenericADM:typicalITFDiagramVis"
            );
            if (res) {
              o.visualization = res.visualization;
              o.wiringDiagramsVis = res.wiringDiagramsVis;
              o.typicalITFDiagramVis = res.typicalITFDiagramVis;
            }
            // console.log("ModelRailMLService.initModelOnLoad frame typicalITFDiagram", o);
          } else if (o.type === ModelConstService.INSTANTIATED_FRAME_DIAGRAM_TYPE) {
            const res = this.findWiringDiagramDataById(
              visualizationList,
              o.id,
              "InstantiatedFrameDiagrams",
              "GenericADM:instantiatedITFDiagramVis"
            );
            if (res) {
              o.visualization = res.visualization;
              o.wiringDiagramsVis = res.wiringDiagramsVis;
              o.instantiatedITFDiagramVis = res.instantiatedITFDiagramVis;
            }
            // console.log("ModelRailMLService.initModelOnLoad frame instantiatedITFDiagramVis", o);
          }
        },
        null,
        ["refObject", "svgObject"]
      );
      console.log(">> initModelOnLoad end t=", new Date().valueOf() - t0.valueOf(), "ms");
    }
  }

  /**
   * Get the list of visualizations of a project
   * @param project Th eproject
   * @returns The list of visualization objects
   */
  public getVisualizationList(project: any) {
    return project && project["infrastructureVisualizations"] ? project["infrastructureVisualizations"] : [];
  }

  /**
   * Find Wiring Diagram Data by an id
   * @param visualizationList List of visualizations
   * @param id Diagram id
   * @param viewType Wiring diagram view type
   * @param visSubType Wiring diagram sub type
   * @returns
   */
  private findWiringDiagramDataById(visualizationList: any[], id: string, viewType: string, visSubType: string): any {
    let res = null;
    if (visualizationList && visualizationList.forEach) {
      visualizationList.forEach((visualization: any) => {
        if (visualization.viewType === viewType) {
          const wiringDiagramsVisList = visualization["GenericADM:wiringDiagramsVis"];
          if (!res && wiringDiagramsVisList && wiringDiagramsVisList.forEach) {
            wiringDiagramsVisList.forEach((wiringDiagramsVis: any) => {
              const typicalITFDiagramVis = wiringDiagramsVis[visSubType];
              if (!res && typicalITFDiagramVis) {
                if (typicalITFDiagramVis.forEach) {
                  typicalITFDiagramVis.forEach((typicalITFDiagramVis: any) => {
                    if (typicalITFDiagramVis.ref === id) {
                      res = { visualization, typicalITFDiagramVis, wiringDiagramsVis };
                    }
                  });
                } else {
                  if (typicalITFDiagramVis.ref === id) {
                    res = { visualization, typicalITFDiagramVis, wiringDiagramsVis };
                  }
                }
              }
            });
          }
        }
      });
    }
    return res;
  }

  /**
   * Creates a map of objects from ids in a model tree
   * @param root Root object
   */
  private calcIdBoMap(root: any): any {
    const idBoMap = new Map();
    new ModelVisitor().forEachCB(
      root,
      (o: any, parent: any, parentTypeName: string) => {
        if (o.id) {
          if (idBoMap.get(o.id)) {
            // console.log(">>> calcIdBoMap WARNING", o.id, o);
          } else {
            idBoMap.set(o.id, o);
          }
        }
      },
      null,
      ["refObject", "svgObject"]
    );
    return idBoMap;
  }

  /**
   * Create linked objects from a ref properties
   * @param project Project
   * @param o Object
   * @param props List of ref id property and ref object property
   * @param idBoMap A map of id/objects of the project
   */
  public createLinks(project: any, o: any, props: any[], idBoMap: any = null) {
    // TODO disabled because does not work with no uuid
    // props.forEach((p: any) => this.createLink(project, o, p[0], p[1], idBoMap));
    // TODO disable because of poor performance with big projects
    this.createAdditionalInfosLinks(project, o, idBoMap);
  }

  /**
   * Create linked object from a ref property if ref property exists in an object
   * @param project Project
   * @param o The object
   * @param idProp The property name of the ref id
   * @param linkProp The property name of the object
   * @param idBoMap A map of id/objects of the project
   */
  public createLink(project: any, o: any, idProp: string, linkProp: string, idBoMap: any = null) {
    if (o && o[idProp] && !o[linkProp]) {
      let linkObject = idBoMap ? idBoMap.get(o[idProp]) : null;
      if (!linkObject) {
        linkObject = this.modelService.getObjectById(project, o[idProp]);
      } else {
        //        console.log(">> createLink object not found", idProp, linkProp, o[idProp], idBoMap);
      }
      o[linkProp] = linkObject;
    }
  }

  /**
   * Create Additional infos links
   * @param project
   * @param o
   * @param idBoMap
   */
  public createAdditionalInfosLinks(project: any, o: any, idBoMap: any = null) {
    console.log('createAdditionalInfosLinks called for:', o.type, o.id);
    
    if (o && o.type && o.type.indexOf("AdditionalInfo") > 0 && o.ref) {
      console.log('Processing AdditionalInfo object:', o.type, 'ref:', o.ref);
      
      const refObjectType = o.type.split(":").pop().replace("AdditionalInfo", "");
      console.log('Looking for ref object type:', refObjectType);
      
      // TODO use map because too slow
      const refObject = this.modelService.getObjectByIdAndType(project, o.ref, [refObjectType]);
      console.log('Found ref object:', refObject);
      
      if (refObject) {
        if (!refObject.additionInfosList) {
          refObject.additionInfosList = [];
          console.log('Created additionInfosList for:', refObject.id);
        }
        refObject.additionInfosList.push(o);
        console.log('Added to additionInfosList. New length:', refObject.additionInfosList.length);

        // TODO DEBUG
        // if (refObject.additionInfosList && refObject.additionInfosList.length > 1) {
        //   console.log(o, refObject, refObjectType);
        // }
      } else {
        console.log('Ref object not found for:', o.ref, 'type:', refObjectType);
      }
    } else {
      console.log('Object is not AdditionalInfo or missing ref:', o?.type, o?.ref);
    }
  }

  // /**
  //  * Create linked object from id and type
  //  * @param o The object
  //  * @param linkProp The property name of the ref id
  //  * @param id The id of the bo
  //  * @param type The type of the bo
  //  * @param idAndTypeBoMap The map of objects from id and type
  //  * @returns The linked object if found
  //  */
  // public createLinkFromIdAndTypeBoMap(o: any, linkProp: string, id: string, type: string, idAndTypeBoMap: any): any {
  //   let linkObject = null;
  //   if (o && id) {
  //     linkObject = idAndTypeBoMap.get(type + "-" + id);
  //     if (linkObject) {
  //       o[linkProp] = linkObject;
  //     }
  //   }
  //   return linkObject;
  // }

  /**
   * Initialize lazy loaded data (create links)
   * @param project The project
   * @param data The loaded data
   * @param idBoMap A map of id/objects of the project
   */
  public initLazyLoadedData(project: any, data: any, idBoMap: any = null) {
    if (project && data) {
      if (!idBoMap) {
        idBoMap = this.calcIdBoMap(project);
      }
      new ModelVisitor().forEachCB(data, (o: any, parent: any, parentTypeName: string) => {
        this.createLinks(project, o, this.modelService.getModelConfig().boLinks, idBoMap);
      });
    }
  }
}
