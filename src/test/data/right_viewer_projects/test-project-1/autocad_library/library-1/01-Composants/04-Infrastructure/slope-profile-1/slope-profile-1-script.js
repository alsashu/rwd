
  render();
  function render() {
    //values:  7.8 / 50,372.05;5.2  50,372.1;3.1 / 100,372.2;2.0  200,372.3
    let svgObjects = [];
    let deltaPk = (svgObject.pk2 - svgObject.pk1) * 1000;
    let dx = (svgObject.width / deltaPk);
    let valuePkList = svgObject.values.split(";");
    let x = 0;
    let exX = 0;
    for(let valuePkS of valuePkList) {
      let valuePk = valuePkS.split(",");
      if (valuePk.length == 2) {
        let values = valuePk[0].split(" ");
        let pk = parseFloat(valuePk[1]);
        let pkS = pk.toFixed(3);
        let x = (pk -  svgObject.pk1) * deltaPk;
        let xValue = exX + (x - exX) / 2;
        if (values.length == 3) {
          svgObjects.push( { type: "text", x: xValue - 20, y: -5 -12 * 2, text: values[0], style: "font-size:0.8em;", } );
          svgObjects.push( { type: "text", x: xValue - 20, y: -5 -12 * 1, text: values[1], style: "font-size:0.8em;", } );
          svgObjects.push( { type: "text", x: xValue - 20, y: -5 -12 * 0, text: values[2], style: "font-size:0.8em;", } );
        }
        svgObjects.push( { type: "group",  x: x - 10, y: -5, rotate: -90, svgObjects: [
          { type: "text", x: 0, y: 0, text: pkS, style: "", }] } );
        svgObjects.push( { type: "path", d: "M" + String(x) + " 0 v-50", style: "stroke-width:2;", } );
        exX = x;
      }
    }
    svgObjects.push( { type: "path", d: "M0 0 h" + String(svgObject.width), style: "stroke-width:2;", } );
    svgObject.svgObjects = svgObjects;
  }
                    