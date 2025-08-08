import { SvgDiagramEvent } from "../diagram/svg-diagram-event";
import { ISvgDiagramService } from "../diagram/svg-diagram.service";

/**
 * Interface of Diagram selection service
 */
export interface ISelectionService {
  selectAll();
  deSelectAll();
  selectSvgObjects(svgObjects: any[]): any[];
  getSelectedSvgObjects();
  getFirstSelectedSvgObject();
  toggleSvgObjectSelection(svgObject: any);
  selectSvgObjectRecInRectangle(rect: { x: number; y: number; width: number; height: number });
  setIsSelectionFrozzen(value: boolean);
  isSelectionFrozzen();
  setIsSelected(svgObject: any, value: boolean);
  getIsSelected(svgObject: any): boolean;
}

/**
 * Diagram selection service
 */
export class SelectionService implements ISelectionService {
  static classItemSelected = "svg-item-selected";

  private selectedSvgObjects: any[] = [];
  private frozzenSelectionStatus = false;

  /**
   * Constructor
   * @param svgDiagramService The parent svg Diagram Service
   */
  constructor(public svgDiagramService: ISvgDiagramService) {}

  /**
   * Fire selection event
   */
  private fireEvent() {
    this.svgDiagramService.emitDiagramEvent(
      new SvgDiagramEvent({
        type: SvgDiagramEvent.ChangedSelection,
        object: this.svgDiagramService.diagram,
        subject: this.selectedSvgObjects,
      })
    );
  }

  /**
   * Select all svg objects
   */
  public selectAll() {
    this.selectSvgObjects(this.svgDiagramService.getSelectableSvgObjects());
  }

  /**
   * Deselect all svg objects
   */
  public deSelectAll() {
    this.selectSvgObjects([]);
  }

  /**
   * Test if there is selected svg objects
   * @returns
   */
  public hasSelection(): boolean {
    return this.selectedSvgObjects.length > 0;
  }

  /**
   * Select svg objects
   * @param svgObjects The svg objects
   * @returns The svg objects
   */
  public selectSvgObjects(svgObjects: any[]): any[] {
    if (this.isSelectionFrozzen()) {
      return;
    }
    if (svgObjects && svgObjects.forEach) {
      this.selectedSvgObjects.forEach((o: any) => this.setIsSelected(o, false));
      // TODO this.selectedSvgObjects = this.svgDiagramService.svgObjectService.filterSelectableSvgObjects(svgObjects);
      this.selectedSvgObjects = svgObjects;
      this.selectedSvgObjects.forEach((o: any) => this.setIsSelected(o, true));
      this.fireEvent();
      console.log(">> selectSvgObjects", this.selectedSvgObjects, this);
    }
    return this.selectedSvgObjects;
  }

  /**
   * Get the selected objects
   * @returns The selected objects
   */
  public getSelectedSvgObjects() {
    return this.selectedSvgObjects;
  }

  /**
   * Get the first selected object
   * @returns The first selected object, undefined if no selection
   */
  public getFirstSelectedSvgObject() {
    return this.getSelectedSvgObjects().find((o: any) => true);
  }

  /**
   * Toggle the selection of a svg object
   * @param svgObject The svg object
   */
  public toggleSvgObjectSelection(svgObject: any) {
    if (this.isSelectionFrozzen()) {
      return;
    }
    this.setIsSelected(svgObject, !this.getIsSelected(svgObject));
    const i = this.selectedSvgObjects.indexOf(svgObject);
    if (i > -1) {
      this.selectedSvgObjects.splice(i, 1);
    }
    if (this.getIsSelected(svgObject)) {
      this.selectedSvgObjects.push(svgObject);
    }
    this.fireEvent();
  }

  /**
   * Select svg objects in a rectangle
   * @param rect The rectangle
   */
  public selectSvgObjectRecInRectangle(rect: { x: number; y: number; width: number; height: number }) {
    this.selectSvgObjects(
      this.svgDiagramService.getSelectableSvgObjects().filter((svg: any) => this.isSvgObjectIntRect(svg, rect))
    );
  }

  /**
   * Test if a svg object is inside a rectangle
   * @param svgObject The svg object
   * @param rect The rectangle
   * @returns The boolean result
   */
  private isSvgObjectIntRect(svgObject: any, rect: { x: number; y: number; width: number; height: number }): boolean {
    if (svgObject && svgObject.getBBox) {
      const bbox = svgObject.getBBox();
      return (
        bbox &&
        bbox.x >= Math.min(rect.x, rect.x + rect.width) &&
        bbox.x + bbox.width <= Math.max(rect.x, rect.x + rect.width) &&
        bbox.y >= Math.min(rect.y, rect.y + rect.height) &&
        bbox.y + bbox.height <= Math.max(rect.y, rect.y + rect.height)
      );
    }
    return false;
  }

  /**
   * Set the isSelectionFrozzen property
   * @param value Boolean value
   */
  public setIsSelectionFrozzen(value: boolean) {
    this.frozzenSelectionStatus = value;
  }

  /**
   * Get the isSelectionFrozzen property
   * @returns Boolean value
   */
  public isSelectionFrozzen() {
    return this.frozzenSelectionStatus;
  }

  /**
   * Apply selection to a svg object
   * @param svgObject Svg object
   * @param value Boolean value
   */
  public setIsSelected(svgObject: any, value: boolean) {
    if (svgObject) {
      svgObject.isSelected = value;

      const renderer = this.svgDiagramService.svgDiagramComponent.renderer;
      if (renderer) {
        this.removeSelectionElement(svgObject);
        if (value) {
          renderer.addClass(svgObject, SelectionService.classItemSelected);
          // this.addSelectionElement(svgObject); // TODO TEST
        } else {
          renderer.removeClass(svgObject, SelectionService.classItemSelected);
        }
      }
    }
  }

  /**
   * Remove if exists the selection element
   * @param svgObject The svg object
   */
  private removeSelectionElement(svgObject: any) {
    if (svgObject) {
      const renderer = this.svgDiagramService.svgDiagramComponent.renderer;
      let lastElementChild = svgObject.lastElementChild;
      if (renderer && lastElementChild && lastElementChild.classList && lastElementChild.classList.contains) {
        if (lastElementChild.classList.contains("svg-item-selected-div")) {
          renderer.removeChild(svgObject, lastElementChild);
        }
      }
    }
  }

  /**
   * Add a selection element
   * @param svgObject The svg object
   */
  private addSelectionElement(svgObject: any) {
    const renderer = this.svgDiagramService.svgDiagramComponent.renderer;
    if (renderer && svgObject && svgObject.getBoundingClientRect) {
      let x,
        y,
        w,
        h = 0;
      const boudingRect = svgObject.getBoundingClientRect();
      const clientSize = this.svgDiagramService.zoomScrollService.screenToClient({
        x: boudingRect.width,
        y: boudingRect.height,
      });
      const clientPos = this.svgDiagramService.zoomScrollService.getClientCoordFromScreenCoord({
        x: boudingRect.x,
        y: boudingRect.y,
      });
      x = clientPos.x;
      y = clientPos.y;
      w = clientSize.x;
      h = clientSize.y;

      if (svgObject.getAttribute) {
        const transform = svgObject.getAttribute("transform");
        if (transform !== "matrix(1,0,0,1,0,0)") {
          x = 0;
          y = 0;
          let firstElementChild = svgObject.firstElementChild;
          if (firstElementChild) {
            if (firstElementChild.nodeName === "circle") {
              const rn = parseInt(firstElementChild.getAttribute("r"));
              x = -rn;
              y = -rn;
            }
            // else if (firstElementChild.nodeName === "text") {
            //   // x = parseInt(firstElementChild.getAttribute("x"));
            //   // y = parseInt(firstElementChild.getAttribute("y"));
            //   x = 0;
            //   y = 0;
            //   console.log(firstElementChild);
            // }
          }
        }
      }
      x -= 5;
      y -= 5;
      w += 10;
      h += 10;
      const selectionElement = renderer.createElement("rect", "http://www.w3.org/2000/svg");
      renderer.addClass(selectionElement, "svg-item-selected-div");
      renderer.setAttribute(selectionElement, "x", String(x));
      renderer.setAttribute(selectionElement, "y", String(y));
      renderer.setAttribute(selectionElement, "width", String(w));
      renderer.setAttribute(selectionElement, "height", String(h));
      renderer.setAttribute(selectionElement, "fill", "none");
      renderer.setAttribute(selectionElement, "outline", "none");
      renderer.setAttribute(selectionElement, "stroke-width", "10");
      renderer.setAttribute(selectionElement, "stroke", "url(#crosshatch)");
      renderer.appendChild(svgObject, selectionElement);
      // renderer.setAttribute(selectionElement, "stroke", "red"); 112796
    }
  }

  /**
   * Test if a svg object is selected
   * @param svgObject The svg object
   * @returns Boolean value
   */
  public getIsSelected(svgObject: any): boolean {
    return svgObject ? svgObject.isSelected === true : false;
  }
}

// <svg width="240" height="320" viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

//   <defs>
//     <!--
//     <pattern id="crosshatch" patternUnits="userSpaceOnUse" width="10" height="10">
//       <image xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnPgogIDxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzgnIGZpbGw9JyNmZmYnLz4KICA8cGF0aCBkPSdNMCAwTDggOFpNOCAwTDAgOFonIHN0cm9rZS13aWR0aD0nMC41JyBzdHJva2U9JyNhYWEnLz4KPC9zdmc+Cg==" x="3" y="3" width="5" height="5">
//       </image>
//     </pattern>

//     <mask id="holes">
//       <rect x="0%" y="0%" width="100%" height="100%" fill="white"/>
//       <use href="#chain-path" stroke-width="4" stroke-dasharray="6 14" stroke-dashoffset="7" stroke="black"/>
//     </mask>

//     <mask id="maskCross0">
//       <rect x="0" y="0" width="10" height="10" fill="white"/>
//       <line x1="0" y1="0" x2="10" y2="10" stroke-width="2" fill="black"/>
//       <line x1="10" y1="0" x2="0" y2="10" stroke-width="2" fill="black"/>
//     </mask>

//         <mask id="maskCross">
//       <rect x="0%" y="0%" width="100%" height="100%" fill="white"/>
//       <line x1="0" y1="0" x2="10" y2="10" stroke-width="2" fill="black"/>
//       <line x1="10" y1="0" x2="0" y2="10" stroke-width="2" fill="black"/>
//     </mask>
//     <path id="chain-path" d="M 50,50 C 50,150 250,150 250,50" fill="none" stroke-linecap="round"/>
//   -->
//     <pattern id="crosses" patternUnits="userSpaceOnUse" width="10" height="10">
//       <line x1="0" y1="0" x2="5" y2="5" stroke-width="1" stroke="red"/>
//       <line x1="5" y1="0" x2="0" y2="5" stroke-width="1" stroke="red"/>
//     </pattern>

//   </defs>

//   <rect x="2" y="2" width="53" height="37" stroke-width="1" stroke="red"></rect>

//   <line x1="5" y1="5" x2="58" y2="5" stroke-width="10" stroke="url(#crosses)"/>
//   <line x1="5" y1="37" x2="58" y2="37" stroke-width="10" stroke="url(#crosses)"/>
//   <line x1="5" y1="5" x2="5" y2="37" stroke-width="10" stroke="url(#crosses)"/>
//   <line x1="58" y1="5" x2="58" y2="37" stroke-width="10" stroke="url(#crosses)"/>

//   <!--
//   <rect x="5" y="5" width="50" height="37" stroke-width="1" stroke="url(#crosshatch)"></rect>
//   <rect x="5" y="5" width="50" height="37" stroke-width="10" stroke="blue" mask="url(#maskCross)"></rect>
//   -->
// </svg>

// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="200" version="1.1">
// <defs>
// <image id="imgcross" xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnPgogIDxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzgnIGZpbGw9JyNmZmYnLz4KICA8cGF0aCBkPSdNMCAwTDggOFpNOCAwTDAgOFonIHN0cm9rZS13aWR0aD0nMC41JyBzdHJva2U9JyNhYWEnLz4KPC9zdmc+Cg==" x="0" y="0" width="10" height="10">
// </image>

// <image id="imgcross1" xlink:href="https://www.iana.org/_img/2022/iana-logo-header.svg"></image>
// </defs>

// <style>
// .class1 {
//   background-image: url("https://www.rapidtables.com/lib/icons/glyphicons_all/glyphicons/png/glyphicons_027_search.png");
//   background-repeat: repeat;
//   background-color: #cccccc;
//   stroke: red;

// /*
//   fill: blue;
//   background-image: url("#imgcross1");
//   background-position: center;
//   background-size: cover;
// */
// }
// </style>
//    <rect x="10" y="10" width="220" height="100" stroke-width="2" class="class1" />
// </svg>

// <div class="class1" >hello</div>
// <div><img src="https://www.rapidtables.com/lib/icons/glyphicons_all/glyphicons/png/glyphicons_027_search.png"/></div>
// <div><img src="url('#imgcross1')"/></div>
