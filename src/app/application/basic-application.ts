// tslint:disable-next-line: no-empty-interface
export interface IBasicApplication {}

export abstract class AApplication implements IBasicApplication {
  constructor() {}
}

// tslint:disable-next-line: max-classes-per-file
export class ApplicationSingleton {
  private static _instance: IBasicApplication;

  public static get instance(): IBasicApplication {
    return ApplicationSingleton._instance;
  }

  public static set instance(value: IBasicApplication) {
    ApplicationSingleton._instance = value;
  }

  constructor() {}
}
