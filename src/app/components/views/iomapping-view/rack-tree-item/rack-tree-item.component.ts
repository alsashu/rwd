import { Component, Input, OnInit } from "@angular/core";
import { ICompareService } from "src/app/services/compare/compare.service";
import { IEnvironmentConfigService } from "src/app/services/config/environment-config.service";
import { ModelPropertiesService } from "src/app/services/model/model-properties.service";
import { IModelVerificationService, ModelVerificationService } from "src/app/services/model/model-verification.service";
import { RightsConst } from "src/app/services/rights/rights.const";
import { RightsService } from "src/app/services/rights/rights.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { TranslateService } from "src/app/services/translate/translate.service";

@Component({
  selector: "app-rack-tree-item",
  templateUrl: "./rack-tree-item.component.html",
  styleUrls: ["./rack-tree-item.component.css"],
})
export class RackTreeItemComponent implements OnInit {
  @Input()
  public node: any;

  @Input()
  public treeController: any;

  @Input()
  public options?: any = {};

  public modelPropertiesService: ModelPropertiesService;
  private modelVerificationService: IModelVerificationService;
  public translateService: TranslateService;
  private rightsService: RightsService;
  public compareService: ICompareService;
  public environmentConfigService: IEnvironmentConfigService;

  public slotCount = 16;
  public cellCount = 12;
  public slotIndexList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  public cellIndexList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public slotList = [];
  public slotListComparison = [];

  public ttNode: any = null;

  /**
   * Constructor
   * @param servicesService The ServicesService
   */
  constructor(public servicesService: ServicesService) {
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as ModelPropertiesService;
    this.modelVerificationService = this.servicesService.getService(
      ServicesConst.ModelVerificationService
    ) as IModelVerificationService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as TranslateService;
    this.rightsService = this.servicesService.getService(ServicesConst.RightsService) as RightsService;
    this.compareService = this.servicesService.getService(ServicesConst.CompareService) as ICompareService;
    this.environmentConfigService = this.servicesService.getService(
      ServicesConst.EnvironmentConfigService
    ) as IEnvironmentConfigService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit(): void {
    this.initRackData();
  }

  /**
   * Tests is comparison is active and computed
   * @returns Boolean value
   */
  public comparisonIsActive(): boolean {
    return this.compareService.comparisonIsComputed();
  }

  /**
   * Get the rack linked to the current node
   * @returns The rack object
   */
  public getRack(): any {
    return this.node ? this.node.object : null;
  }

  /**
   * Init the rack data
   */
  public initRackData() {
    this.slotList = this.calculateSlotList(this.node);
    this.initRackDataComparison();
  }

  /**
   * Init the rack data for comparison
   */
  private initRackDataComparison() {
    if (this.node && this.node.nodeComparison) {
      this.slotListComparison = this.calculateSlotList(this.node.nodeComparison);

      // Updata data with comparison
      this.slotIndexList.forEach((slotIndex: number) => {
        const slot = this.slotList[slotIndex - 1];
        const slotComparison = this.slotListComparison[slotIndex - 1];
        if (slot && slotComparison) {
          // Slot label
          if (slot.label !== slotComparison.label) {
            slot.boardModified = true;
            slot.labelPrevious = slotComparison.label;
          }
          // Cells
          this.cellIndexList.forEach((cellIndex: number) => {
            const cellData = slot.cellDataList[cellIndex - 1];
            const cellDataComparison = slotComparison.cellDataList[cellIndex - 1];
            if (cellData && cellDataComparison) {
              if (cellData.label !== cellDataComparison.label) {
                cellData.cellModified = true;
                cellData.labelPrevious = cellDataComparison.label;
              }
            }
          });
        }
      });
    }
  }

  /**
   * Calculate slot list of a rack
   * @param rackNode The rack node
   * @returns
   */
  private calculateSlotList(rackNode: any): any[] {
    const slotList = [];
    if (rackNode) {
      const boardNodeList = rackNode.nodes;

      let previousBoardNode = null;
      this.slotIndexList.forEach((slotIndex: number) => {
        const boardNode = this.getBoardNode(boardNodeList, slotIndex);
        const label = boardNode ? boardNode.label : "Not Used";
        const slot: any = {
          boardModified: false,
          slotIndex,
          label,
          labelPrevious: label,
          boardNode,
          isMergedSlot:
            previousBoardNode &&
            previousBoardNode.boardTypeData &&
            previousBoardNode.boardTypeData.fullSpan === "yes" &&
            previousBoardNode.boardTypeData.slots === "2",
          colspan:
            boardNode &&
            boardNode.boardTypeData &&
            boardNode.boardTypeData.fullSpan === "yes" &&
            boardNode.boardTypeData.slots
              ? boardNode.boardTypeData.slots
              : "1",
          fullSpan: boardNode && boardNode.boardTypeData && boardNode.boardTypeData.fullSpan === "yes",
          rowspan:
            boardNode && boardNode.boardTypeData && boardNode.boardTypeData.fullSpan === "yes"
              ? this.cellCount + 1
              : "1",
          cellDataList: [],
        };
        slot.cellDataList = this.getBoardCellDataList(slot);
        slotList.push(slot);
        previousBoardNode = boardNode;
      });
    }
    return slotList;
  }

  /**
   * Calculate cells data of a slot
   * @param slot The slot
   * @returns The list of cell data
   */
  private getBoardCellDataList(slot: any): any[] {
    const cellDataList = [];
    this.cellIndexList.forEach((cellIndex: number) => {
      cellDataList.push(this.getBoardCellData(slot, cellIndex));
    });
    return cellDataList;
  }

  /**
   * Calculate cell data of a slot
   * @param slot The slot
   * @param cellIndex The index
   * @returns The cell data
   */
  private getBoardCellData(slot: any, cellIndex: number): any {
    const cellNode = this.getBoardCellNode(slot.boardNode, cellIndex);
    const ioVariableNode = cellNode && cellNode.nodes && cellNode.nodes.length ? cellNode.nodes[0] : null;
    const label = ioVariableNode ? ioVariableNode.label : "";
    const cellData = {
      slot,
      cellIndex,
      label,
      labelPrevious: label,
      cellModified: false,
      cellNode,
      ioVariableNode,
    };
    return cellData;
  }

  /**
   * Get the content of a board cell node
   * @param slot The slot
   * @param cellIndex The cell index
   * @returns The context data
   */
  public getBoardCellNodeContext(slot: any, cellIndex: number): any {
    const cellData: any = slot.cellDataList[cellIndex - 1];
    return {
      cellData,
      treeController: this.treeController,
    };
  }

  /**
   * Get the board node from the slot index
   * @param slotIndex The slot index
   * @returns The board with positionInRack = the slot index value
   */
  private getBoardNode(boardNodeList: any[], slotIndex: number): any {
    return boardNodeList.find((bn: any) => bn.object && Number.parseInt(bn.object.positionInRack, 10) === slotIndex);
  }

  /**
   * Get the node of the board cell
   * @param boardNode The board node
   * @param cellIndex The cell index
   * @returns The found cell node
   */
  private getBoardCellNode(boardNode: any, cellIndex: number): any {
    return boardNode && boardNode.nodes
      ? boardNode.nodes.find((node: any) => node.object && Number.parseInt(node.object.number, 10) === cellIndex)
      : null;
  }

  /**
   * Node mouse down event handler
   * @param event The event
   * @param node The node
   */
  public onNodeMouseDown(event: any, node: any) {
    if (
      node &&
      this.treeController &&
      this.treeController.options &&
      this.treeController.options.onNodeMouseDownDefaultCB
    ) {
      this.treeController.options.onNodeMouseDownDefaultCB(event, node);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Node right click event handler
   * @param event The event
   * @param node The node
   */
  public onNodeRightClick(event: any, node: any) {
    if (
      node &&
      this.treeController &&
      this.treeController.options &&
      this.treeController.options.onNodeRightClickDefaultCB
    ) {
      this.treeController.options.onNodeRightClickDefaultCB(event, node);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Get the id of a node
   * @param node The node
   * @returns The node id
   */
  public getNodeId(node: any): string {
    return node && node.key ? node.key : "?";
  }

  /**
   * Get the class list of a node
   * @param node The node
   * @returns String value
   */
  public getNodeClass(node: any): string {
    let res = "node ";
    if (node && node.object) {
      if (node.object.isSelected) {
        res += "node-selected ";
      } else {
        const value = this.getVerificationStateValue(node);
        if (value === ModelVerificationService.verificationStateValues.notVerified) {
          res += "verification-grey ";
        } else if (value === ModelVerificationService.verificationStateValues.verifiedOK) {
          res += "verification-ok ";
        } else if (value === ModelVerificationService.verificationStateValues.verifiedNOK) {
          res += "verification-nok ";
        }
      }
    }
    return res;
  }

  /**
   * Get the verification tooltip data
   * @param node The node
   * @returns The tooltip data
   */
  public getVerificationTooltipData(node: any): any {
    const res = {
      node,
      bo: node ? node.object : null,
      label: null,
      type: null,
      state: null,
      verificationToBeVerified: null,
      verificationState: null,
      verificationComment: null,
      verificationCR: null,
      verificationInputDocument: null,
    };
    const bo = node ? node.object : null;
    if (bo) {
      const vd = this.modelVerificationService.getObjectVerificationData(bo);
      this.modelVerificationService.copyProperties(vd, res);
      res.label = bo.name || bo.label;
      res.type = this.modelPropertiesService.getObjectTypeLabel(bo);
      res.state = this.modelVerificationService.getObjectStateLabel(bo);
    }
    return res;
  }

  /**
   * Get the Verification State Value of a node
   * @param node The node
   * @returns String
   */
  public getVerificationStateValue(node: any) {
    const tbv = this.getVerificationToBeVerifiedValue(node);
    const vst = tbv
      ? this.getNodeObjectMetaDataValue(node, ModelVerificationService.verificationProperties.verificationState)
      : null;
    return tbv ? (vst ? vst : ModelVerificationService.verificationStateValues.notVerified) : "-";
  }

  /**
   * Get the Verification ToBeVerified Value of a node
   * @param node The node
   * @returns String
   */
  public getVerificationToBeVerifiedValue(node: any) {
    return this.modelVerificationService.getObjectIsToBeVerifiedValue(node ? node.object : null);
  }

  /**
   * Get the Verification meta data of a node
   * @param node The node
   * @param propertyName The property name
   * @returns The found meta data, null if not
   */
  public getNodeObjectMetaDataValue(node: any, propertyName: string): any {
    return this.modelVerificationService.getVerificationDataPropertyValue(node ? node.object : null, propertyName);
  }

  /**
   * Function that returns the boolean : the user can make verification
   * @returns bool
   */
  public canVerify() {
    return this.rightsService.canWrite(RightsConst.VERIFICATION);
  }

  /**
   * Function that returns the boolean : the user can answer verification
   * @returns bool
   */
  public canAnswerVerify() {
    return this.rightsService.canWrite(RightsConst.VERIFICATION_ANSWER);
  }

  /**
   * Function that returns the boolean : the user can open verification modal dialog
   * @returns bool
   */
  public canOpenVerifyDialog() {
    return this.canVerify() || this.canAnswerVerify();
  }
}
