export interface IUtilsService {
  getIntValue(value: string): number;
  getFloatValue(value: string): number;
  sqr(x: number): number;
  distance(p1: any, p2: any): number;
}

export class UtilsService implements IUtilsService {
  public getIntValue(value: string): number {
    return value !== undefined ? parseInt(String(value).replace(",", "."), 10) : 0;
  }

  public getFloatValue(value: string): number {
    return value !== undefined ? parseFloat(String(value).replace(",", ".")) : 0;
  }

  public sqr(x: number): number {
    return x * x;
  }

  public distance(p1: any, p2: any): number {
    return Math.sqrt(this.sqr(p2.x - p1.x) + this.sqr(p2.y - p1.y));
  }
}
