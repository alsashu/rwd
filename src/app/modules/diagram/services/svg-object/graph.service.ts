import { ISvgObjectService } from "./svg-object.service";

export class GraphService {
  constructor(private svgObjectService: ISvgObjectService) {}

  // graph
  public isSvgObjectAtPoint(svgObject, point, transform = { x: 0, y: 0 }) {
    let d2 = 25;
    let res = Math.abs(svgObject.x + transform.x - point.x) + Math.abs(svgObject.y + transform.y - point.y) < d2;
    return res;
  }

  public getLinkConnectionAtPoint(svgObject, point, transform = { x: 0, y: 0 }) {
    let res = null;
    if (svgObject.isPort && this.isSvgObjectAtPoint(svgObject, point, transform)) {
      res = { node: svgObject.parent, port: svgObject };
    }
    if (!res && svgObject.svgObjects) {
      svgObject.svgObjects.forEach((child) => {
        if (!res) {
          res = this.getLinkConnectionAtPoint(child, point, {
            x: transform.x + (svgObject.x ? svgObject.x : 0),
            y: transform.y + (svgObject.y ? svgObject.y : 0),
          });
        }
      });
    }
    return res;
  }

  public connectLink(link, from, to) {
    if (link) {
      let oldFrom = link.linkData ? link.linkData.from : null;
      let oldTo = link.linkData ? link.linkData.to : null;
      let linkData = {
        from: null,
        fromPort: null,
        to: null,
        toPort: null,
      };
      if (from && from.node) {
        linkData.from = from.node;
        linkData.fromPort = from.port;
        this.addLinkToSvgObject(linkData.from, link);
      }
      if (to && to.node) {
        linkData.to = to.node;
        linkData.toPort = to.port;
        this.addLinkToSvgObject(linkData.to, link);
      }
      link.linkData = linkData;
      this.removeDisconnectedLinks(oldFrom);
      this.removeDisconnectedLinks(oldTo);
      this.refreshLinkPosition(link);
      // console.log(">> connectLink", link, link.linkData);
    }
  }

  public isLinkConnectedToSvgObject(svgObject, link) {
    return svgObject && link && link.linkData && (link.linkData.from == svgObject || link.linkData.to == svgObject);
  }

  public removeDisconnectedLinks(svgObject) {
    if (svgObject && svgObject.linkData && svgObject.linkData.links) {
      svgObject.linkData.links = svgObject.linkData.links.filter((link) =>
        this.isLinkConnectedToSvgObject(svgObject, link)
      );
      // console.log(">> removeDisconnectedLinks", svgObject, svgObject.linkData.links);
    }
  }

  public addLinkToSvgObject(svgObject, link) {
    if (svgObject && link) {
      let linkData = svgObject.linkData;
      if (!linkData) {
        linkData = { links: [] };
        svgObject.linkData = linkData;
      }
      if (linkData.links.indexOf(link) == -1) {
        linkData.links.push(link);
      }
    }
  }

  public refreshLinkConnections(link) {
    if (link && link.diagram && link.isLink) {
      let diagram = link.diagram;
      let points = this.svgObjectService.geometryService.getPointsFromPolylineSvgObject(link);
      if (points && points.length > 1) {
        let point = points[0];
        let coord = { x: point.x + link.x, y: point.y + link.y };
        let from = this.getLinkConnectionAtPoint(diagram.svgObject, coord); // TODO getRootSvgObject()
        point = points[points.length - 1];
        coord = { x: point.x + link.x, y: point.y + link.y };
        let to = this.getLinkConnectionAtPoint(diagram.svgObject, coord); // TODO getRootSvgObject()
        this.connectLink(link, from, to);
      }
    }
  }

  public getSvgObjectLinks(svgObject) {
    return svgObject && svgObject.linkData && svgObject.linkData.links ? svgObject.linkData.links : [];
  }

  public getSvgObjectsLinks(svgObjects) {
    let res = [];
    if (svgObjects) {
      svgObjects.forEach((svgObject) => {
        res = res.concat(this.getSvgObjectLinks(svgObject));
      });
    }
    return res;
  }

  public refreshLinks(links) {
    if (links && links.forEach) {
      links.forEach((svg) => this.refreshLinkPosition(svg));
    }
  }

  public refreshLinkPosition(svgObject) {
    if (svgObject && svgObject.linkData) {
      let points = this.svgObjectService.geometryService.getPointsFromPolylineSvgObject(svgObject);

      let linkData = svgObject.linkData;
      if (linkData.from && linkData.fromPort) {
        let coord = {
          x: linkData.from.x + linkData.fromPort.x - svgObject.x,
          y: linkData.from.y + linkData.fromPort.y - svgObject.y,
        };
        this.svgObjectService.geometryService.setPointsPosition(points, coord, [0]);
      }

      if (linkData.to && linkData.toPort) {
        let coord = {
          x: linkData.to.x + linkData.toPort.x - svgObject.x,
          y: linkData.to.y + linkData.toPort.y - svgObject.y,
        };
        this.svgObjectService.geometryService.setPointsPosition(points, coord, [points.length - 1]);
      }

      this.svgObjectService.refreshService.updateLinkPointsWithLayout(svgObject, points);

      this.svgObjectService.geometryService.setPolylineSvgObjectSPoints(
        svgObject,
        this.svgObjectService.geometryService.getSPointsFromPoints(points)
      );
    }
  }
}
