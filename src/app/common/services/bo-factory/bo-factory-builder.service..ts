import { IBoFactoryBuilderService, IBoFactoryService } from "./bo-factory.service";
// import { ProjectFactory } from './factories/project-factory.service';
// import { DiagramFactory } from './factories/diagram-factory.service';
// import { LibraryFactory } from './factories/library-factory.service';
// import { ExeFactory } from './factories/exe-factory.service';
// import { RailMLInfrastructureFactory } from 'src/app/business/modules/signalling/services/bo-factory/railml-infrastructure-factory.service';

export class BoFactoryBuilderService implements IBoFactoryBuilderService {
  constructor() {}

  public build(boFactoryService: IBoFactoryService): IBoFactoryService {
    boFactoryService.addFactories([
      // new ProjectFactory(boFactoryService),
      // new DiagramFactory(boFactoryService),
      // new LibraryFactory(boFactoryService),
      // new ExeFactory(boFactoryService),
      // // modules
      // new RailMLInfrastructureFactory(boFactoryService),
    ]);
    return boFactoryService;
  }
}
