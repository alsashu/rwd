import { GraphicViewComponent } from "../graphic-view.component";
import { ASysArtDiagramFactory } from "./asysart-diagram-factory";

export class LogicalInterfaceDiagramFactory extends ASysArtDiagramFactory {
  constructor(graphicViewComponent: GraphicViewComponent, page: string) {
    super(
      graphicViewComponent,
      "logicalArchitectureVis",
      "logical-interface-equipment-1",
      new Map([
        ["EQUIPMENT", { libraryId: "logical-interface-equipment-1", isARect: true }],
        ["INTERFACECONNECTION", { libraryId: "interface-connection-1", isARect: false }],
      ]),
      page
    );
  }
}
