// import { v4 as uuid } from 'uuid';
// import { IFactory, IBoFactoryService } from '../bo-factory.service';
// import { ModelConstService } from '../../../../services/model/model-const.service';

// export class LibraryFactory implements IFactory {
//   constructor(
//     private boFactoryService: IBoFactoryService,
//   ) { }

//   buildBOFromType(type, params = null): any {
//     let bo = null;

//     if (type == ModelConstService.LIBRARY_FOLDER_TYPE) {
//       bo = {
//         id: "Nouveau Dossier",
//         type: ModelConstService.LIBRARY_FOLDER_TYPE,
// //TODO        content: selectedObject.content,
//       };
//     }
//     else if (type == ModelConstService.LIBRARY_PROTOTYPE_TYPE) {
//       bo = {
//         id: uuid(),
//         label: "Nouveau composant",
//         type: ModelConstService.LIBRARY_PROTOTYPE_TYPE,

//         controlerData: {
//           tags: [],
//           attributeInit: [],
//           handles: [],
//         },
//         svgObject: {
//           svgObjects: [],
//         },
//       };
//     }
//     else if (type == ModelConstService.DIAGRAM_PROTOTYPE_TYPE) {
//       bo = {
//         id: uuid(),
//         label: "Nouveau schéma",
//         type: ModelConstService.DIAGRAM_PROTOTYPE_TYPE,
//         subType: "front-diagram",

//         diagram: this.boFactoryService.buildBOFromType("diagram"),
//         // diagram: {
//         //   id: uuid(),
//         //   width: 10000,
//         //   height: 4000,
//         //   svgObject: {
//         //     type: "root",
//         //     svgObjects: [],
//         //   },
//         //   graphicObject: {
//         //     type: "root",
//         //     children: [],
//         //   }
//         // },
//       };
//     }
//     else if (type == ModelConstService.RULE_PROTOTYPE_TYPE) {
//       let id = uuid();
//       bo = {
//         id: id,
//         label: "Nouvelle règle",
//         type: ModelConstService.RULE_PROTOTYPE_TYPE,
//         controlerData: {
//           script: {
//             id: id + "-script",
//             type: "script",
//             code: "",
//           }
//         },
//       };
//     }

//     return this.boFactoryService.postCreateBo(bo, params);
//   }
// }
