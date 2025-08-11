
  render();
  function render() {
    let svgObjects = [];
    let aspects = svgObject.aspects.split(",");
    let dx = 1;
    if (svgObject.dx) { dx = parseInt(svgObject.dx); }
    let dy = 1;
    if (svgObject.dy) { dy = parseInt(svgObject.dy); }
    let lx = 20;
    if (svgObject.lx) { lx = parseInt(svgObject.lx); }
    let ly = 20;
    if (svgObject.ly) { ly = parseInt(svgObject.ly); }
    let aspectW = 20;
    let w = aspects.length * aspectW + 5;
    let h = 22;
    let style = "stroke-width:1;fill:none;";
    let x1 = dx*lx;
    let y1 = -dy*(ly+h/2);
    let x2 = dx*(lx+w);
    let y2 = -dy*(ly-h/2);
    let dxText = 8;
    let dyText = 0;
    if (dx*dy==-1) { dyText+= 2; }

    let points = "0,0 0," + (-dy*ly) + " " + (dx*lx) + "," + (-dy*ly);
    svgObjects.push({type: "polyline", static: true, points: points, style: style, });

    points = "" + x1 + "," + y1 + " " + x1 + "," + y2 + " " + x2 + "," + y2 + " " + x2 + "," + y1 + " " + x1 + "," + y1;
    svgObjects.push({type: "polyline", static: true, points: points, style: style, });
    //svgObjects.push({ type: "rect", x: dx*lx, y: -dy*(ly+h/2), width: dx*w, height: dy*h, style: style, });

    let i=0;
    for(let aspect of aspects) {
      if (aspect[0] == '@') {
        svgObjects.push({ type: "circle", cx: dx * (lx + i * aspectW + 11), cy: dy * (-ly - 0), r: 10, style: style, });
      }
      let aspect1 = aspect;
      while(aspect1.indexOf("@")>-1) { aspect1 = aspect1.replace("@",""); }
      let textX = dx * (lx + dxText + i * aspectW);
      let textY = dy * (-ly - dx * dy * aspect1.length * 3 + dyText);
      svgObjects.push(
        { type: "g", x: textX, y: textY, style: "", svgObjects: [
          { type: "text", x: 0, y: 0, text: aspect1, style: "", rotate: dx * 90,  }
        ]},
      );
      i++;
    }
    svgObject.svgObjects = svgObjects;
  }
                    