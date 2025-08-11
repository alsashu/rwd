// import { v4 as uuid } from 'uuid';
// import { IFactory, IBoFactoryService } from '../bo-factory.service';

// export class ProjectFactory implements IFactory {
//   constructor(
//     private boFactoryService: IBoFactoryService,
//   ) { }

//   public buildBOFromType(type: any, params: any = null): any {
//     let versionId = null;
//     if (params) { versionId = params.versionId; }

//     let bo = null;
//     if (type == "project") {
//       bo = {
//         type: type,
//         id: uuid(),
//         label: "Nouveau Projet",
//         isDeleted: false,
// 		    phases : [
//           this.buildBOFromType("phase")
//         ]
//       };
//     }
//     else if (type == "phase") {
//       bo = {
//         type: type,
// 		    id: uuid(),
// 		    label: "Nouvelle Phase",
//         isDeleted: false,
// 			  versions : [
//           this.buildBOFromType("version")
//         ]
//       };
//     }
//     else if (type == "version") {
//       bo = {
//         type: type,
// 		    id: uuid(),
// 		    label: "Version 1",
//         isDeleted: false,

//         dataModel: {
//           type: "dataModel",
//           id: uuid(),
//           infrastructure: {
//             type: "infrastructure",
//             id: uuid(),
//             lines: [],
//             tracks: [],
//             trackObjects: {
//               id: uuid(),
// 						  signals: [],
// 						  points: [],
// 						  others: [],
//             },
//           },
//           exeData: {
//             type: "exeData",
//             id: uuid(),
//             nList: [],
//             cables: [],
//             materials: [],
//           },
//         },
//         graphicalModel: {
//           type: "graphicalModel",
//           id: uuid(),
//           diagrams: [],
//           sigDiagrams: [],
//           interfaceDiagrams: [],
//           gridPatternDiagrams: [],
//         },
//         scripts: [],
//         //workflowData: {}, //TODO
//       };
//     }

//     else if (type == "script") {
//       bo = {
//         type: type,
//         versionId: versionId,
//         label: "Nouveau script",
//         code: "",
//       };
//     }

//     return this.boFactoryService.postCreateBo(bo, params);
//   }
// }
