import * as FileSaver from "file-saver";

/**
 * Interface of GenericTreeExcelExport
 */
export interface IGenericTreeExcelExport {
  exportToXlsxFile(headerWSData: any, nodes: any[], getTreeMenuNodeDataCB: any, headerLabels: any[], fileName?: string);
}

/**
 * Excel export class
 */
export class GenericTreeExcelExport implements IGenericTreeExcelExport {
  /**
   * Constructor
   */
  public constructor() {}

  /**
   * Export data in excel file
   * @param nodes The nodes
   * @param getDataCb Get data cb
   * @param fileName The file name, "Export" if not defined
   */
  public exportToXlsxFile(
    headerWSData: any,
    nodes: any[],
    getTreeMenuNodeDataCB: any,
    headerLabels: any[],
    fileName?: string
  ) {
    if (getTreeMenuNodeDataCB) {
      const data = this.getTreeMenuExportData(nodes, getTreeMenuNodeDataCB);
      console.log("Exporting to excel file", data);
      this.generateAndSaveXlsxFile(headerWSData, data, headerLabels, fileName ? fileName : "Export");
    }
  }

  /**
   * Export data in excel file
   * @param fileName The file name
   * @param verificationWSData The data
   */
  private generateAndSaveXlsxFile(headerWSData: any, verificationWSData: any, headerLabels: any[], fileName: string) {
    if (verificationWSData.length > 0) {
      import("xlsx").then((xlsx: any) => {
        const workbook = xlsx.utils.book_new();

        const headerWorksheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.sheet_add_aoa(headerWorksheet, headerWSData);
        xlsx.utils.book_append_sheet(workbook, headerWorksheet, "Header");

        const verificationWorksheet = xlsx.utils.json_to_sheet(verificationWSData);
        if (headerLabels && headerLabels.length > 0) {
          xlsx.utils.sheet_add_aoa(verificationWorksheet, [headerLabels]); //, { origin: "A1" });
        }
        xlsx.utils.book_append_sheet(workbook, verificationWorksheet, "Verification");

        const excelBuffer: any = xlsx.write(workbook, { bookType: "xlsx", type: "array" });

        this.saveExcelFile(excelBuffer, fileName);
      });
    }
  }

  /**
   * Save data excel as excel file
   * @param data The data
   * @param fileName The file name
   */
  private saveExcelFile(data: any, fileName: string): void {
    const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const blob: Blob = new Blob([data], {
      type: EXCEL_TYPE,
    });
    const date = new Date();
    const thefileName = fileName + "-" + date.toLocaleDateString() + "-" + date.toLocaleTimeString() + EXCEL_EXTENSION;
    console.log("Saving Excel file to", thefileName);
    // Does not work on android. Refer to https://stackoverflow.com/questions/28950587/filesaver-js-not-working-with-cordova-apps
    // Should use file plugin
    FileSaver.saveAs(blob, thefileName);
  }

  /**
   * For each function
   * @param nodes The nodes
   * @param cb The call back function
   */
  public forEachNodes(nodes: any, cb: any) {
    if (nodes && nodes.forEach) {
      nodes.forEach((node: any) => {
        if (cb) {
          cb(node);
        }
        this.forEachNodes(node.nodes, cb);
      });
    }
  }

  /**
   * Get tree menu data
   * @param nodes The nodes
   * @param getTreeMenuNodeDataCB The get Tree Menu Node Data callback
   * @returns The csv string data
   */
  public getTreeMenuExportData(nodes: any[], getTreeMenuNodeDataCB: any): any[] {
    const res = [];
    if (getTreeMenuNodeDataCB) {
      this.forEachNodes(nodes, (node: any) => {
        if (node && node.isVisible) {
          const data = getTreeMenuNodeDataCB(node);
          if (data) {
            res.push(data);
          }
        }
      });
    }
    return res;
  }
}
