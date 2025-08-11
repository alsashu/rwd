import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { ToolTipComponent } from "src/app/components/app/tool-tip/tool-tip.component";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { TreeMenuNodeFactory } from "../../tree-menu.node-factory";

/**
 * Tree menu rule for model and projects objects
 */
export class ModelTreeMenuRule extends ANodeFactoryRule {
  /**
   * Parameters
   */
  private params = {
    objectTypes: [ModelConstService.MODEL_TYPE, ModelConstService.PROJECT_TYPE],
    excludesTypes: [ModelConstService.VISUALIZATION_TYPE],
    projectType: ModelConstService.PROJECT_TYPE,
  };

  /**
   *
   * @param rulesNodeFactory Constructor
   */
  public constructor(public rulesNodeFactory: IRulesNodeFactory) {
    super(rulesNodeFactory);
  }

  /**
   * Build nodes from business object
   * @param object The object
   * @param parentNode The parent node
   * @param context The context
   * @param params The parameters
   * @returns The created nodes
   */
  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];

    if (this.params.objectTypes.includes(object ? object.type : null)) {
      const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, params);
      if (node) {
        if (object && object.type === ModelConstService.MODEL_TYPE) {
          node.label = this.rulesNodeFactory.translateLabel("Projects");
          node.isCollapsed = false;
        }
        nodes.push(node);
        this.rulesNodeFactory.addNodesToParent([node], parentNode);

        // If project node,
        if (node.object && node.object.type === this.params.projectType) {
          let tooltip = node.object.label;

          // Version added to project name and tooltip
          const versions =
            (this.rulesNodeFactory as TreeMenuNodeFactory) &&
            (this.rulesNodeFactory as TreeMenuNodeFactory).modelService
              ? (this.rulesNodeFactory as TreeMenuNodeFactory).modelService.getProjectVersions(node.object)
              : null;
          if (versions) {
            if (versions.xmlVersion) {
              node.label = node.object.label + " (" + versions.xmlVersion + ")";
            }
            tooltip =
              node.object.label + " (xmlVersion: " + versions.xmlVersion + ", xsdVersion: " + versions.xsdVersion + ")";
          }
          node.getTooltip = (node: any) => tooltip;

          context.project = node.object;
          node.sortValue = (n: any) => n.label;
          if (!this.rulesNodeFactory.shouldLoadProjectsContent()) {
            // Stop loading children
            context.loadChildrenNodes = false;
          } else {
            // Build main category nodes
            this.rulesNodeFactory.addNodesToParent(
              this.rulesNodeFactory.buildMainCategoriesNodes(node.object, node),
              node
            );
            node.isCollapsed = false;
          }
        }
      }
    } else if (this.params.excludesTypes.includes(object ? object.type : null)) {
      context.loadChildrenNodes = false;
    }
    return nodes;
  }
}
