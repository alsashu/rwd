import { GraphicViewComponent } from "../graphic-view.component";
import { ASysArtDiagramFactory } from "./asysart-diagram-factory";

export class TracksidePhysicalArchitectureDiagramFactory extends ASysArtDiagramFactory {
  constructor(graphicViewComponent: GraphicViewComponent) {
    super(
      graphicViewComponent,
      "trackSideArchitectureVis",
      "sysart-defaut-equipment-1",
      new Map([
        ["CUBICLE", { libraryId: "cubicle-1", isARect: true }],
        ["ASSEMBLY", { libraryId: "assembly-1", isARect: true }],
        ["EQUIPMENTROOM", { libraryId: "equipment-room-1", isARect: true }],
        ["BACKBONENETWORK", { libraryId: "backbone-network-1", isARect: false }],
        ["BACKBONENETWORKCONNECTION", { libraryId: "backbone-network-connection-1", isARect: true }],
        ["PHYSICALLINK", { libraryId: "physical-link-1", isARect: false }],
        ["ETHERNETPORT", { libraryId: "port-1", isARect: true }],
        ["SERIALPORT", { libraryId: "port-1", isARect: true }],
      ])
    );
  }
}
