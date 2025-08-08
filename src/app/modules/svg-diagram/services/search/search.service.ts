import { ISvgDiagramService } from "../diagram/svg-diagram.service";

export interface ISearchService {
  searchElement(elementData: { objectClassName: string; id: string }): any;
  search(value: string): any;
}

export class SearchService {
  constructor(public svgDiagramService: ISvgDiagramService) {}

  public searchElement(elementData: { objectClassName: string; id: string }): any {
    // let query = `g[item_id='${elementData.id}']`;
    // if (elementData.objectClassName && elementData.objectClassName !== "*") {
    //   query += `[object_class_name='${elementData.objectClassName}']`;
    // }
    // const svgEl = this.svgDiagramService.svgDiagramComponent.getSvgElement();
    // const el = svgEl ? svgEl.querySelector(query) : null;
    // return el;

    return this.svgDiagramService
      .getSelectableSvgObjects()
      .find(
        (svgObject: any) =>
          svgObject &&
          svgObject.getAttribute("item_id") === elementData.id &&
          (elementData.objectClassName === "*" ||
            svgObject.getAttribute("objectClassName") === elementData.objectClassName)
      );
  }

  // TODO: !, |, &, (), @type, @botype ,@id, @boid, @tobeverified...
  public search(value: string): any {
    const svgObjects = this.svgDiagramService.getSelectableSvgObjects();
    let foundSvgObjects = [];
    if (value != null && svgObjects && svgObjects.forEach) {
      if (["*", "all"].includes(value)) {
        foundSvgObjects = svgObjects;
      } else if (["", "none"].includes(value)) {
      } else {
        const svgSearchProperties = ["libraryId", "label"];
        const boSearchProperties = ["type", "label", "id"];

        foundSvgObjects = svgObjects.filter(
          (svg: any) =>
            this.searchInProperties(svg, svgSearchProperties, value.toUpperCase()) ||
            (svg.bo && this.searchInProperties(svg.bo, boSearchProperties, value.toUpperCase()))
        );
      }
    }
    return { svgObjects, foundSvgObjects };
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
      const pValue = object.getAttribute ? object.getAttribute(property) : object[property];
      res = pValue && pValue.toUpperCase().indexOf(value) > -1;
    }
    return res;
  }
}
