import { ModalViewService } from "../modal/modal-view.service";
import { AppConfigService } from "../app/app-config.service";
import { CommandFactoryService } from "src/app/common/services/command/command-factory.service";
import { MvcService } from "../mvc/mvc.service";
import { ApiService } from "../api/api.service";
import { BoFactoryService } from "src/app/common/services/bo-factory/bo-factory.service";
import { ModelService } from "../model/model.service";
import { ClipboardService } from "src/app/common/services/clipboard/clipboard.service";
import { SelectionService } from "src/app/common/services/selection/selection.service";
import { TransactionService } from "../transaction/transaction.service";
import { QueryService } from "../transaction/query.service";
import { MessageService } from "../message/message.service";
import { ViewService } from "../view/view.service";
import { UserService } from "../user/user.service";
import { MetaModelService } from "../meta/meta-model.service";
import { LibraryService } from "../library/library.service";
import { ErrorMessageService, ErrorMessageFactoryService } from "../error-message/error-message.service";
import { ScriptService } from "../script/script.service";
import { RuleService } from "../rule/rule.service";
import { AppService } from "../app/app.service";
import { CommandService } from "src/app/common/services/command/command.service";
import { ModelMetadataService } from "../model/model-metadata.service";
import { CloneService } from "src/app/common/services/clone/clone.service";
import { UtilsService } from "../util/utils.service";
import { BoFactoryBuilderService } from "src/app/common/services/bo-factory/bo-factory-builder.service.";
import { SvgService } from "src/app/modules/diagram/services/svg-object/svg-service";
import { WebsocketService } from "../websocket/websocket.service";
import { IModalViewService } from "../modal/imodal-view.service";
import { SessionService } from "../session/session.service";
import { RightsService } from "../rights/rights.service";
import { TranslateService } from "../translate/translate.service";
import { ModelRailMLService } from "../model/model-railml.service";
import { ServicesConst } from "./services.const";
import { ModelVerificationService } from "../model/model-verification.service";
import { ModelLoadSaveService } from "../model/model-load-save.service";
import { ModelPropertiesService } from "../model/model-properties.service";
import { ViewFactory } from "../view/view.factory";
import { ModelCommandsService } from "../model/model-commands.service";
import { CsRuleEngineService } from "../rule-engine/cs-rule-engine.service";
import { SearchService } from "../search/search.service";
import { GraphicConfigService } from "../config/graphic-config.service";
import { AndroidService } from "../android/android.service";
import { IServicesService } from "./iservices.service";
import { WikiService } from "../wiki/wiki.service";
import { EnvironmentConfigService } from "../config/environment-config.service";
import { PythonRuleEngineService } from "../rule-engine/pyton-rule-engine.service";
import { GitService } from "../git/git-service";
import { CompareService } from "../compare/compare.service";
import { AuthentificationService } from "../user/authentification.service";
import { UploadProjectService } from "../import-export/upload-project.service";
import { DownloadProjectService } from "../import-export/download-project.service";
import { AndroidFSService } from "../android/android.fs.service";
import { OfflineApiService } from "../android/offline-api.service";
import { IndexedDBService } from "../indexedDB/indexedDB.service";
import { WikiCommentService } from "../wiki/wiki-comment.service";

/**
 * Interface of the services factory
 */
export interface IServicesFactory {
  buildServices(servicesService: IServicesService, filter?: string[]);
  buildOffLineServicesForTest(servicesService: IServicesService);
}

/**
 * Services factory. This class builds all services and add them to ServicesService
 */
export class ServicesFactory {
  public buildServices(servicesService: IServicesService, filter: string[] = ["*"]) {
    if (filter.includes("*") || filter.includes(ServicesConst.SvgService)) {
      servicesService.addService(ServicesConst.SvgService, new SvgService());
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ModalViewService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ModalViewService,
        new ModalViewService(servicesService)
      ) as IModalViewService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.AppConfigService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.AppConfigService,
        new AppConfigService(servicesService)
      ) as AppConfigService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ModelMetadataService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ModelMetadataService,
        new ModelMetadataService()
      ) as ModelMetadataService;
    }
    let commandService: CommandService;
    if (filter.includes("*") || filter.includes(ServicesConst.CommandService)) {
      commandService = servicesService.addService(ServicesConst.CommandService, new CommandService()) as CommandService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.CommandFactoryService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.CommandFactoryService,
        new CommandFactoryService()
      ) as CommandFactoryService;
    }
    let mvcService: MvcService = null;
    if (filter.includes("*") || filter.includes(ServicesConst.MvcService)) {
      mvcService = servicesService.addService(ServicesConst.MvcService, new MvcService(servicesService)) as MvcService;
      // mvcService.init(commandService);
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ApiService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.ApiService, new ApiService(servicesService)) as ApiService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.WebsocketService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.WebsocketService,
        new WebsocketService(servicesService)
      ) as WebsocketService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.BoFactoryService)) {
      const boFactoryService = servicesService.addService(
        ServicesConst.BoFactoryService,
        new BoFactoryService(servicesService, new BoFactoryBuilderService())
      ) as BoFactoryService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.MessageService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.MessageService, new MessageService(servicesService)) as MessageService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.TransactionService)) {
      const transactionService = servicesService.addService(
        ServicesConst.TransactionService,
        new TransactionService()
      ) as TransactionService;
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.QueryService, new QueryService(transactionService)) as QueryService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ModelService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.ModelService, new ModelService(servicesService)) as ModelService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ClipboardService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.ClipboardService, new ClipboardService()) as ClipboardService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.CloneService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.CloneService, new CloneService(servicesService)) as CloneService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.SelectionService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.SelectionService, new SelectionService(mvcService)) as SelectionService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.MetaModelService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.MetaModelService,
        new MetaModelService(servicesService)
      ) as MetaModelService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.LibraryService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.LibraryService, new LibraryService(servicesService)) as LibraryService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.GraphicConfigService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.GraphicConfigService,
        new GraphicConfigService(servicesService)
      ) as GraphicConfigService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.EnvironmentConfigService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.EnvironmentConfigService,
        new EnvironmentConfigService(servicesService)
      ) as EnvironmentConfigService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ModelRailMLService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ModelRailMLService,
        new ModelRailMLService(servicesService)
      ) as ModelRailMLService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ModelLoadSaveService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ModelLoadSaveService,
        new ModelLoadSaveService(servicesService)
      ) as ModelLoadSaveService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ModelPropertiesService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ModelPropertiesService,
        new ModelPropertiesService(servicesService)
      ) as ModelPropertiesService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ErrorMessageService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.ErrorMessageService, new ErrorMessageService()) as ErrorMessageService;
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ErrorMessageFactoryService,
        new ErrorMessageFactoryService()
      ) as ErrorMessageFactoryService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.UserService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.UserService, new UserService(servicesService)) as UserService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.AuthentificationService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.AuthentificationService,
        new AuthentificationService(servicesService)
      ) as AuthentificationService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ViewService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ViewService,
        new ViewService(servicesService, new ViewFactory(servicesService))
      ) as ViewService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ScriptService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.ScriptService, new ScriptService(servicesService)) as ScriptService;
    }

    if (filter.includes("*") || filter.includes(ServicesConst.RuleService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.RuleService, new RuleService(servicesService)) as RuleService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.CsRuleEngineService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.CsRuleEngineService,
        new CsRuleEngineService(servicesService)
      ) as CsRuleEngineService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.PythonRuleEngineService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.PythonRuleEngineService,
        new PythonRuleEngineService(servicesService)
      ) as PythonRuleEngineService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.UtilsService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.UtilsService, new UtilsService()) as UtilsService;
    }

    if (filter.includes("*") || filter.includes(ServicesConst.SearchService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.SearchService, new SearchService(servicesService)) as SearchService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.AppService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.AppService, new AppService(servicesService)) as AppService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.SessionService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.SessionService, new SessionService(servicesService)) as SessionService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.RightsService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.RightsService, new RightsService(servicesService)) as RightsService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.TranslateService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.TranslateService,
        new TranslateService(servicesService)
      ) as TranslateService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ModelVerificationService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ModelVerificationService,
        new ModelVerificationService(servicesService)
      ) as ModelVerificationService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.ModelCommandsService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.ModelCommandsService,
        new ModelCommandsService(servicesService)
      ) as ModelCommandsService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.AndroidService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.AndroidService, new AndroidService(servicesService)) as AndroidService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.AndroidFSService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.AndroidFSService,
        new AndroidFSService(servicesService)
      ) as AndroidFSService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.OfflineApiService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.OfflineApiService,
        new OfflineApiService(servicesService)
      ) as OfflineApiService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.IndexedDBService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.IndexedDBService,
        new IndexedDBService(servicesService)
      ) as IndexedDBService;
    }

    if (filter.includes("*") || filter.includes(ServicesConst.WikiService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.WikiService, new WikiService(servicesService)) as WikiService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.GitService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.GitService, new GitService(servicesService)) as GitService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.CompareService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(ServicesConst.CompareService, new CompareService(servicesService)) as CompareService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.UploadProjectService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.UploadProjectService,
        new UploadProjectService(servicesService)
      ) as UploadProjectService;
    }
    if (filter.includes("*") || filter.includes(ServicesConst.DownloadProjectService)) {
      // tslint:disable-next-line: no-unused-expression
      servicesService.addService(
        ServicesConst.DownloadProjectService,
        new DownloadProjectService(servicesService)
      ) as DownloadProjectService;
    }

    if (filter.includes("*") || filter.includes(ServicesConst.CommentService)) {
      servicesService.addService(
        ServicesConst.CommentService,
        new WikiCommentService(servicesService)
      ) as WikiCommentService;
    }
  }

  public buildOffLineServicesForTest(servicesService: IServicesService) {
    this.buildServices(servicesService, this.getOffLineFilter());
  }

  public getOffLineFilter(): string[] {
    return [
      ServicesConst.SvgService,
      ServicesConst.ModalViewService,
      ServicesConst.AppConfigService,
      ServicesConst.ModelMetadataService,
      ServicesConst.CommandService,
      ServicesConst.CommandFactoryService,
      ServicesConst.MvcService,
      ServicesConst.ApiService,
      ServicesConst.BoFactoryService,
      ServicesConst.MessageService,
      ServicesConst.TransactionService,
      ServicesConst.ModelService,
      ServicesConst.ClipboardService,
      ServicesConst.CloneService,
      ServicesConst.SelectionService,
      ServicesConst.ViewService,
      ServicesConst.MetaModelService,
      ServicesConst.LibraryService,
      ServicesConst.ErrorMessageService,
      ServicesConst.UserService,
      ServicesConst.AuthentificationService,
      ServicesConst.ScriptService,
      ServicesConst.UtilsService,
      ServicesConst.AppService,
      ServicesConst.SessionService,
      ServicesConst.TranslateService,
      ServicesConst.ModelRailMLService,
      ServicesConst.ModelLoadSaveService,
      ServicesConst.ModelPropertiesService,
      ServicesConst.ModelCommandsService,
      ServicesConst.AndroidService,
      ServicesConst.RightsService,
      ServicesConst.SearchService,
      ServicesConst.GraphicConfigService,
      ServicesConst.RuleService,
      ServicesConst.CsRuleEngineService,
      ServicesConst.ModelVerificationService,
      ServicesConst.WikiService,
      ServicesConst.GitService,
      ServicesConst.CompareService,
      ServicesConst.UploadProjectService,
      ServicesConst.DownloadProjectService,
      ServicesConst.CommentService,
    ];
  }
}
