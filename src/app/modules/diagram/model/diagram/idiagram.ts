import { ISvgObject } from "../svg-object/svg-object";

export interface IDiagram {
  id?: string;
  width?: number;
  height?: number;
  svgObject: ISvgObject;
  layerOptions?: any;
  subType?: string;
  orgCoord?: { x: number; y: number };
}
