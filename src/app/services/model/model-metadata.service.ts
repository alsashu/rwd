export interface IModelMetadataService {
  modelConfig: any;
}

export class ModelMetadataService implements IModelMetadataService {
  public modelConfig = {
    boLinks: [
      ["ref", "refObject"],
      ["componentIDRef", "componentIDObject"],
      ["physicalLinkCharacteristicRef", "physicalLinkCharacteristic"],
      ["backboneNetworkRef", "backboneNetwork"],
    ],

    cleanBoProperties: ["isSelected"],

    cleanSvgObjectProperties: [
      "controler",
      "isSelected",
      "safeStyle",
      "bo",
      "attributeInit",
      "selType",
      "script",
      "diagram",
      "parentDiagram",
    ],

    excludedProperties: ["svgObjects"],

    excludedChangeProperties: [
      "id",
      "type",
      "projectId",
      "isSelected",
      "isCollapsed",

      // "changeStatus",
      // "checkStatus",
      // "checkStatusComment",
      // "checkStatusCr",
    ],

    excludedCheckProperties: ["id", "type", "projectId", "isSelected", "isCollapsed"],

    boInitPropertyList: [],
    boSearchPropertyList: [],
    boSelectPropertyList: [],

    boChangeTrackPropertyList: [],
    boCheckStatusPropertyList: [],
    boCheckStatusChildrenList: [],

    modelMap: new Map([
      [
        "default",
        {
          isToInit: true,
          isTreeNode: true,
          isFolder: false,
          isCollapsed: true,
          isSearchable: true,
          isSelectable: true,
          isChangeTracked: false,
          isToBeChecked: true,
          isToBeCheckedChildren: false,
        },
      ],
      [
        "parent",
        {
          isToInit: false,
          isTreeNode: false,
          isFolder: false,
          isCollapsed: true,
          isSearchable: false,
          isSelectable: false,
          isChangeTracked: false,
          isToBeChecked: false,
          isToBeCheckedChildren: false,
        },
      ],

      [
        "objectMemo",
        {
          label: "Objet mémo",
          isToInit: false,
          isTreeNode: false,
          isSearchable: false,
          isSelectable: false,
          isChangeTracked: false,
        },
      ],
      [
        "importMemento",
        {
          label: "Memento import",
          isToInit: false,
          isTreeNode: false,
          isSearchable: false,
          isSelectable: false,
          isChangeTracked: false,
        },
      ],
      [
        "changeMemento",
        {
          label: "Memento modifications",
          isToInit: false,
          isTreeNode: false,
          isSearchable: false,
          isSelectable: false,
          isChangeTracked: false,
        },
      ],

      ["rules", { label: "Règles", isToInit: false, isTreeNode: false, isFolder: true, isCollapsed: true }],
      ["rule", { label: "Règle", isToInit: false, isTreeNode: false, isFolder: false, isCollapsed: true }],

      ["dataObjects", { label: "Objets", isFolder: true, isCollapsed: true }],
      ["dataObject", { parent: "dataObjects", label: "Objet" }],

      ["projects", { label: "Projets", isFolder: true, isCollapsed: false }],
      ["project", { label: "Projet", isFolder: true, isCollapsed: false }],

      ["dataModel", { label: "Données métier", isFolder: true, isCollapsed: false, isToBeCheckedChildren: true }],
      ["infrastructure", { label: "Infrastructure", isFolder: true, isToBeCheckedChildren: true }],
      ["lines", { parent: "others", label: "Lignes", isFolder: true, isToBeCheckedChildren: true }],
      ["tracks", { parent: "others", label: "Voies/Zones", isFolder: true, isToBeCheckedChildren: true }],
      ["trackObjects", { parent: "others", label: "Objets Voies", isFolder: true, isToBeCheckedChildren: true }],
      ["signals", { parent: "signals", label: "Signaux", isFolder: true, isToBeCheckedChildren: true }],
      ["points", { parent: "points", label: "Aiguilles", isFolder: true, isToBeCheckedChildren: true }],
      ["pedals", { parent: "pedals", label: "Pédales", isFolder: true, isToBeCheckedChildren: true }],
      ["others", { label: "Autres", isFolder: true, isToBeCheckedChildren: true }],
      ["cables", { label: "Liens N/Câbles", isFolder: true, isToBeCheckedChildren: true }],
      ["exeData", { label: "Exe", isFolder: true, isToBeCheckedChildren: true }],
      ["routeData", { label: "Enclenchement", isFolder: true, isToBeCheckedChildren: true }],
      ["routes", { label: "Itinéraires", isFolder: true, isToBeCheckedChildren: true }],
      ["route", { label: "Itinéraire", parent: "routes", isChangeTracked: false }],
      ["trainData", { label: "Données trains", isFolder: true, isToBeCheckedChildren: true }],
      ["trains", { label: "Trains", isFolder: true, isToBeCheckedChildren: true }],
      ["train", { label: "Train", parent: "trains", isChangeTracked: false }],
      ["circulations", { label: "Circulations", isFolder: true, isToBeCheckedChildren: true }],
      ["circulation", { label: "Circulation", parent: "circulations", isChangeTracked: false }],
      ["nList", { label: "Centres", isFolder: true, isToBeCheckedChildren: true }],
      ["materials", { label: "Matériels", isFolder: true, isToBeCheckedChildren: true }],
      ["material", { label: "Matériel", isFolder: true, isToBeCheckedChildren: true }],

      ["graphicalModel", { label: "Schémas", isFolder: true, isCollapsed: false, isChangeTracked: false }],
      ["libraries", { label: "Bibliothèques", isTreeNode: true, isSearchable: false, isSelectable: false }],

      ["diagrams", { label: "Schémas divers", isFolder: true, isCollapsed: false }],
      ["sigDiagrams", { label: "Schéma de signalisation", isFolder: true, isCollapsed: false }],
      ["interfaceDiagrams", { label: "Interfaces campagne", isFolder: true, isCollapsed: false }],
      ["gridPatternDiagrams", { label: "Grilles type", isFolder: true, isCollapsed: false }],
      ["frontDiagrams", { label: "Vues façades", isFolder: true, isCollapsed: false }],
      ["workflowDiagrams", { label: "Workflows", isFolder: true, isCollapsed: false }],

      [
        "diagram",
        {
          label: "Schéma",
          isFolder: true,
          isCollapsed: false,
          parent: "diagrams",
          parents: [
            { parent: "sigDiagrams", subType: "sig-diagram" },
            { parent: "interfaceDiagrams", subType: "trackside-interface" },
            { parent: "gridPatternDiagrams", subType: "grid-pattern" },
            { parent: "frontDiagrams", subType: "front-diagram" },
            { parent: "workflowDiagrams", subType: "workflow-diagram" },
          ],
        },
      ],

      [
        "svgObject",
        { label: "Objet schéma", isTreeNode: false, isSearchable: false, isSelectable: false, isToBeChecked: false },
      ],
      ["svgObjects", { label: "Objets schéma", isTreeNode: false, isSearchable: false, isSelectable: false }],

      ["library", { label: "Bibliothèque", parent: "libraryObjects", isChangeTracked: false }],
      [
        "libraryObjects",
        { label: "Objets bibliothèque", isTreeNode: true, skipList: true, isSearchable: false, isSelectable: false },
      ],
      ["libraryObject", { label: "Objet bibliothèque", parent: "libraryObjects", isChangeTracked: false }],

      ["projectSettings", { label: "Paramètres projet", parent: "project", isChangeTracked: false }],

      ["appSettings", { label: "Paramètres application", parent: "model", isChangeTracked: false }],
      ["appOptions", { label: "Options", parent: "appSettings", isChangeTracked: false }],

      // Xmi model
      ["metaModel", { label: "Méta-Modèle", parent: "appSettings", isChangeTracked: false }],
      ["Model", { label: "Modèle", isTreeNode: true, isSearchable: true, isSelectable: false, isToBeChecked: false }],
      [
        "packagedElement",
        { label: "PackagedElement", isTreeNode: true, isSearchable: true, isSelectable: false, isToBeChecked: false },
      ],

      ["scripts", { label: "Scripts", isTreeNode: true, isFolder: true, isCollapsed: false }],
      ["script", { label: "Script", parent: "scripts", isChangeTracked: false }],

      [
        "workflowData",
        {
          label: "Workflow version",
          isTreeNode: true,
          isFolder: true,
          isCollapsed: false,
          isChangeTracked: false,
          isToBeCheckedChildren: false,
        },
      ],
      [
        "workflows",
        {
          label: "Workflows",
          isTreeNode: true,
          isFolder: true,
          isCollapsed: false,
          isChangeTracked: false,
          isToBeCheckedChildren: false,
        },
      ],
      [
        "workflow",
        { label: "Workflow", isTreeNode: true, isSearchable: true, isSelectable: false, isToBeChecked: false },
      ],
      [
        "wfActivities",
        {
          label: "Activités",
          isTreeNode: true,
          isFolder: true,
          isCollapsed: false,
          isChangeTracked: false,
          isToBeCheckedChildren: false,
        },
      ],
      [
        "wfActivity",
        { label: "Activité", isTreeNode: true, isSearchable: true, isSelectable: false, isToBeChecked: false },
      ],

      ["line", { label: "Ligne", parent: "lines", isChangeTracked: true }],
      ["track", { label: "Voie", parent: "tracks", isChangeTracked: true }],
      ["signal", { label: "Signal", parent: "signals", isChangeTracked: true }],
      ["point", { label: "Aiguille", parent: "points", isChangeTracked: true }],
      ["pedal", { label: "Pédale", parent: "pedals", isChangeTracked: true }],
      ["other", { label: "Autre", parent: "others", isChangeTracked: true }],

      ["ligne", { label: "Ligne", parent: "lines", isChangeTracked: true }],
      ["voie", { label: "Voie", parent: "tracks", isChangeTracked: true }],
      ["signal", { label: "Signal", parent: "signals", isChangeTracked: true }],
      ["aiguille", { label: "Aiguille", parent: "points", isChangeTracked: true }],
      ["autre", { label: "Autre", parent: "others", isChangeTracked: true }],

      ["n1", { label: "N1", parent: "nList", isChangeTracked: true }],
      ["n2", { label: "N2", parent: "nList", isChangeTracked: true }],
      ["n2-stmr", { label: "STM-R", parent: "nList", isChangeTracked: true }],
      ["n3", { label: "N3", parent: "nList", isChangeTracked: true }],

      ["cable", { label: "Câble", parent: "cables" }],

      ["cubical", { label: "Armoire", parent: "materials" }],
      ["rack", { label: "Rack", parent: "materials" }],
      ["board", { label: "Carte", parent: "materials" }],
      ["frame", { label: "Châssis", parent: "materials" }],
      ["ns1-frame", { label: "Châssis NS1", parent: "materials" }],
      ["ns1-module", { label: "Module NS1", parent: "materials" }],
      ["x-frame", { label: "Châssis-X", parent: "materials" }],
      ["c-frame", { label: "Châssis-C", parent: "materials" }],

      ["ioList", { label: "Liste E/S", isFolder: true, isCollapsed: true }],
      ["io", { label: "E/S" }],

      ["pairList", { label: "Paires", isFolder: true, isCollapsed: true }],
      ["cable-pair", { label: "Paire" }],
      ["wireList", { label: "Fils", isFolder: true, isCollapsed: true }],
      ["cable-wire", { label: "Fil" }],

      // railml objects
      ["children", { label: "...", isChildrenList: true }],

      ["functionalInfrastructure", { label: "Infrastructure fonctionnelle", parent: "infrastructure" }],
      ["switch", { label: "Aiguille", parent: "switch", isChangeTracked: true }],
      ["topology", { label: "Topologie" }],
      ["trackTopology", { label: "trackTopology" }],
      ["trackBegin", { label: "trackBegin", isChangeTracked: true }],
      ["trackEnd", { label: "trackEnd", isChangeTracked: true }],
      ["connection", { label: "connection" }],
      ["bufferStop", { label: "bufferStop", isChangeTracked: true }],
      ["connections", { label: "connections" }],
      ["trackElements", { label: "trackElements" }],
      ["platformEdges", { label: "platformEdges" }],
      ["platformEdge", { label: "platformEdge", isChangeTracked: true }],
      ["speedChanges", { label: "speedChanges" }],
      ["speedChange", { label: "speedChange", isChangeTracked: true }],
      ["levelCrossings", { label: "levelCrossings" }],
      ["levelCrossing", { label: "levelCrossing", isChangeTracked: true }],
      ["crossSections", { label: "crossSections" }],
      ["crossSection", { label: "crossSection", isChangeTracked: true }],
      ["ocsElements", { label: "ocsElements" }],
      ["speed", { label: "speed", isChangeTracked: true }],
      ["etcs", { label: "etcs" }],
      ["trainDetectionElements", { label: "trainDetectionElements" }],
      ["trainDetectionElement", { label: "trainDetectionElement" }],
      ["trackCircuitBorder", { label: "trackCircuitBorder", isChangeTracked: true }],
      ["trainDetector", { label: "trainDetector", isChangeTracked: true }],
      ["trainProtectionElements", { label: "trainProtectionElements" }],
      ["trainProtectionElement", { label: "trainProtectionElement", isChangeTracked: true }],
      ["speedChange", { label: "speedChange", isChangeTracked: true }],
      ["derailers", { label: "derailers" }],
      ["derailer", { label: "derailer", isChangeTracked: true }],
      ["trackGroups", { label: "trackGroups" }],

      ["linearLocation", { label: "linearLocation" }],
      ["associatedNetElement", { label: "associatedNetElement" }],
      ["length", { label: "length" }],
      ["spotLocation", { label: "spotLocation" }],
      ["linearCoordinate", { label: "linearCoordinate" }],
      ["protection", { label: "protection" }],
      ["linearCoordinateBegin", { label: "linearCoordinateBegin" }],
      ["linearCoordinateEnd", { label: "linearCoordinateEnd" }],
      ["infrastructureState", { label: "infrastructureState" }],
      ["loadingGauge", { label: "loadingGauge" }],
      ["operationalPoints", { label: "operationalPoints" }],
      ["operationalPoint", { label: "operationalPoint" }],
      ["platforms", { label: "platforms" }],
      ["platform", { label: "platform" }],
      ["etcsSignal", { label: "etcsSignal" }],

      // tpe
      [
        "infrastructureVisualizations",
        { label: "Schémas infrastructure TPE", isFolder: true, isCollapsed: false, isChangeTracked: false },
      ],
      [
        "visualization",
        {
          label: "Schéma infrastructure TPE",
          isFolder: false,
          isCollapsed: false,
          parent: "infrastructureVisualizations",
        },
      ],
      [
        "GenericADM:architecture",
        { label: "Architecture", isFolder: true, isCollapsed: false, isChangeTracked: false },
      ],
      [
        "GenericADM:logicalElements",
        { label: "Logical Elements", isFolder: true, isCollapsed: false, isChangeTracked: false },
      ],
      [
        "GenericADM:typicalDiagrams",
        { label: "Typical Diagrams", isFolder: true, isCollapsed: false, isChangeTracked: false },
      ],
      ["GenericADM:typicalITFDiagrams", { label: "typicalITFDiagrams" }],
      ["GenericADM:typicalITFDiagram", { label: "typicalITFDiagram" }],

      ["GenericADM:components", { label: "Components", isFolder: true, isCollapsed: false, isChangeTracked: false }],
      ["GenericADM:boardCells", { label: "boardCells", isFolder: true, isCollapsed: false, isChangeTracked: false }],
      ["GenericADM:boardCell", { label: "boardCell" }],
      [
        "GenericADM:transformers",
        { label: "transformers", isFolder: true, isCollapsed: false, isChangeTracked: false },
      ],
      ["GenericADM:transformer", { label: "transformer" }],
      ["GenericADM:cableWires", { label: "cableWires", isFolder: true, isCollapsed: false, isChangeTracked: false }],
      ["GenericADM:cableWire", { label: "cableWire" }],

      [
        "GenericADM:equipmentRooms",
        { label: "Equipment Rooms", isFolder: true, isCollapsed: false, isChangeTracked: false },
      ],
      ["GenericADM:equipmentRoom", { label: "equipmentRoom" }],
      ["GenericADM:assemblies", { label: "Assemblies", isFolder: true, isCollapsed: false, isChangeTracked: false }],
      ["GenericADM:assembly", { label: "Assembly" }],
      ["GenericADM:cubicles", { label: "Cubicles", isFolder: true, isCollapsed: false, isChangeTracked: false }],
      ["GenericADM:cubicle", { label: "Cubicle" }],
      ["GenericADM:equipments", { label: "Equipments", isFolder: true, isCollapsed: false, isChangeTracked: false }],
      ["GenericADM:equipment", { label: "Equipment" }],
      [
        "GenericADM:ethernetPorts",
        { label: "Ethernet Ports", isFolder: true, isCollapsed: false, isChangeTracked: false },
      ],
      ["GenericADM:ethernetPort", { label: "Ethernet Port" }],

      ["any", { label: "Propriété", isFolder: false, isCollapsed: false }],
      ["boolean", { label: "Propriété", isFolder: false, isCollapsed: false }],
    ]),

    boParentsMap: new Map([
      [
        "functionalInfrastructure",
        { path: "version.dataModel.infrastructure.functionalInfrastructure", property: "children" },
      ],
      ["others", { path: "version.dataModel.infrastructure.functionalInfrastructure", property: "children" }],

      ["infrastructure", { path: "version.dataModel", property: "infrastructure" }],

      ["lines", { path: "version.dataModel.infrastructure", property: "lines" }],
      ["tracks", { path: "version.dataModel.infrastructure", property: "tracks" }],
      ["signals", { path: "version.dataModel.infrastructure.trackObjects", property: "signals", label: "Signaux" }],
      ["points", { path: "version.dataModel.infrastructure.trackObjects", property: "points", label: "Aiguilles" }],
      ["pedals", { path: "version.dataModel.infrastructure.trackObjects", property: "pedals", label: "Pédales" }],
      ["nList", { path: "version.dataModel.exeData", property: "nList", label: "N" }],
      ["cables", { path: "version.dataModel.exeData", property: "cables", label: "Câbles" }],
      ["materials", { path: "version.dataModel.exeData", property: "materials", label: "Matériels" }],

      ["routes", { path: "version.dataModel.routeData", property: "routes", label: "Itinéraires" }],
      ["trains", { path: "version.dataModel.trainData", property: "trains", label: "Trains" }],

      ["diagrams", { path: "version.graphicalModel", property: "diagrams" }],
      ["sigDiagrams", { path: "version.graphicalModel", property: "sigDiagrams" }],
      ["interfaceDiagrams", { path: "version.graphicalModel", property: "interfaceDiagrams" }],
      ["gridPatternDiagrams", { path: "version.graphicalModel", property: "gridPatternDiagrams" }],
      ["frontDiagrams", { path: "version.graphicalModel", property: "frontDiagrams" }],
      ["workflowDiagrams", { path: "version.graphicalModel", property: "workflowDiagrams" }],

      ["scripts", { path: "version", property: "scripts" }],
      ["dataObjects", { path: "version", property: "dataObjects" }],
    ]),
  };

  constructor() {
    this.initPropertLists();
  }

  public initPropertLists() {
    this.modelConfig.boInitPropertyList = [];
    this.modelConfig.boSearchPropertyList = [];
    this.modelConfig.boSelectPropertyList = [];
    this.modelConfig.boChangeTrackPropertyList = [];
    this.modelConfig.boCheckStatusPropertyList = [];

    const defaultConfig = this.modelConfig.modelMap.get("default");
    this.modelConfig.modelMap.forEach((value, key) => {
      for (const prop in defaultConfig) {
        if (value[prop] === undefined) {
          value[prop] = defaultConfig[prop];
        }
      }
      if (value.isToInit) {
        this.modelConfig.boInitPropertyList.push(key);
      }
      if (value.isSearchable) {
        this.modelConfig.boSearchPropertyList.push(key);
      }
      if (value.isSelectable) {
        this.modelConfig.boSelectPropertyList.push(key);
      }
      if (value.isChangeTracked) {
        this.modelConfig.boChangeTrackPropertyList.push(key);
      }
      if (value.isToBeChecked) {
        this.modelConfig.boCheckStatusPropertyList.push(key);
      }
      if (value.isToBeCheckedChildren) {
        this.modelConfig.boCheckStatusChildrenList.push(key);
      }
    });
  }
}
