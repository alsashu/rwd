/**
 * Interface of svg digram sub controller
 */
export interface ISubTypeSvgDiagramController {
  init();
  initDiagram(diagram: any);
  refreshLayers();
  testAndLazyLoadVisualization(project: any, diagram: any);
}
