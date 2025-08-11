import { GraphicViewComponent } from "../graphic-view.component";
import { ASysArtDiagramFactory } from "./asysart-diagram-factory";

export class OnBoardPhysicalArchitectureDiagramFactory extends ASysArtDiagramFactory {
  constructor(graphicViewComponent: GraphicViewComponent) {
    super(
      graphicViewComponent,
      "onBoardArchitectureVis",
      "sysart-defaut-equipment-1",
      new Map([
        ["ONBOARDCUBICLE", { libraryId: "cubicle-1", isARect: true }],
        ["CAR", { libraryId: "car-1", isARect: true }],
        ["TRAIN", { libraryId: "train-onboard-1", isARect: true }],
        ["BACKBONENETWORK", { libraryId: "backbone-network-1", isARect: false }],
        ["BACKBONENETWORKCONNECTION", { libraryId: "backbone-network-connection-1", isARect: true }],
        ["PHYSICALLINK", { libraryId: "physical-link-1", isARect: false }],
        ["ETHERNETPORT", { libraryId: "port-1", isARect: true }],
        ["SERIALPORT", { libraryId: "port-1", isARect: true }],
      ])
    );
  }
}
