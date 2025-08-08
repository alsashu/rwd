import { SessionService } from "../session/session.service";

/**
 * Application config service
 */
export class AppConfigConst {
  public static httpsStatus = true;
  public static config = {
    SERVER_URL:
      localStorage.getItem(SessionService.sessionVar.serverUrl) ||
      (AppConfigConst.httpsStatus ? "https" : "http") + "://localhost:3000",
    SERVER_URLS: ["https://localhost:3000"],

    OFFLINE: localStorage.getItem(SessionService.sessionVar.offline) === "checked",

    API_PROJECT: "/api/model/project",
    API_PROJECT_LIST: "/api/model/projectList",
    API_PROJECT_DELETE: "/api/model/projectDelete",
    API_PROJECT_COMPARE: "/api/model/projectCompare",
    // API_LIBRARIES: "/api/library/libraries",
    API_CONFIG: "/api/model/config",
    API_MODEL_VERIF: "/api/model/save/InputAndSource",
    API_MODEL_LAZYLOADING: "/api/model/lazyLoading/",
    API_MODEL_SVG: "/api/model/svg/",

    API_MODEL_ISDIRTY: "/api/model/isDirty/",

    API_CS_RULE_ENGINE: "/api/execute/csRuleEngine",
    API_CS_RULE_ENGINE_LOG_FILE: "/api/execute/csRuleEngine/logFile",
    API_CS_RULE_ENGINE_LOGS_FILE: "/api/execute/csRuleEngine/logFiles",
    API_PY_RULE_ENGINE: "/api/execute/pythonRuleEngine",
    API_PY_RULE_ENGINE_LOG_FILE: "/api/execute/pythonRuleEngine/logFile",
    API_PY_RULE_ENGINE_LOG_FILES: "/api/execute/pythonRuleEngine/logFiles",

    API_GIT_CLONE_PROJECT: "/api/git/clone",
    API_GIT_CHECKOUT_PROJECT: "/api/git/checkout",
    API_GIT_PUSH_PROJECT: "/api/git/push",
    API_GIT_COMMAND: "/api/git/command",

    API_CONVERT_PROJECT: "/api/convert/right_viewer_format/",
    API_USERS: "/api/users/",
    API_KEY: "/api/key/",
    API_METAMODEL: "/api/metamodel/",

    API_XML: "/api/xml/file",
    API_WIKI_PAGE: "/api/wiki/page", // (post)
    API_WIKI_PAGES: "/wiki/file/",
    API_WIKI_BUILD_RAILML: "/api/wiki/build/railml",
    API_WIKI_SEARCH: "/api/wiki/search",

    API_USER_MNGT_AUTH_LOGIN: "https://right.alstom.hub/um/api/authorize",

    API_UPLOAD_FILE: "/api/upload/file",
    API_UPLOAD_PROJECT: "/api/upload/project",
    API_DOWNLOAD_PROJECT: "/api/download/project",
    API_COMMENT: "/api/comments/",
    API_WIKI_COMMENT: "/api/wiki/comment",
  };
}
