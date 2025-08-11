
render();

function render() {
  let svgObjects = [];

  let rxy = 3;
  let color = svgObject.color;
  let style = "stroke-width:1;fill:" + color + ";opacity:0.6";

  let w = parseInt(String(svgObject.width));
  let h = parseInt(String(svgObject.height));
  if (svgObject.isNoteCollapsed) {
    w = 30;
    h = 30;
  }

  if (rootSvgObject && svgObject.bo && svgObject.bo.id) {
    let linkedSvgObjects = svgService.getSvgObjectsByBoId(rootSvgObject, svgObject.bo.id);
    let linkedSvgObject = linkedSvgObjects.find(svg => svg.id != svgObject.id);
    if (linkedSvgObject && linkedSvgObject.x != undefined && linkedSvgObject.y != undefined ) {
      let x1 = parseInt(String(svgObject.x));
      let y1 = parseInt(String(svgObject.y));
      let x2 = parseInt(String(linkedSvgObject.x));
      let y2 = parseInt(String(linkedSvgObject.y));
      let style = "stroke-width:1;stroke-dasharray:5,5;opacity:0.6";
      svgObjects.push({type: "path", d: "M" + String(w / 2) + " " + String(h / 2) + 
        " L" + String(x2 - x1) + " " + String(y2 - y1) + " Z", style: style, });
      svgObject.linkX = x2 - x1;
      svgObject.linkY = y2 - y1;
    }
  }

  if (svgObject.isNoteCollapsed) {
    svgObjects.push({ type: "rect", x: 0, y: 0, width: w, height: h, rx: rxy, ry: rxy, style: style, });
    svgObjects.push({ type: "use", href: "#def-warning", x: 2, y: 1, });
  }
  else {
    svgObjects.push({type: "rect", x: 0, y: 0, width: w, height: h, rx: rxy, ry: rxy, style: style, });

    let label = svgObject.label;
    let labelX = parseInt(String(svgObject.labelX));
    let labelY = parseInt(String(svgObject.labelY));
    svgObjects.push(
      { type: "g", x: labelX, y: labelY, style: "", svgObjects: [
        { type: "text", x: 0, y: 0, text: label, style: "", }
      ]},
    );
  }

//  svgObjects.push({type: "toggle-handle", x: -20, y: -20, mapping: "isNoteCollapsed", });

  svgObject.svgObjects = svgObjects;
}
                    