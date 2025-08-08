// import { v4 as uuid } from 'uuid';
// import { cloneDeep } from 'lodash';
// import { IFactory, IBoFactoryService } from '../bo-factory.service';

// export class DiagramFactory implements IFactory {
//   // Diagram default options
//   layerOptions = {
//     libraryIdFilters: [
//       { label: "Tout", id: "*", isVisible: true, isEnabled: true, },
//       { label: "Repère PK", tags: ["pk"], ids: ["repere-pk-1", "echelle-pk-script-1", ], isVisible: true, isEnabled: true, },
//       { label: "Voies", tags: ["track"], ids: ["voie-1", "voie-2", "voie-bezier-1", "voie-bezier-2", "no-voie-1", "sens-voie-1", ], isVisible: true, isEnabled: true, },
//       { label: "Signaux", tags: ["signal"], ids: ["signal-1-NE", "signal-1-NW", "signal-1-SE", "signal-1-SW", "signal-1", "bloc-script-1", ], isVisible: true, isEnabled: true, },
//       { label: "Aiguilles", tags: ["point"], ids: ["point-1", ], isVisible: true, isEnabled: true, },
//       { label: "Pédales", tags: ["pedal"], ids: ["pedal-1", ], isVisible: true, isEnabled: true, },
//       { label: "Trains", tags: ["train"], ids: ["train-1", ], isVisible: true, isEnabled: true, },
//       { label: "Autres objects voie", tags: ["other-sig"], ids: ["joint-1", ], isVisible: true, isEnabled: true, },
//       { label: "Connexions", tags: ["track-connections"], ids: ["track-connection-1", ], isVisible: true, isEnabled: true, },
//       { label: "Centres", tags: ["n"], ids: ["n1-1", "n2-1", "n2-stmr-1", "n3", ], isVisible: true, isEnabled: true, },
//       { label: "Traversées", tags: ["traverse"], ids: ["traverse-1", ], isVisible: true, isEnabled: true, },
//       { label: "Câbles", tags: ["cable"], ids: ["cable-1", ], isVisible: true, isEnabled: true, },
//       { label: "Déroulage", tags: ["wiring-diagram"], ids: ["wiring-diagram-1", ], isVisible: true, isEnabled: true, },
//       { label: "Profils", tags: ["profile"], ids: ["slope-profile-1", "curve-profile-1"], isVisible: true, isEnabled: true, },
//       { label: "Images", tags: ["image"], ids: ["image-1"], isVisible: true, isEnabled: true, },
//       { label: "Fils", tags: ["wire"], ids: ["wire-1", ], isVisible: true, isEnabled: true, },
//       { label: "Bornes", tags: ["pin"], ids: ["pin-1", ], isVisible: true, isEnabled: true, },
//       { label: "Composants", tags: ["component"], ids: ["component-1", ], isVisible: true, isEnabled: true, },
//       { label: "Vérification", tags: ["verification"], ids: ["note-1", ], isVisible: true, isEnabled: true, },
//     ],

//     otherFilters: [
//       { label: "Rouge et Jaune", id: "ray-filter", isVisible: true, attribute: "isRAYVisible", },
//       { label: "Rouge", id: "red-filter", isVisible: true, attribute: "isRedVisible", },
//       { label: "Jaune", id: "yellow-filter", isVisible: true, attribute: "isYellowVisible", },
//     ],

//     allVisible: true,
//     allEnabled: true,

//     isRAYVisible: true,
//     isRedVisible: true,
//     isYellowVisible: true,

//     visibleLibraryIds: [],
//     enabledLibraryIds: [],
//   };

//   constructor(
//     private boFactoryService: IBoFactoryService,
//   ) { }

//   buildBOFromType(type, params = null): any {
//     let versionId = null;
//     if (params) { versionId = params.versionId; }

//     let bo = null;

//     if (type == "diagram") {
//       bo = {
//         type: type,
//         subType: "sig-diagram",
//         versionId: versionId,
//         label: "Nouveau schéma",
//         width: 10000,
//         height: 4000,
//         svgObject: { type: "root", svgObjects: [], },
//         layerOptions: this.buildBOFromType("layerOptions"),
//       };
//     }
//     else if (type == "layerOptions") {
//       bo = cloneDeep(this.layerOptions);
//     }

//     if (bo) {
//       if (!bo.id) { bo.id = uuid(); }

//       if (params) {
//         if (params.parent) {
//           if (!params.parent.id) { params.parent.id = uuid(); }
//           bo.parentId = params.parent.id;
//           bo.parent = params.parent;
//         }
//         if (params.label != undefined) {
//           bo.label = params.label;
//         }
//         if (params.index != undefined) {
//           bo.index = params.index;
//         }
//         if (params.ioType != undefined) {
//           bo.ioType = params.ioType;
//         }
//       }
//     }

//     return bo;
//   }
// }
