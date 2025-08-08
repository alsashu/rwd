import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { RulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/rules.node-factory";
import { ITreeMemoService } from "src/app/components/app/generic-tree/tree-memo/tree-memo.service";
import { ModelVerificationService } from "src/app/services/model/model-verification.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { MainVerificationTreeRule } from "./verification-tree-rules/main.verification-tree-rule";

export interface IModelConfigService {
  isTypeExtensionOfTypes(type: string, extensions: string[]): boolean;
}

export interface IVerificationTreeNodeFactory extends IRulesNodeFactory {
  addObjectPropertiesNodes(objectNode: any, context: any);
  addObjectPropertiesNodesToNodes(objectNodes: any[], context: any);
}

/**
 * Verification tree node factory building nodes of generic tree component
 */
export class VerificationTreeNodeFactory extends RulesNodeFactory implements IVerificationTreeNodeFactory {
  /**
   * ModelPropertiesService
   */
  private modelVerificationService: ModelVerificationService;

  /**
   * Constructor
   * @param treeMemoService
   * @param params
   */
  constructor(protected treeMemoService: ITreeMemoService, params: any) {
    super(treeMemoService, params);
    this.params.mainRule = new MainVerificationTreeRule(this);

    this.modelVerificationService = this.params.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as ModelVerificationService;
  }

  /**
   * Create nodes for each property of the object attached to objectNode and add property nodes to objectNode
   * @param objectNode The node of the object
   * @param context The context
   */
  public addObjectPropertiesNodes(objectNode: any, context: any) {
    const object = objectNode && objectNode.object ? objectNode.object : null;
    if (object) {
      const propertyDataList = this.modelVerificationService.getObjectVerificationPropertiesData(
        object,
        this.params.isUndefinedValueVisible()
      );
      propertyDataList.forEach((propertyData: any) => {
        const node = this.buildNodeFromObject(propertyData, objectNode, context, {
          addChildrenCountToNode: false,
        });
        this.addNodeToParent(node, objectNode);
      });
    }
  }

  /**
   * Create nodes for each property of the objects attached to objectNodes and add property nodes to objectNodes
   * @param objectNodes The list of nodes
   * @param context The context
   */
  public addObjectPropertiesNodesToNodes(objectNodes: any[], context: any): any[] {
    if (objectNodes) {
      objectNodes.forEach((objectNode: any) => this.addObjectPropertiesNodes(objectNode, context));
    }
    return objectNodes;
  }
}
