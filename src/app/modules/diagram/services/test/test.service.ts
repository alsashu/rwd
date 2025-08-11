export class TestModelService {
  constructor() {
  }

  public diagramData = {
    type: "diagram",
    id: "diag-1",
    libraryId: "lib-1",

    label: "Schéma des test",

    diagramType: "front-diagram",
    diagramSubType: "n2-front-diagram",

    // width: 10000,
    // height: 4000,

    settings: {
      displaySettings: {
        width: 10000,
        height: 4000,
      },
      layerSettings: {
      },
    },

    model: {
      svgObject: {
      },
    },

    template: {
      libraryId: "lib-1",
      libraries: [{
          libraryObjects: [
          ],
        },
      ],
    },

    svgObject: {
      type: "root",
      svgObjects: [
        {
          type: "group",
          selType: "polyline",
          id: "l1",
          x: 50,
          y: 150,
          isNode: true,
          svgObjects: [
            {
              type: "polyline",
              points: "0,0 100,0",
              style: "stroke-width:4;",
            },
            {
              type: "use",
              x: 0, 
              y: 0,
              href: "#def-port-1",
              isPort: true,
              portId: "1",

              ctrlData: {
                rules: [
                  { ruleType: "point-map", index: 0 }
                ],
              },
            },            
            {
              type: "use",
              x: 100,
              y: 0,
              href: "#def-port-1",
              isPort: true,
              portId: "2",

              ctrlData: {
                rules: [
                  { ruleType: "point-map", index: -1 }
                ],
              },
            },            
          ],
        },

        {
          type: "group",
          id: "g1",
          x: 50,
          y: 50,
          isNode: true,
          selType: "rectangle",
          svgObjects: [
            {
              type: "rect",
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              style: "stroke-width:4;fill:#a00",
              svgObjects: [],
            },

            {
              type: "text",
              isMovable: true,
              x: 10,
              y: 25,
              text: "g1",
              style: "stroke-width:2",
              svgObjects: [],
            },            

            {
              type: "use",
              x: 0,
              y: 10,
              href: "#def-port-1",
              isPort: true,
              portId: "in1",
              svgObjects: [],
            },

            {
              type: "use",
              x: 0,
              y: 40,
              href: "#def-port-1",
              isPort: true,
              portId: "in2",
              svgObjects: [],
            },

            {
              type: "use",
              x: 50,
              y: 25,
              href: "#def-port-1",
              isPort: true,
              portId: "out",
              svgObjects: [],
            },           
          ],
        },

        {
          type: "group",
          id: "g2",
          x: 150,
          y: 50,
          isNode: true,
          svgObjects: [
            {
              type: "rect",
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              style: "stroke-width:4;fill:#800",
              svgObjects: [],
            },

            {
              type: "use",
              x: 0,
              y: 10,
              href: "#def-port-1",
              isPort: true,
              portId: "in1",
              svgObjects: [],
            },

            {
              type: "use",
              x: 0,
              y: 40,
              href: "#def-port-1",
              isPort: true,
              portId: "in2",
              svgObjects: [],
            },

            {
              type: "use",
              x: 50,
              y: 25,
              href: "#def-port-1",
              isPort: true,
              portId: "out",
              svgObjects: [],
            },           
          ],
        },        
      ],
    }
  };  
}