
  render();

  function render() {
    let svgObjects = [];
    let deltaPk = (svgObject.pk2 - svgObject.pk1) * 10;
    let dx = (svgObject.width / deltaPk);
    let x = 0;
    let y = 0;
    let styleText1 = "font-size:.7em";
    let styleText2 = "font-size:1.1em";
    let styleCircle = "stroke-width:1;fill:#444;";
    let doPk100m = dx > 10;
    let modulo = 10;
    let dist = 100;
    if (modulo * dx < dist) { modulo *= 10; };
    if (modulo * dx < dist) { modulo *= 5; };
    if (modulo * dx < dist) { modulo *= 2; };
    if (modulo * dx < dist) { modulo *= 5; };
    if (modulo * dx < dist) { modulo *= 2; };
    if (modulo * dx < dist) { modulo *= 5; };
    if (modulo * dx < dist) { modulo *= 2; };
    for(let i = 0; i <= deltaPk; i++) {
      if (doPk100m || (i % modulo == 0)) {
        let sPk = String(i % 10);
        let r = 2;
        let styleText = styleText1;
        let scale = 1;
        if (i % modulo == 0) {
          sPk = String(parseInt(svgObject.pk1) + (i / 10));
          r = 4;
          styleText = styleText2;
          scale = 1;
        }
        svgObjects.push({ type: "circle", cx: x, cy: y, r: r, style: styleCircle, });
        svgObjects.push({ type: "text", x: x + 10, y: y + r*2, text: sPk, style: styleText, scale: scale, });
      }
      x += dx;
    }
    svgObject.svgObjects = svgObjects;
  }
                    