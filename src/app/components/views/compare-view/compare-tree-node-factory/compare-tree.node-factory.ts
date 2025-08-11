import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { RulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/rules.node-factory";
import { ITreeMemoService } from "src/app/components/app/generic-tree/tree-memo/tree-memo.service";
import { CompareService, ICompareService } from "src/app/services/compare/compare.service";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { IModelPropertiesService } from "src/app/services/model/model-properties.service";
import { ModelService } from "src/app/services/model/model.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { MainCompareTreeRule } from "./compare-tree-rules/main.compare-tree-rule";
import { ITranslateService } from "src/app/services/translate/translate.service";

/**
 * Interface of ModelConfigService
 */
export interface IModelConfigService {
  isTypeExtensionOfTypes(type: string, extensions: string[]): boolean;
}

/**
 * Interface of CompareTreeNodeFactory
 */
export interface ICompareTreeNodeFactory extends IRulesNodeFactory {
  addNodeToLastNodesByTypeMap(node: any, mapPrefix?: string);
  getLastNodeByType(type: string, mapPrefix?: string): any;
  getMainSibblingNode(node: any, mapPrefix?: string): any;
}

/**
 * Compare tree node factory building nodes of generic tree component
 */
export class CompareTreeNodeFactory extends RulesNodeFactory implements ICompareTreeNodeFactory {
  private modelService: ModelService;
  private compareService: ICompareService;
  public modelPropertiesService: IModelPropertiesService;
  public translateService: ITranslateService;
  public context: any;

  private compareDisplayDataMap = new Map([
    [CompareService.CompareState.none, { shortLabel: "", label: "", style: "compare-status" }],
    [CompareService.CompareState.new, { shortLabel: "+", label: "New", style: "compare-status compare-status-new" }],

    [
      CompareService.CompareState.equal,
      { shortLabel: "=", label: "Equal", style: "compare-status compare-status-equal" },
    ],
    [
      CompareService.CompareState.modified,
      { shortLabel: "\u2260", label: "Modified", style: "compare-status compare-status-modified" },
    ],
    [
      CompareService.CompareState.deleted,
      { shortLabel: "-", label: "Deleted", style: "compare-status compare-status-deleted" },
    ],
  ]);

  /**
   * Constructor
   * @param treeMemoService
   * @param params
   */
  constructor(protected treeMemoService: ITreeMemoService, params: any) {
    super(treeMemoService, params);
    this.params.mainRule = new MainCompareTreeRule(this);

    this.modelService = this.params.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.compareService = this.params.servicesService.getService(ServicesConst.CompareService) as ICompareService;
    this.modelPropertiesService = this.params.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as IModelPropertiesService;
    this.translateService = this.params.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;

    // Labels translation
    this.compareDisplayDataMap.forEach((v: any) => {
      v.label = this.translateService.translateFromMap(v.label);
    });
  }

  /**
   * Create a context used in buildNodesRec recursive function
   * @returns The context
   */
  protected createContext(): any {
    let context = super.createContext();
    this.context = context;
    this.context.lastNodesByTypeMap = new Map<string, any>();
    this.context.nodesMap = new Map<string, any>();
    return context;
  }

  /**
   * Build the nodes and sort them
   * @returns The list of nodes
   */
  public buildNodes(): any[] {
    let nodes = [];
    if (
      this.modelService.getSelectedProject() &&
      this.compareService.comparisonIsEnabled() &&
      !this.compareService.compareData.projectList.find((p: any) => !p.isLoaded)
    ) {
      nodes = super.buildNodes();
      this.doBuildNodesPostTreatment(nodes);
    }
    return nodes;
  }

  /**
   * Post treatment
   * @param nodes The nodes
   */
  private doBuildNodesPostTreatment(nodes: any[]) {
    const projectList = this.compareService.compareData.projectList;
    this.compareService.compareData.compareObjectsMap.forEach((compareObjectData: any, key: any) => {
      this.computeCompareObjectData(compareObjectData, projectList);
    });
  }

  /**
   * Add a node to a parent node
   * @param node The node
   * @param parentNode The parent node
   * @param preventDoublon Prevent doublons
   * @returns The node
   */
  public addNodeToParent(node: any, parentNode: any, preventDoublon = false): any {
    if (node && parentNode) {
      // TODO DEBUG: add the name of the project to which the object belongs
      // if (this.context && this.context.compareProject) {
      //   node.label += " (" + this.context.compareProject.label + ")";
      // }

      const o = node.object;
      if (o && o.type && o.id) {
        let notToBeAdded = ["project"].includes(o.type) && !this.context.isFirstProject;
        const notToBeComparedNode = ["treeMenuNode", "project"].includes(o.type);

        if (!this.compareService.comparisonIsComputed() && notToBeAdded === false && o.type !== "project") {
          notToBeAdded = true;
        }

        if (notToBeAdded) {
          // console.log(node, o);
        } else if (notToBeComparedNode) {
          if (o.type === "project") {
            // TODO multi projects: delete this code (label too long)
            // let s = "";
            // this.compareService.getCompareProjectList().forEach((p: any) => {
            //   s += p.label + (s.length === 0 ? "/" : "");
            // });
            // node.label = s;
            node.label = this.translateService.translateFromMap("Projects");
          }
          super.addNodeToParent(node, parentNode, preventDoublon);
        } else {
          const key = o.type + "-" + o.id;
          let oMap: any = this.compareService.compareData.compareObjectsMap.get(key);
          if (!oMap) {
            oMap = {
              objectByVersionMap: new Map(),
              dataPerVersionList: [],
            };
            this.compareService.compareData.compareObjectsMap.set(key, oMap);
          }
          if (!(o.type === ModelConstService.PROJECT_TYPE && this.context.isFirstProject === false)) {
            const doublon = this.findDoublonNode(o, parentNode);
            if (!doublon) {
              node.compareData = oMap;
              super.addNodeToParent(node, parentNode, preventDoublon);
            }
          }
          if (this.context && this.context.compareProject && this.context.compareProject.id) {
            oMap.objectByVersionMap.set(this.context.compareProject.label, o);
          }
        }
      } else {
        super.addNodeToParent(node, parentNode, preventDoublon);
      }
    }
    return node;
  }

  /**
   * Compute CompareObjectData
   * @param compareObjectData compareObjectData that contains all comparison data
   * @param projectList The list of compared projects
   */
  private computeCompareObjectData(compareObjectData: any, projectList: any[]) {
    compareObjectData.dataPerVersionList = [];

    let compareVersionDataPrevious: any = null;

    projectList
      .slice()
      .reverse()
      .forEach((project: any, index: number) => {
        const objectByVersion = compareObjectData.objectByVersionMap.get(project.label);
        // if (objectByVersion && objectByVersion.label === "S1") {
        //   console.log(objectByVersion);
        // }
        const compareVersionData = {
          version: project,
          versionLabel: project.label,
          objectLabel: objectByVersion ? objectByVersion.label || objectByVersion.id || objectByVersion.type : "",
          object: objectByVersion,
          compareState:
            objectByVersion && index === 0 ? CompareService.CompareState.new : CompareService.CompareState.none,
          compareDisplayData: this.compareDisplayDataMap.get(CompareService.CompareState.none),
          shortLabel: "",
          style: "",
          properties: [],
        };
        if (objectByVersion) {
          objectByVersion.compareMetaData = {
            projectId: project.id,
            projectLabel: project.label,
          };
        }

        if (index > 0) {
          if (
            objectByVersion &&
            compareVersionDataPrevious &&
            compareVersionDataPrevious.compareState === CompareService.CompareState.none
          ) {
            compareVersionData.compareState = CompareService.CompareState.new;
          } else if (!objectByVersion) {
            compareVersionData.compareState = CompareService.CompareState.deleted;

            // New code for more than 2 versions
            if (
              compareVersionDataPrevious &&
              [CompareService.CompareState.none, CompareService.CompareState.deleted].includes(
                compareVersionDataPrevious.compareState
              )
            ) {
              compareVersionData.compareState = CompareService.CompareState.none;
            }
          } else {
            if (compareVersionDataPrevious) {
              const compareDataBetweenTwoVersions = this.compareService.getCompareDataBetweenTwoVersions(
                compareVersionData.object,
                compareVersionDataPrevious.object,
                project
              );
              compareVersionData.compareState =
                compareVersionDataPrevious.compareState === CompareService.CompareState.deleted
                  ? CompareService.CompareState.new
                  : compareDataBetweenTwoVersions.compareState;
              compareVersionData.properties = compareDataBetweenTwoVersions.properties;
            } else {
              compareVersionData.compareState = CompareService.CompareState.error;
            }
          }
        }

        const compareDisplayData = this.compareDisplayDataMap.get(compareVersionData.compareState);
        compareVersionData.compareDisplayData = compareDisplayData;
        compareVersionData.shortLabel = compareDisplayData.shortLabel;
        compareVersionData.style = compareDisplayData.style;

        compareVersionDataPrevious = compareVersionData;

        compareObjectData.dataPerVersionList.push(compareVersionData);
      });
  }

  /**
   * Add a node to map memorizing last node by object type (ex: last seen cubical)
   * @param node The node
   * @param mapPrefix A string prefix for the key
   * @param context The context embedding the map
   */
  public addNodeToLastNodesByTypeMap(node: any, mapPrefix: string = null) {
    if (node && node.object) {
      const key = (mapPrefix ? mapPrefix + "-" : "") + node.object.type;
      this.context.lastNodesByTypeMap.set(key, node);
      // Memorization of the object with no doublon (nodes of first project or deleted objects from the second)
      const key2 = (mapPrefix ? mapPrefix + "-" : "") + node.object.type + "-" + node.object.id;
      if (!this.context.nodesMap.get(key2)) {
        this.context.nodesMap.set(key2, node);
      }
    }
  }

  /**
   * Get last node of a type
   * @param mapPrefix A string prefix for the key
   * @param type The type
   * @returns The found node, null instead
   */
  public getLastNodeByType(type: string, mapPrefix: string = null): any {
    const key = (mapPrefix ? mapPrefix + "-" : "") + type;
    return this.context.lastNodesByTypeMap.get(key);
  }

  /**
   * Get main node of same object (type/id & mapPrefix)
   * @param node The node
   * @param mapPrefix A string prefix for the key
   * @returns The found node
   */
  public getMainSibblingNode(node: any, mapPrefix: string = null): any {
    const key2 =
      node && node.object ? (mapPrefix ? mapPrefix + "-" : "") + node.object.type + "-" + node.object.id : null;
    return key2 ? this.context.nodesMap.get(key2) : null;
  }
}
