import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { ModelConstService } from "src/app/services/model/model-const.service";

// •	TrackLayout: displaying the topology scheme plan diagram
// •	TracksidePhysicalArchitecture: displaying the system trackside physical architecture
// •	OnboardPhysicalArchitecture: displaying the system onboard physical architecture
// •	LogicalInterface: displaying the list of logical interface pages as branches under this node
// •	AssemblyConfiguration: displaying the list of assembly configurations as branches under this node
// •	IOMapping: displaying the list of assemblies as branches under this node
// •	TypicalITFDiagrams: displaying the list of TypicalITFDiagrams as branches under this node
// •	InstantiatedITFDiagrams: displaying the list of InstantiatedITFDiagrams as branches under this node
// •	TypicalFrameDiagrams: displaying the list of TypicalFrameDiagrams as branches under this node
// •	InstantiatedFrameDiagrams: displaying the list of InstantiatedFrameDiagrams as branches under this node

export class DiagramsTreeMenuRule extends ANodeFactoryRule {
  private params: any = {
    categoryId: "Diagrams",
    nodesConfig: [
      {
        id: "Diagrams",
        label: "Diagrams",
        addChildrenCount: true,
      },
    ],
    categoryTypes: ["visualization"],
    viewTypes: [
      "TrackLayout",
      "TracksidePhysicalArchitecture",
      "OnboardPhysicalArchitecture",
      "LogicalInterface",
      "AssemblyConfiguration",
      "IOMapping",

      // "TypicalITFDiagrams",
      // "InstantiatedITFDiagrams",
      // "TypicalFrameDiagrams",
      // "InstantiatedFrameDiagrams",
    ],
  };

  public buildMainCategoriesNodes(project: any, parentNode: any): any[] {
    return this.rulesNodeFactory.buildMainCategoriesNodesRec(project, parentNode, this.params.nodesConfig);
  }

  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];
    if (
      object &&
      context &&
      context.project &&
      context.project.id &&
      this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, ["infrastructureVisualizations"])
    ) {
      if (
        this.rulesNodeFactory.isTypeExtensionOfTypes(object.type, this.params.categoryTypes) &&
        this.params.viewTypes.includes(object.viewType) &&
        object.isVisualizationEmpty !== true
      ) {
        const node = this.rulesNodeFactory.buildNodeFromObject(object, null, context, {
          label: this.rulesNodeFactory.translateLabel(object.viewType),
          sortValue: (n: any) => n.label,
        });
        if (node) {
          nodes.push(node);
          const newParentNode = this.rulesNodeFactory.getCategoryNodeById(
            this.rulesNodeFactory.getProjectNodeId(context.project, this.params.categoryId)
          );
          this.rulesNodeFactory.addNodeToParent(node, newParentNode);

          // Logical interface diagram pages
          if (object.viewType === ModelConstService.LOGICAL_INTERFACE_DIAGRAM_TYPE && object.pages !== undefined) {
            const pages = object.pages.split(",");
            pages.forEach((page: string) => {
              const pageObject = {
                type: "visualization",
                viewType: ModelConstService.LOGICAL_INTERFACE_PAGE_DIAGRAM_TYPE,
                id: object.id + "-" + page,
                visualization: object,
                page,
              };
              const pageNode = this.rulesNodeFactory.buildNodeFromObject(pageObject, null, context, {
                label: this.rulesNodeFactory.translateLabel("Page") + " " + page,
                sortValue: (n: any) => n.label,
              });
              if (pageNode) {
                pageNode.page = page;
                nodes.push(pageNode);
                this.rulesNodeFactory.addNodeToParent(pageNode, node);
              }
            });
          }
        }
      }
    }
    return nodes;
  }
}
