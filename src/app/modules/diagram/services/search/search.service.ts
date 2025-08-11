import { IDiagramService } from "../diagram/diagram.service";

export class SearchService {
  constructor(public diagramService: IDiagramService) {}

  // TODO: !, |, &, (), @type, @botype ,@id, @boid, @tobeverified...
  public search(value: string): any {
    let svgObjects = this.diagramService.getSelectableSvgObjects();
    let foundSvgObjects = [];
    if (value != null && svgObjects && svgObjects.forEach) {
      if (["*", "all"].includes(value)) {
        foundSvgObjects = svgObjects;
      } else if (["", "none"].includes(value)) {
      } else {
        let svgSearchProperties = ["libraryId", "label"];
        let boSearchProperties = ["type", "label", "id"];

        foundSvgObjects = svgObjects.filter(
          (svg: any) =>
            this.searchInProperties(svg, svgSearchProperties, value.toUpperCase()) ||
            (svg.bo && this.searchInProperties(svg.bo, boSearchProperties, value.toUpperCase()))
        );
      }
    }
    return { svgObjects: svgObjects, foundSvgObjects: foundSvgObjects };
  }

  private searchInProperties(object: any, properties: string[], value: string): boolean {
    let res = false;
    properties.forEach((p: any) => {
      if (!res) {
        res = this.searchInProperty(object, p, value);
      }
    });
    return res;
  }

  private searchInProperty(object: any, property: string, value: string): boolean {
    let res = false;
    if (object && property && value) {
      let pValue = object[property];
      res = pValue && pValue.toUpperCase().indexOf(value) > -1;
    }
    return res;
  }
}
