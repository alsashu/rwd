import { IDiagramService } from "../../diagram/diagram.service";
import { IDiagramLayout } from "./idiagram.layout";

export class DiagramLayout implements IDiagramLayout {
  private layoutType = "table";
  private animationFinished = true;

  constructor(private diagramService: IDiagramService) {}

  execute() {
    console.log(">> execute start");
    this.animationFinished = false;
    this.doAnimation();
    console.log(">> execute end");
  }

  doAnimation() {
    console.log(">> animation start");
    this.animationFinished = true;
    let diagram = this.diagramService.diagram;
    let svgObjects = diagram.svgObject.svgObjects;
    if (svgObjects.length) {
      let qs = this.diagramService.queryService;

      let coord = { x: 0, y: 0 };
      let lc = { l: 50, c: 50 };
      let colNb = 4;

      let orgCoords = [];
      svgObjects.forEach((svgObject, i) => {
        orgCoords.push({ x: svgObject.x, y: svgObject.y });
      });
      let orgCoord = orgCoords[0];

      let k = 0.0;
      let kStep = 1.0 / 1;
      this.animationFinished = false;
      let targetReached = false;
      //let interval = setInterval(() => {

      let t0 = Date.now();
      while (!this.animationFinished && !targetReached && Date.now() - t0 < 2 * 1000) {
        k += kStep;
        if (k <= 1.0) {
          console.log(">> animation k =", k);
          targetReached = true;
          svgObjects.forEach((svgObject, i) => {
            lc.l = Math.floor(i / colNb);
            lc.c = i % colNb;
            coord.x = orgCoord.x + lc.c * 200;
            coord.y = orgCoord.y + lc.l * 100;
            let tmpCoord = {
              x: orgCoords[i].x + (coord.x - orgCoords[i].x) * k,
              y: orgCoords[i].y + (coord.y - orgCoords[i].y) * k,
            };

            if (svgObject.x != tmpCoord.x || svgObject.y != tmpCoord.y) {
              targetReached = false;
            }
            qs.modify(svgObject, "x", tmpCoord.x);
            qs.modify(svgObject, "y", tmpCoord.y);

            console.log(">> animation k =", k, svgObject.x, svgObject.y);
          });

          let t1 = Date.now();
          this.diagramService.refreshDiagram();
          this.diagramService.refresh();

          while (k < 1.0 && Date.now() - t1 < 100) {
            this.diagramService.refresh();
          }
        } else {
          this.animationFinished = true;
          //clearInterval(interval);
        }
      }
      //}, 100);
    }
    console.log(">> animation returning");
  }
}
