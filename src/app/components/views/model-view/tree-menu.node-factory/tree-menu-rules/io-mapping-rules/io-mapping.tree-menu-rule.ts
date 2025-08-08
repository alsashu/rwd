import { CompositeNodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/composite-node-factory-rule";
import { IRulesNodeFactory } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/inode-factory-rule";
import { IOPhysicalMappingsTreeMenuRule } from "./io-physical-mappings.tree-menu-rule";
import { IOTrackSideArchitectureTreeMenuRule } from "./io-trackside-architecture.tree-menu-rule";
import { IOVariableMappingsTreeMenuRule } from "./io-variable-mappings.tree-menu-rule";

// [RIGHT_VIEWER_SWRS_0109]
// The tool shall display in the tree menu under the “IO Mapping” node the objects organized with the following nodes:
// 1.	TracksideArchitecture: displaying all the equipment rooms with their associated IOVariables segregated based on the field object in a tree structure and all the equipment room objects in a flat structure.
// 2.	IOVariableMappings: displaying the IOVariables details of each SMIO aligned with the class <tIOVariableMapping> in GenericADM XSD definition.
// 3.	IOPhysicalMappings: displaying the physical board details aligned with the classes whose extension types are <tIOBoard>, <tBoardParameterSet>, <tCellParameterSet> under branches <Boards>, <BoardsParameterSet>, <CellsParameterSet> respectively.

export class IOMappingTreeMenuRule extends CompositeNodeFactoryRule {
  public constructor(rulesNodeFactory: IRulesNodeFactory) {
    super(
      rulesNodeFactory,
      [
        new IOTrackSideArchitectureTreeMenuRule(rulesNodeFactory),
        new IOVariableMappingsTreeMenuRule(rulesNodeFactory),
        new IOPhysicalMappingsTreeMenuRule(rulesNodeFactory),
      ],
      {
        categoryId: "IOMapping",
        nodesConfig: [{ id: "IOMapping", label: "IO Mapping" }],
      }
    );
  }

  public continueToBuildNodes(object: any, parentNode: any, context: any, params: any = null): boolean {
    return this.rulesNodeFactory.testIfContextUnderObjetsTypes(context, 0, [
      "GenericADM:iOPhysicalMappings",
      "GenericADM:iOVariableMappings",
      "GenericADM:architecture",
    ]);
  }
}
