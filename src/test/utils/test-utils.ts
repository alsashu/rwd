// @ts-ignore
import testProject1Json from "src/test/data/right_viewer_projects/test-project-1/test-project-1.json";
// @ts-ignore
import testProject1Xsd from "src/test/data/right_viewer_projects/test-project-1/xsd/data.json";
// @ts-ignore
import testProject1Libraries from "src/test/data/right_viewer_projects/test-project-1/autocad_library/libraries.json";
// @ts-ignore
import testProject1GraphicsCconf from "src/test/data/right_viewer_projects/test-project-1/projectConfig/graphicsconf.json";

// @ts-ignore
import montbardXsd from "src/test/data/xsd/Montbard/data.json";

import { IServicesService } from "src/app/services/services/iservices.service";
import { ApiService } from "src/app/services/api/api.service";
import { AppConfigConst } from "src/app/services/app/app-config-const.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesFactory } from "src/app/services/services/services.factory";
import { IWebsocketService } from "src/app/services/websocket/websocket.service";

export class TestsUtils {
  public serverUrl = "http://localhost:3000";
  public testProjectRef1 = { id: "7e0662a5-ba51-4eb6-9489-872e130f3208", label: "test project" };

  public testProject1Data = {
    project: testProject1Json,
    libraries: testProject1Libraries,
    projectConfig: [{ type: "gconfig", value: testProject1GraphicsCconf }],
    metaModel: testProject1Xsd,
    sourceAndState: [],
  };

  public testProject1 = this.testProject1Data.project;

  public argosTestProject1Xsd = montbardXsd;

  constructor() {
    // console.log(`TestsUtils constructor`, this.testProject1Data);
  }

  public init(servicesService: IServicesService): TestsUtils {
    new ServicesFactory().buildServices(servicesService);
    AppConfigConst.config.SERVER_URL = this.serverUrl;
    localStorage.removeItem(ApiService.localStorageName);
    const websocketService = servicesService.getService(ServicesConst.WebsocketService) as IWebsocketService;
    websocketService.isAutoReconnectEnabled = false;
    servicesService.initServices();
    return this;
  }
}
