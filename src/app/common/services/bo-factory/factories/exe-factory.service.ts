// import { IFactory, IBoFactoryService } from '../bo-factory.service';

// export class ExeFactory implements IFactory {
//   constructor(
//     private boFactoryService: IBoFactoryService,
//   ) { }

//   buildBOFromType(type, params = null): any {
//     let versionId = null;
//     if (params) { versionId = params.versionId; }

//     let bo = null;

//     if (type == "n1") {
//       bo = {
//         type: type,
//         label: "Nouveau N1",
//         isDeleted: false,
//         nParent: "",
//         color: "#00f",
//         pk: "",
//       };
//     }
//     else if (type == "n2") {
//       bo = {
//         type: type,
//         label: "Nouveau N2",
//         isDeleted: false,
//         nParent: "",
//         color: "#f80",
//         pk: "",
//       };
//     }
//     else if (type == "n2-stmr") {
//       bo = {
//         type: type,
//         label: "Nouveau N2-STMR",
//         isDeleted: false,
//         nParent: "",
//         color: "#f80",
//         pk: "",
//       };
//     }

//     else if (type == "cable") {
//       bo = {
//         type: type,
//         label: "Nouvelle liaison",
//         isDeleted: false,
//         bo1Id: "",
//         bo2Id: "",
//         pkBegin: "",
//         pkEnd: "",
//         cableType: "",
//         zpType: "ZPFU",
//         wireSection: "1mm2",
//         length: 0,
//         wireList: [],
//       };
//     }

//     else if (type == "cable-wire") {
//       bo = {
//         type: type,
//         label: "Fil",
//         isDeleted: false,
//         parentId: "",
//         parent: null,
//       };
//     }

//     else if (["cubical", "rack", "board", "frame", "ns1-frame", "ns1-module", "x-frame", "c-frame", ].includes(type)) {
//       bo = {
//         type: type,
//         label: "" + type,
//         isDeleted: false,
//         parentId: "",
//         parent: null,
//       };

//       if (params && params.boardType != undefined) {
//         bo.boardType = params.boardType;
//         bo.ioList = [];
//         bo.isUsed = true;

//         if (params.label != undefined) {
//           bo.label = params.label;
//         }
//         if (params.index != undefined) {
//           bo.index = params.index;
//         }
//         if (params.isUsed != undefined) {
//           bo.isUsed = params.isUsed;
//         }
//         if (params.boardType == "sm-board") {
//           for(let i = 1; i <= 8; i++) {
//         	  bo.ioList = bo.ioList.concat(this.buildBOFromType("io", { label: bo.label + "-L" + i + "A", parent: bo, ioType: "o", } ));
//         	  bo.ioList = bo.ioList.concat(this.buildBOFromType("io", { label: bo.label + "-L" + i + "B", parent: bo, ioType: "o", } ));
//           }
//           //console.log(">> bo", bo);
//         }
//         if (params.boardType == "pm-board") {
//           for(let i = 1; i <= 8; i++) {
//         	  bo.ioList = bo.ioList.concat(this.buildBOFromType("io", { label: bo.label + "-S" + i + "", parent: bo, ioType: "o", } ));
//           }
//           for(let i = 1; i <= 8; i++) {
//         	  bo.ioList = bo.ioList.concat(this.buildBOFromType("io", { label: bo.label + "-E" + i + "", parent: bo, ioType: "i", } ));
//           }
//         }
//         else if (params.boardType == "im-board") {
//           for(let i = 1; i <= 16; i++) {
//         	  bo.ioList = bo.ioList.concat(this.buildBOFromType("io", { label: bo.label + "-E" + i, parent: bo, ioType: "i", } ));
//           }
//         }
//         else if (params.boardType == "om-board") {
//           for(let i = 1; i <= 16; i++) {
//         	  bo.ioList = bo.ioList.concat(this.buildBOFromType("io", { label: bo.label + "-S" + i, parent: bo, ioType: "o", } ));
//           }
//         }
//         else if (params.boardType == "ns1-module") {
//           for(let i = 1; i <= 8; i++) {
//         	  bo.ioList = bo.ioList.concat(this.buildBOFromType("io", { label: bo.label + "-" + i, parent: bo, ioType: "x", } ));
//           }
//         }
//       }
//     }

//     else if (["io"].includes(type)) {
//       bo = {
//         type: type,
//         label: "" + type, //TODO
//         isDeleted: false,
//         parentId: "",
//         parent: null,
//         variableName: "",
//       };
//     }

//     return this.boFactoryService.postCreateBo(bo, params);
//   }
// }
