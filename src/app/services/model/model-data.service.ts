/**
 * Model init data service
 */
export class ModelDataService {
  /**
   * Application model
   */
  public model: any = {
    type: "model",
    id: "model",
    label: "Model",
    projects: [],
    // repositories: [],
  };

  public libraries = [
    {
      type: "library",
      id: "lib-1",
      label: "Library 1",
      boSvgObjectTypeMap: new Map(),
      boSvgObjectTypeMapArray: [],
      libraryObjects: [],
    },
  ];

  /**
   * Constructor
   */
  constructor() {}
}
