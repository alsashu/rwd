import { ANodeFactoryRule } from "src/app/components/app/generic-tree/tree-factories/rules.node-factory/node-factory-rules/base/anode-factory-rule";
import { ModelConstService } from "src/app/services/model/model-const.service";
import { ModelVisitor } from "src/app/services/model/model.visitor";
import { IIomappingTreeNodeFactory, IomappingTreeNodeFactory } from "../../iomapping-tree.node-factory";

/**
 * Tree menu rule for assembly and its components
 */
export class ModelIomappingTreeRule extends ANodeFactoryRule {
  private params = {
    objectTypes: [
      ModelConstService.ASSEMBLY_TYPE,
      ModelConstService.CUBICAL_TYPE,
      ModelConstService.EQUIPMENT_TYPE,
      ModelConstService.RACK_TYPE,
      ModelConstService.BOARD_TYPE,
    ],
  };

  /**
   * Constructor
   */
  public constructor(public rulesNodeFactory: IIomappingTreeNodeFactory) {
    super(rulesNodeFactory);
  }

  /**
   * Build nodes from an object
   * @param object The object
   * @param parentNode The parent node
   * @param context The context
   * @param params The params
   * @returns The built nodes
   */
  public buildNodes(object: any, parentNode: any, context: any, params: any = null): any[] {
    const nodes = [];
    if (this.params.objectTypes.includes(object ? object.type : null)) {
      let buildNodeParams = null;
      if (
        [ModelConstService.ASSEMBLY_TYPE, ModelConstService.CUBICAL_TYPE, ModelConstService.EQUIPMENT_TYPE].includes(
          object.type
        )
      ) {
        buildNodeParams = { isCollapsed: false };
      }
      const node = this.rulesNodeFactory.buildNodeFromObject(object, parentNode, context, buildNodeParams);
      if (node) {
        const bo = node.object;
        const type = bo ? bo.type : null;

        if (type === ModelConstService.BOARD_TYPE) {
          node.label = bo.boardType;
          node.isVisible = false;
          this.buildBoardSubNodes(node, context, params);
          node.boardTypeData = this.rulesNodeFactory.environmentConfigService.getIOMappingBoardTypeData(bo.boardType);
        }

        nodes.push(node);
        this.rulesNodeFactory.addNodesToParent([node], parentNode);
      }
    }
    return nodes;
  }

  /**
   * Build board node's sub nodes
   * @param boardNode The node of the board
   * @param context The context
   * @param params The params
   */
  public buildBoardSubNodes(boardNode: any, context: any, params: any = null) {
    const modelService = this.rulesNodeFactory.modelService;
    const assembly = this.rulesNodeFactory.params.rootObject();
    const project = modelService.getSelectedProject();
    const board = boardNode ? boardNode.object : null;
    const osEquipment = context.objectsStack.find((os: any) => os.object && os.object.type === "GenericADM:equipment");
    const equipment = osEquipment ? osEquipment.object : null;
    if (assembly && project && board && equipment) {
      const genericADMIOPhysicalMappings = project["GenericADM:iOPhysicalMappings"];
      if (genericADMIOPhysicalMappings) {
        const physicalBoard = new ModelVisitor().findCB(genericADMIOPhysicalMappings, (o: any) => {
          return o && o.iOPhysicalBoardRef === board.id;
        });
        if (physicalBoard && physicalBoard.type) {
          let ioVariables = null;
          if (project["GenericADM:iOVariableMappings"]) {
            const ioVariableMapping = new ModelVisitor().findCB(project["GenericADM:iOVariableMappings"], (o: any) => {
              return o && o.type === "GenericADM:iOVariableMapping" && o.equipmentRef === equipment.id;
            });
            ioVariables = ioVariableMapping ? ioVariableMapping["GenericADM:iOVariables"] : null;
          }

          const cellsDefPropertyName = physicalBoard.type + "CellsDef";
          const pddmBoardCellsDef = physicalBoard[cellsDefPropertyName];
          if (pddmBoardCellsDef && pddmBoardCellsDef.forEach) {
            pddmBoardCellsDef.forEach((pddmBoardCellDef: any) => {
              let ioVariable = null;
              if (ioVariables && ioVariables.find) {
                ioVariable = ioVariables.find((ioVar: any) => {
                  const cellRefs = ioVar["GenericADM:cellRefs"];
                  const cellRef =
                    cellRefs && cellRefs.forEach
                      ? cellRefs.find((cRef: any) => {
                          return cRef.elementIDRef === pddmBoardCellDef.id;
                        })
                      : null;
                  return cellRef;
                });
              }

              const cellDefNode = this.rulesNodeFactory.buildNodeFromObject(
                pddmBoardCellDef,
                boardNode,
                context,
                params
              );
              if (cellDefNode) {
                this.rulesNodeFactory.addNodesToParent([cellDefNode], boardNode);
                if (ioVariable) {
                  const ioVariableNode = this.rulesNodeFactory.buildNodeFromObject(
                    ioVariable,
                    cellDefNode,
                    context,
                    params
                  );
                  if (ioVariableNode) {
                    this.rulesNodeFactory.addNodesToParent([ioVariableNode], cellDefNode);
                  }
                }
              }
            });
          }
        }
      }
    }
  }
}
