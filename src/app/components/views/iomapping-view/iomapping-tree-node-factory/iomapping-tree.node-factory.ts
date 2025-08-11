import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { RulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/rules.node-factory";
import { ITreeMemoService } from "src/app/components/app/generic-tree/tree-memo/tree-memo.service";
import { IEnvironmentConfigService } from "src/app/services/config/environment-config.service";
import { IModelVerificationService } from "src/app/services/model/model-verification.service";
import { IModelService } from "src/app/services/model/model.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { MainIomappingTreeRule } from "./iomapping-tree-rules/main.iomapping-tree-rule";
import { CompareService, ICompareService } from "src/app/services/compare/compare.service";

/**
 * Interface of IO mapping tree node factory
 */
export interface IIomappingTreeNodeFactory extends IRulesNodeFactory {
  modelService: IModelService;
  environmentConfigService: IEnvironmentConfigService;
}

/**
 * IO mapping tree node factory building nodes of generic tree component
 */
export class IomappingTreeNodeFactory extends RulesNodeFactory implements IIomappingTreeNodeFactory {
  public modelService: IModelService;
  public environmentConfigService: IEnvironmentConfigService;
  public modelVerificationService: IModelVerificationService;
  public compareService: ICompareService;

  /**
   * Constructor
   * @param treeMemoService Tree memeo service
   * @param params Parameters of the factory
   */
  constructor(protected treeMemoService: ITreeMemoService, params: any) {
    super(treeMemoService, params);
    this.params.mainRule = new MainIomappingTreeRule(this);

    this.modelService = this.params.servicesService.getService(ServicesConst.ModelService) as IModelService;
    this.modelVerificationService = this.params.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.environmentConfigService = this.params.servicesService.getService(
      ServicesConst.EnvironmentConfigService
    ) as IEnvironmentConfigService;
    this.compareService = this.params.servicesService.getService(ServicesConst.CompareService) as ICompareService;
  }

  /**
   * Tests is comparison is active and computed
   * @returns Boolean value
   */
  public comparisonIsActive(): boolean {
    return this.compareService.comparisonIsComputed();
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
      super.addNodeToParent(node, parentNode, preventDoublon);

      // Comparison data
      const o = node.object;
      if (o) {
        const key = o.type + "-" + o.id;
        let oMap: any = this.compareService.compareData.compareObjectsMap.get(key);
        if (oMap) {
          node.compareData = oMap;

          if (oMap && oMap.dataPerVersionList) {
            // const compareIndex = 1;
            const compareIndex = this.params.getCompareLevel
              ? oMap.dataPerVersionList.length - this.params.getCompareLevel()
              : 1;

            // 2 projects comparison
            if (compareIndex < oMap.dataPerVersionList.length) {
              const data = oMap.dataPerVersionList[compareIndex];
              if (data) {
                node.compareState = data.compareState;
                node.isModified = [
                  CompareService.CompareState.new,
                  CompareService.CompareState.deleted,
                  CompareService.CompareState.modified,
                ].includes(data.compareState);
                if (data.compareState === CompareService.CompareState.modified) {
                  const nameProperty = data.properties
                    ? data.properties.find((prop: any) => prop.name === "name")
                    : null;
                  if (nameProperty) {
                    node.labelPrevious = nameProperty.displayedValueOld;
                    node.isModified = true;
                  } else {
                    node.isModified = false;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
