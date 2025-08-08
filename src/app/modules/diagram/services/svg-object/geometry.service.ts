import { SvgConstService } from 'src/app/services/svg/svg-const.service';
import { cloneDeep } from 'lodash';
import { ISvgObjectService } from './svg-object.service';
import { RSA_PKCS1_OAEP_PADDING } from 'constants';

export class GeometryService {
  constructor(
    private svgObjectService: ISvgObjectService,
  ) {
  }

  // Polyline utils
  public getPointsFromPolylineSvgObject(svgObject) {
    return this.getPointsFromPolyline(this.getSPointsFromPolylineSvgObject(svgObject));
  }

  public getSPointsFromPolylineSvgObject(svgObject: any): string {
    let res = "";
    let svgObjectWithPointProperty = this.svgObjectService.findSvgObjectWithProperty(svgObject, "points");
    if (svgObjectWithPointProperty && svgObjectWithPointProperty.points) {
      res = svgObjectWithPointProperty.points;
    }
    //console.log(">> getSPointsFromPolylineSvgObject", svgObject, svgObjectWithPointProperty, res);
    return res;
  }

  public getPointsFromPolyline(sPoint: string): any[] {
    let points = [];
    if (sPoint) {
      for(let point of sPoint.split(" ")) {
        let coords = point.split(",");
        if (coords.length == 2) {
          points.push( { x: parseFloat(coords[0]), y: parseFloat(coords[1]) });
        }
      }
    }
    return points;
  }

  public setPolylineSvgObjectSPointsFromPoints(svgObject, points) { 
    this.setPolylineSvgObjectSPoints(svgObject, this.getSPointsFromPoints(points));
  }

  public setPolylineSvgObjectSPoints(svgObject, sPoint) {
    if (svgObject.points) {
      this.svgObjectService.diagramService.modify(svgObject, "points", sPoint);
    }
    if (svgObject.svgObjects && svgObject.svgObjects.length && svgObject.svgObjects[0].points) {
      this.svgObjectService.diagramService.modify(svgObject.svgObjects[0], "points", sPoint);
    }
  }

  public getSPointsFromPoints(points) {
    let sPoint = "";
    for(let point of points) {
      if (sPoint != "") { sPoint += " "; }
        sPoint += String(point.x) + "," + String(point.y);
    }
    return sPoint;
  }

  public getPointFromPoints(points: any[], index: number) {
    return (points ? (points[index == -1 ? points.length - 1 : index]) : null);
  }

  public getPointFromPolylineSvgObject(svgObject: any, index: number) {
    return this.getPointFromPoints(this.getPointsFromPolylineSvgObject(svgObject), index);
  }



  // Path
  public movePointOfPathSvgObject(svgObject, svgObjectMemo, deltaCoord, indexes, doRound: boolean = true) {
    if (svgObject && svgObjectMemo && deltaCoord && indexes) {
      let sD = this.getDFromPathSvgObject(svgObject);
      let sDMemo = this.getDFromPathSvgObject(svgObjectMemo);
      let points = this.getPointsFromD(sD);
      let pointsMemo = this.getPointsFromD(sDMemo);
      let offset = { x: svgObject.x - svgObjectMemo.x, y: svgObject.y - svgObjectMemo.y };
      this.movePoints(points, pointsMemo, offset, deltaCoord, indexes, doRound);
      this.setPathSvgObjectD(svgObject, this.getDFromPoints(points, sD));
    }
  } 


  private replaceAll(s, s1, s2): string {
    if (s && s1) {
      while (s.indexOf(s1)>-1) { s = s.replace(s1, s2); }
    }
    return s;
  }

  public getPointsFromD(sD0): any[] {
    let points = [];
    //TODO other cases
    // "M0 0 C 20 20, 40 20, 50 0"
    if (sD0) { // && sD0.indexOf("C") > -1) {
      let sD = this.replaceAll(sD0, "M", "");
      sD = this.replaceAll(sD, "C", "");
      sD = this.replaceAll(sD, ",", "");
      sD = this.replaceAll(sD, "  ", " ");
      let values = sD.split(" ");
      for(let i=0; i<values.length; i+=2) {
        points.push( { x: parseInt(String(values[i])), y: parseInt(String(values[i+1])) });
      }
    }
    return points;
  }

  public getDFromPoints(points, currentD = null): string {
    // "M0 0 C 20 20, 40 20, 50 0"
    let sDNew = "";
    if (currentD && currentD.indexOf("C") > -1) {
      sDNew = "M";
      let i=0;
      for(let point of points) {
        if (i == 0) {
          sDNew += String(point.x) + " " + String(point.y);
        } else {
          if ((i-1)%3 == 0) { sDNew += " C "; }
          sDNew += String(point.x) + " " + String(point.y);
          if ((i-1)%3 != 2) { sDNew += ", "; }
        }
        i++;
      }
    }
    return sDNew;
  }

  public getDFromPathSvgObject(svgObject): string {
    return svgObject.d;
  }
  
  public setPathSvgObjectD(svgObject, sD) {
    this.svgObjectService.diagramService.modify(svgObject, "d", sD);
    if (svgObject.svgObjects && svgObject.svgObjects.length && svgObject.svgObjects[0].d) {
      this.svgObjectService.diagramService.modify(svgObject.svgObjects[0], "d", sD);
    }
  }


  // Polyline
  public movePointOfPolyLineSvgObject(svgObject, svgObjectMemo, deltaCoord, indexes, doRound: boolean = true) {
    if (svgObject && svgObjectMemo && deltaCoord && indexes) {
      let points = this.getPointsFromPolylineSvgObject(svgObject);
      let pointsMemo = this.getPointsFromPolylineSvgObject(svgObjectMemo);
      let offset = { x: svgObject.x - svgObjectMemo.x, y: svgObject.y - svgObjectMemo.y };
      this.movePoints(points, pointsMemo, offset, deltaCoord, indexes, doRound);
      this.setPolylineSvgObjectSPointsFromPoints(svgObject, points);
      this.resetPolylineOffset(svgObject);
    }
  }  

  public resetPolylineOffset(svgObject) {
    if (svgObject && svgObject.selType == SvgConstService.POLYLINE_OBJECT_TYPE) {
      let points = this.getPointsFromPolylineSvgObject(svgObject);
      this.resetPolylinePoints(svgObject, points);
      this.setPolylineSvgObjectSPointsFromPoints(svgObject, points);
    }
  }

  public resetPolylinePoints(svgObject, points) {
    if (svgObject && points && points.length) {
      let p0 = cloneDeep(points[0]);
      points.forEach(p => { p.x -= p0.x; p.y -= p0.y; });
      this.svgObjectService.diagramService.modify(svgObject, "x", svgObject.x + p0.x);
      this.svgObjectService.diagramService.modify(svgObject, "y", svgObject.y + p0.y);
    }
  }


  // Move points
  public movePoints(points, pointsMemo, offset, delta, indexes, doRound: boolean = true) {
    if (indexes) {
      for(let i of indexes) {
        if (i > -1 && i < points.length && i < pointsMemo.length ) {
          let point = points[i];
          let pointMemo = pointsMemo[i];
          let coord = { x: pointMemo.x + delta.x - offset.x, y: pointMemo.y + delta.y - offset.y };
          if (doRound) { coord = this.svgObjectService.diagramService.zoomScrollService.roundCoord(coord); }
          point.x = coord.x;
          point.y = coord.y;
        }
      }
    }  
  }

  public setPointsPosition(points, coord, indexes) {
    if (indexes) {
      for(let i of indexes) {
        if (i > -1 && i < points.length) {
          let point = points[i];
          point.x = coord.x;
          point.y = coord.y;
        }
      }
    }  
  }

  public getPolylinePointCoord(svgObject, index) {
    let res = { x: null, y: null };
    if (svgObject) {
      let points = this.getPointsFromPolylineSvgObject(svgObject);
      index = (index == -1 ? points.length - 1 : index);
      if (index > -1 && index < points.length) {
        let point = points[index];
        res.x = svgObject.x + point.x;
        res.y = svgObject.y + point.y;
      }
    }
    return res;
  }

  public setPolylinePointCoord(svgObject, index, coord) {
    if (svgObject && coord && svgObject.selType == SvgConstService.POLYLINE_SEL_TYPE) {
      let points = this.getPointsFromPolylineSvgObject(svgObject);
      index = (index == -1 ? points.length - 1 : index);
      if (index > -1 && index < points.length) {
        let point = points[index];
        if (coord.x != null) {
          point.x = coord.x - svgObject.x;
        }
        if (coord.y != null) {
          point.y = coord.y - svgObject.y;
        }
        this.setPolylineSvgObjectSPointsFromPoints(svgObject, points);
        return true;
      }
    }
    return false;
  }

  public sqr(x) {
    return x * x;
  }

  public dist2(v, w) {
    return this.sqr(v[0] - w[0]) + this.sqr(v[1] - w[1]);
  }

  // p - point
  // v - start point of segment
  // w - end point of segment
  public distToSegmentSquared(p, v, w) {
    var l2 = this.dist2(v, w);
    if (l2 === 0) return this.dist2(p, v);
    var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return this.dist2(p, [ v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ]);
  }

  // p - point
  // v - start point of segment
  // w - end point of segment
  public distanceToSegment(p, v, w) {
    return Math.sqrt(this.distToSegmentSquared([p.x, p.y], [v.x, v.y], [w.x, w.y]));
  }
  
  public intersectsLimiter(svgObject: any, delimiter: any): boolean {
    let res = false;
    if (svgObject && delimiter && svgObject.ctrlData && 
      svgObject.ctrlData.selType == SvgConstService.POLYLINE_SEL_TYPE) {
      let firstPointCoord = this.getPolylinePointCoord(svgObject, 0);
      let lastPointCoord = this.getPolylinePointCoord(svgObject, -1);
      res = firstPointCoord.x <= delimiter.x && lastPointCoord.x >= delimiter.x;
    }
    return res;
  }  

  // Points
  public getSvgObjectSegmentAtPoint(svgObject: any, coord: any): any {
    let res = null;
    let testPoint = { x: coord.x - svgObject.x, y: coord.y - svgObject.y };
    if (svgObject && svgObject.selType == SvgConstService.POLYLINE_SEL_TYPE) {
      let points = this.getPointsFromPolylineSvgObject(svgObject);
      let exPoint = null;
      points.forEach(point => {
        if (!res && exPoint) {
          let dist = this.distanceToSegment(testPoint, exPoint, point);
          if (dist < 5) {
            res = {
              p1: { x: exPoint.x + svgObject.x, y: exPoint.y + svgObject.y},
              p2: { x: point.x + svgObject.x, y: point.y + svgObject.y}
            };
          }
        }
        exPoint = point;
      });
    }
    return res;
  }

  public getPointAtXOfPolylineSvgObject(svgObject: any, x: number): any {
    let coord = { x: x, y: null };
    if (svgObject && svgObject.selType == SvgConstService.POLYLINE_SEL_TYPE) {
      coord.y = svgObject.y;
      let points = this.getPointsFromPolylineSvgObject(svgObject);
      let exPoint = null;
      let seg = null;
      points.forEach(point => {
        if (!seg && exPoint) {
          if (x > svgObject.x + exPoint.x && x < svgObject.x + point.x) {
            seg = {
              p1: { x: exPoint.x + svgObject.x, y: exPoint.y + svgObject.y},
              p2: { x: point.x + svgObject.x, y: point.y + svgObject.y}
            };
            let kx = (x - seg.p1.x) / (seg.p2.x - seg.p1.x);
            coord.y = seg.p1.y + kx * (seg.p2.y - seg.p1.y);
          }
        }
        exPoint = point;
      });
    }
    return coord;
  }

  public getSegmentAtXOfPolylineSvgObject(svgObject: any, x: number): any {
    let seg = null;
    if (svgObject && svgObject.selType == SvgConstService.POLYLINE_SEL_TYPE) {
      let points = this.getPointsFromPolylineSvgObject(svgObject);
      let exPoint = null;
      points.forEach(point => {
        if (!seg && exPoint) {
          if (x > svgObject.x + exPoint.x && x < svgObject.x + point.x) {
            seg = {
              p1: { x: exPoint.x + svgObject.x, y: exPoint.y + svgObject.y},
              p2: { x: point.x + svgObject.x, y: point.y + svgObject.y}
            };
          }
        }
        exPoint = point;
      });
    }
    return seg;
  }

  public getSegmentAngle(seg: any): number {
    let res = 0;
    if (seg && seg.p1 && seg.p2) {
      res = Math.atan2(seg.p2.y - seg.p1.y, seg.p2.x - seg.p1.x) * 180 / Math.PI;
    }
    return res;
  }

  public addPointToSvgObject(svgObject: any, coord: any): boolean {
    let x = coord.x - svgObject.x;
    let y = coord.y - svgObject.y;
    let testPoint = { x: x, y: y };

    if (svgObject.selType == SvgConstService.POLYLINE_SEL_TYPE) {
      let points = this.getPointsFromPolylineSvgObject(svgObject);
      let i = 0;
      let iPointBeforeOK = -1;
      let exPoint = null;
      points.forEach(point => {
        if (exPoint) {
          let dist = this.distanceToSegment(testPoint, exPoint, point);
          if (dist < 5) { iPointBeforeOK = i; };
        }
        exPoint = point;
        i++;
      });
      if (iPointBeforeOK > 0) {
        points.splice(iPointBeforeOK, 0, { x: x, y: y });
        this.setPolylineSvgObjectSPoints(svgObject, this.getSPointsFromPoints(points));
        this.shiftConnectionPointIndexes(svgObject, iPointBeforeOK, +1);
        return true;
      }
    }
    else if (svgObject.selType == SvgConstService.PATH_SEL_TYPE) {
      let sD = this.getDFromPathSvgObject(svgObject);
      let points = this.getPointsFromD(sD);
      let i = 0;
      let iPointBeforeOK = -1;
      let exPoint = null;
      let exiPoint = -1;
      let dist = 10000;
      points.forEach(point => {
        if (i == 0 || (i - 1) % 3 == 2) {
          if (exPoint) {
            let dist1 = this.distanceToSegment(testPoint, exPoint, point);
            if (dist1 < dist) { dist = dist1; iPointBeforeOK = exiPoint; };
          }
          exPoint = point;
          exiPoint = i;
        }
        i++;
      });
      if (iPointBeforeOK > -1) {
        points.splice(iPointBeforeOK + 2, 0, { x: x + 50, y:y });
        points.splice(iPointBeforeOK + 2, 0, { x: x, y:y });
        points.splice(iPointBeforeOK + 2, 0, { x: x - 50, y:y });
        this.setPathSvgObjectD(svgObject, this.getDFromPoints(points, sD));
        this.shiftConnectionPointIndexes(svgObject, iPointBeforeOK, +3);
        return true;
      }
    }
    return false;
  }

  public deleteHandlePoint(svgObject: any, handle: any): boolean {
    if (svgObject.selType == SvgConstService.POLYLINE_SEL_TYPE) {
      if (handle.indexes && handle.indexes.length == 1) {
        let points = this.getPointsFromPolylineSvgObject(svgObject);
        let index = handle.indexes[0];
        if (index > 0 && index + 1 < points.length) {
          points.splice(handle.indexes[0], 1);
          this.setPolylineSvgObjectSPoints(svgObject, this.getSPointsFromPoints(points));
          this.deleteConnectionFromIndexPoint(svgObject, handle.indexes[0]);
          this.shiftConnectionPointIndexes(svgObject, handle.indexes[0], -1);
          return true;
        }
      }
    }
    else if (svgObject.selType == SvgConstService.PATH_SEL_TYPE) {
      if (handle.indexes && handle.indexes.length == 3) {
        let sD = this.getDFromPathSvgObject(svgObject);
        let points = this.getPointsFromD(sD);
        let index = Math.min(handle.indexes[0], Math.min(handle.indexes[1], handle.indexes[2]));
        let maxIndex = Math.max(handle.indexes[0], Math.max(handle.indexes[1], handle.indexes[2]));
        if (maxIndex < points.length) {
          for (let i=0; i<3; i++) {
            points.splice(index, 1);
          }
          this.setPathSvgObjectD(svgObject, this.getDFromPoints(points, sD));
          this.deleteConnectionFromIndexPoint(svgObject, index + 1);
          this.shiftConnectionPointIndexes(svgObject, index, -3);
          return true;
        }
      }
    }
    return false;
  }

  //TODO queryService
  deleteConnectionFromIndexPoint(svgObject, index) {
    if (svgObject.connections) {
      let i = 0;
      let iExistingConnection = -1;
      svgObject.connections.forEach(connection => {
        if (iExistingConnection == -1 && connection.pointIndex1 == index) {
          iExistingConnection = i;
        }
        i++;
      });
      if (iExistingConnection > -1) {
        svgObject.connections.splice(iExistingConnection, 1);
      }
    }
  }

  //TODO queryService
  shiftConnectionPointIndexes(svgObject, index0, delta) {
    if (svgObject.connections) {
      svgObject.connections.forEach(connection => {
        if (connection.pointIndex1 >= index0) {
          connection.pointIndex1 += delta;
        }
      });
    }  
  }
}