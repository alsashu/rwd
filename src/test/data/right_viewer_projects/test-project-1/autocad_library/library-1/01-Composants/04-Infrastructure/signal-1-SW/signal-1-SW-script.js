// console.log(">> signal script render");
render3d();

function render3d() {
  let wglObjects = [];
  let fontSize = 10;
  let fontColor = 0x222222;
  let opacity = 1;
  let color = 0x888888;
  let hBase = 40;
  let sBase = 2;
  let hLamp = 20;
  let sLamp = 6;
  wglObjects.push({ type: "cube", x: 0, y: hBase / 2, z: 0, width: sBase, height: hBase, depth: sBase, color: color, opacity: opacity, } );
  wglObjects.push({ type: "cube", x: 0, y: hBase + hLamp / 2, z: 0, width: sLamp, height: hLamp, depth: sLamp, color: color, opacity: opacity, } );

  // Label
  let label = svgObject.label;
  let dt = 5;
  let yLabel = 5 + hBase + hLamp;
  wglObjects.push({ type: "text", x: 0, y: yLabel, z: 0, text: label, color: fontColor, size: fontSize, });

  svgObject.wglObjects = wglObjects;
}
                    