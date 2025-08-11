
  render();
  function render() {
    //values: G+;372.049|D+R 2000, 600, 900;372.15|G+R 1000;372.2|D+R 800;372.35|D+R 800;372.4|T+R 700;372.55|G+R 2000;372.7
    let svgObjects = [];
    let deltaPk = (svgObject.pk2 - svgObject.pk1) * 1000;
    let dx = (svgObject.width / deltaPk);
    let valuePkList = svgObject.values.split("|");
    let x = 0;
    let exX = 0;
    let i = 0;
    for(let valuePkS of valuePkList) {
      let valuePk = valuePkS.split(";");
      if (valuePk.length == 2) {
        let pk = parseFloat(valuePk[1]);
        let pkS = pk.toFixed(3);
        let x = (pk -  svgObject.pk1) * deltaPk;
        let xValue = exX + (x - exX) / 2;
        let values = valuePk[0].split("+");
        let dy = 0;
        let r = 20;
        if (values.length == 2) {
          dy = (values[0] == "G" ? 1 : -1);
          svgObjects.push( { type: "text", x: xValue - 20, y: 4 + 12 * dy, text: values[1], style: "font-size:0.8em;", } );
        }
        let d = "";
        if (values[0] == "T") {
          r = 0;
          dy = 0;
        }
        else {
          if (exX > 0) {
            d = "M"  + String(exX) + " 0 a20 20 0 0 " + (dy > 0 ? "0":"1") + " 20," + String(dy * r);
            svgObjects.push( { type: "path", d: d, style: "stroke-width:2;;fill:none", } );
          }
          if (i < valuePkList.length - 1) {
            d = "M"  + String(x - r) + " " + String(dy * r) + " a20 20 0 0 " + (dy > 0 ? "0":"1") + " 20," + String(-dy * r);
            svgObjects.push( { type: "path", d: d, style: "stroke-width:2;;fill:none", } );
          }
        }
        if (i < valuePkList.length - 1) {
          svgObjects.push( { type: "group",  x: x - 10, y: -25, rotate: -90, svgObjects: [
            { type: "text", x: 0, y: 0, text: pkS, style: "", }] } );
          svgObjects.push( { type: "path", d: "M" + String(x) + " 0 v-50", style: "stroke-width:2;", } );
        }
        let r1 = r * (exX == 0 ? 0 : 1);
        svgObjects.push( { type: "path", d: "M" + String(exX + r1) + " " + String(dy * 20) + " h" + String(x - exX - r1 - r), style: "stroke-width:2", } );
        exX = x;
        i++;
      }
    }
    svgObject.svgObjects = svgObjects;
  }
                    