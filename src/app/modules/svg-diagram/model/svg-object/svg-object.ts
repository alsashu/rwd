export interface ISvgObject {
  type: string;
  x?: number;
  y?: number;
  svgObjects?: ISvgObject[];
}
