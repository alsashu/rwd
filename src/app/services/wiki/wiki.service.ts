import { IServicesService } from "../services/iservices.service";
import { IApiService } from "../api/api.service";
import { ServicesConst } from "../services/services.const";
import { ITranslateService } from "../translate/translate.service";
import { SafeHtml } from "@angular/platform-browser";
import { EventEmitter, Renderer2 } from "@angular/core";
import { IInjectableUtilsService } from "../injectable/injectable-utils.service";

/**
 * History info
 */
export class HistoryInfo {
  constructor(public url: string, public languageCode: string, public title: string) {}
}

/**
 * Interface of the WikiService
 */
export interface IWikiService {
  eventEmitter: EventEmitter<any>;

  searchString: string;
  options: any;

  topContentHtml: SafeHtml;
  mainContentHtml: SafeHtml;
  leftContentHtml: SafeHtml;
  searchContentHtml: SafeHtml;

  historyInfoList: HistoryInfo[];
  historyPos: number;

  aceOptions: any;
  aceText: string;
  anchorClicked: EventEmitter<void>;

  initComponentsData(componentsData: any, renderer: Renderer2);
  deleteListeners();
  refresh();

  loadPage(url: string, saveHistory: boolean, panel?: string);

  onBtnBackClick();
  onBtnForwardClick();
  onBtnEditClick();
  onBtnSaveClick();

  onSearchChange(event: any);
  onSearchClick(event: any);
  doSearch(searchString?: string);

  onAceChange(event: any);

  generateProjectDocumentation(project: any, languageCode?: string, templateDir?: string);
}

/**
 * Service related to wiki
 */
// tslint:disable-next-line: max-classes-per-file
export class WikiService implements IWikiService {
  /**
   * Panel types
   */
  private static Panel = {
    TopPanel: "TopPanel",
    LeftPanel: "LeftPanel",
    MainPanel: "MainPanel",
  };

  /**
   * Tabs
   */
  public static Tabs = {
    HelpTab: "HelpTab",
    CommentsTab: "CommentsTab",
    SearchTab: "SearchTab",
  };

  /**
   * Components data
   */
  public componentsData = {
    topContentComponent: null,
    leftContentComponent: null,
    mainContentComponent: null,
    searchContentComponent: null,
  };

   /**
   * Local Storage Key
   */
   public static localStorageKey = {
    href: "alm-wiki-href",
    endpoint: "alm-wiki-endpoint",
    parentdir: "alm-wiki-dir",
   };

  public topContentHtml: SafeHtml;
  public mainContentHtml: SafeHtml;
  public leftContentHtml: SafeHtml;
  public mainContentUrl: string;
  public mainContentFullUrl: string;
  public mainPageTitle: string;

  public searchContentHtml: SafeHtml;
  private searchResultTemplateHtml = " \
    <h2>Search results{{titleAppend}}</h2> \
    {{searchResults}} \
    ";
  private searchResultInitHtml = "";
  // ' \
  // <h2>Search results</h2> \
  // <div class="wiki-search-result"><a href="#index.html">Index</a></div> \
  // <div class="wiki-search-result"><a href="#left.html">Table of Contents</a></div> \
  // ';

  // Options
  public options: any = {
    isLeftPanelVisible: true,
    isEditMode: false,
    isDirty: false,
    tab: WikiService.Tabs.HelpTab,
  };

  public languageCode = "fr";

  public INDEX_URL = "index.html";
  public LEFT_URL = "left.html";
  public TOP_URL = "top.html";

  public OPEN_VIEW_TAG = "#view/";
  public SELECT_BO_TAG = "#app-selBO/";
  public FUNCTION_TAG = "#function";

  public historyInfoList: HistoryInfo[] = [];
  public historyPos = -1;

  public searchString = "";

  public anchorClicked = new EventEmitter<void>();

  public eventEmitter = new EventEmitter();

  // ACE
  public aceOptions: any = {
    maxLines: 10000,
    printMargin: false,
    useSoftTabs: true,
    tabSize: 2,
    navigateWithinSoftTabs: true,
    wrap: true,
    autoScrollEditorIntoView: undefined,
  };

  // https://codepen.io/rhlee24/pen/PvdNRm
  public aceText = "";

  /**
   * Map of actions
   */
  public actionMap = new Map([
    [
      "toggleEditContent",
      {
        run: (params: any[]) => {
          this.onBtnEditClick();
        },
      },
    ],
    [
      "save",
      {
        run: (params: any[]) => {
          this.onBtnSaveClick();
        },
      },
    ],
    [
      "toggleLeftPanel",
      {
        run: (params: any[]) => {
          this.options.isLeftPanelVisible = !this.options.isLeftPanelVisible;
        },
      },
    ],
    [
      "setLanguage",
      {
        run: (params: any[]) => {
          this.setLanguage(params && params.length > 0 ? params[0] : "en_US");
        },
      },
    ],
    [
      "goHome",
      {
        run: (params: any[]) => {
          this.goHome();
        },
      },
    ],
    [
      "goBack",
      {
        run: (params: any[]) => {
          this.onBtnBackClick();
        },
      },
    ],
    [
      "goForward",
      {
        run: (params: any[]) => {
          this.onBtnForwardClick();
        },
      },
    ],
    [
      "displayHelp",
      {
        run: (params: any[]) => {
          this.options.tab = WikiService.Tabs.HelpTab;
        },
      },
    ],
    [
      "displayComments",
      {
        run: (params: any[]) => {
          this.options.tab = WikiService.Tabs.CommentsTab;
        },
      },
    ],
    [
      "displaySearch",
      {
        run: (params: any[]) => {
          this.options.tab = WikiService.Tabs.SearchTab;
        },
      },
    ],
  ]);

  private apiService: IApiService;
  private translateService: ITranslateService;

  private listenerList = [];

  private sanitizer: any;
  private renderer: Renderer2;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(public servicesService: IServicesService) {
    this.sanitizer = (
      this.servicesService.getService(ServicesConst.InjectableUtilsService) as IInjectableUtilsService
    ).sanitizer;
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
  }

  /**
   * Init the service
   */
  public initService() {
    this.languageCode = this.translateService.languageCode;
    this.mainContentUrl = this.INDEX_URL;
    this.setSearchResult(this.searchResultInitHtml);
  }

  /**
   * Set the search result
   * @param html The html value
   */
  private setSearchResult(html: string) {
    this.searchContentHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * Init the components data
   * @param componentsData Component data
   * @param renderer Renderer
   */
  public initComponentsData(componentsData: any, renderer: Renderer2) {
    this.renderer = renderer;
    this.componentsData = componentsData;
    this.resetListeners();
  }

  /**
   * Reset the listeners
   */
  private resetListeners() {
    this.deleteListeners();
    this.addListener(this.componentsData.topContentComponent);
    this.addListener(this.componentsData.leftContentComponent);
    this.addListener(this.componentsData.mainContentComponent);
    this.addListener(this.componentsData.searchContentComponent);
  }

  /**
   * Add a listener on a component
   * @param component The component
   */
  private addListener(component: any) {
    if (component) {
      this.listenerList.push(
        this.renderer.listen(component.nativeElement, "click", (event) => this.onContentClick(event, component))
      );
    }
  }

  /**
   * Delete the created listeners
   */
  public deleteListeners() {
    this.listenerList.forEach((unlistener: any) => unlistener());
  }

  /**
   * Refresh the wiki panels
   */
  public refresh() {
    this.loadPage(this.mainContentUrl, false, WikiService.Panel.MainPanel);
    this.loadPage(this.LEFT_URL, false, WikiService.Panel.LeftPanel);
    this.loadPage(this.TOP_URL, false, WikiService.Panel.TopPanel);
  }

  /**
   * On link click event
   * @param event The evnt
   * @param component The component
   */
  public onContentClick(event: any, component: any) {
    const target = event.target;
    if (target.tagName.toLowerCase() === "a") {
      try {
        localStorage.setItem(WikiService.localStorageKey.endpoint, target.innerHTML);
        localStorage.setItem(WikiService.localStorageKey.parentdir, target.hash);
        this.anchorClicked.emit();  
        const href: string = target.href;
        // console.log(">> href =", href);
        if (href) {
          const i = href.indexOf("#");
          const pageRef = href.substring(i);

          const message = { type: "onContentClick", event, component, cancel: false };
          this.eventEmitter.emit(message);

          if (message && !(message.cancel === true)) {
            // if (pageRef.indexOf(this.OPEN_VIEW_TAG) > -1) {
            //   const values = pageRef.split("/");
            //   const view = {
            //     type: "diagram-view",
            //     title: values[4],
            //     config: { diagramId: values[3], projectId: values[2] },
            //   };
            //   this.viewService.openView(view);
            // } else if (pageRef.indexOf(this.SELECT_BO_TAG) > -1) {
            //   const values = pageRef.split("/");
            //   const o = null; // TODO this.modelService.getObjectById(null, values[2]);
            //   if (o) {
            //     this.selectionService.selectObjects([o]);
            //   }
            // } else

            if (pageRef.indexOf(this.FUNCTION_TAG) > -1) {
              const values = pageRef.split("?");
              if (values.length > 1) {
                const params = new Map();
                values[1].split("&").forEach((p) => {
                  const nv = p.split("=");
                  if (nv.length > 1) {
                    params.set(nv[0], nv[1]);
                  }
                });
                const functionName = params.get("name");
                const sFunctionParams = this.replaceAll(params.get("params"), "'", '"');
                const functionParams = JSON.parse(sFunctionParams);
                // console.log(">>", this.FUNCTION_TAG, functionName, sFunctionParams, functionParams, values, params, event);
                if (functionName && this[functionName] && functionParams) {
                  this[functionName](functionParams);
                }
              }
            } else if (pageRef !== "#") {
              this.loadPage(pageRef, true);
              if (this.options.tab !== WikiService.Tabs.HelpTab) {
                this.options.tab = WikiService.Tabs.HelpTab;
              }
            }
          }
        }
      } catch (ex) {
        console.log("EXCEPTION", ex);
      }
    }
    event.preventDefault();
  }

  /**
   * Replace all
   * @param s The string
   * @param s1 The string to be replaced
   * @param s2 The value of replacement
   * @returns The transformed string
   */
  public replaceAll(s: string, s1: string, s2: string): string {
    while (s && s1 && s.indexOf(s1) > -1) {
      s = s.replace(s1, s2);
    }
    return s;
  }

  /**
   * Load a page
   * @param url The page url
   * @param saveHistory Save in history
   * @param panel On which panel
   */
  public loadPage(url: string, saveHistory: boolean, panel: string = WikiService.Panel.MainPanel) {
    let fullUrl = url;
    fullUrl = fullUrl.replace("#", "");
    fullUrl = this.languageCode + "/" + fullUrl;

    this.apiService
      .getWikiPage(fullUrl)
      .then((html: string) => {
        if (panel === WikiService.Panel.MainPanel) {
          this.aceText = html;
          this.mainContentUrl = url;
          this.mainContentFullUrl = fullUrl;
          this.mainPageTitle = this.findPageTitle(html);
        }
        this.setHtmlContent(html, panel);
        if (saveHistory && panel === WikiService.Panel.MainPanel) {
          this.saveInHistory(url, this.languageCode, this.mainPageTitle);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Set the html content of a panel
   * @param html The html string value
   * @param panel The panel
   */
  private setHtmlContent(html: string, panel: string = WikiService.Panel.MainPanel) {
    html = this.replaceAll(html, 'src="/wiki/file', 'src="' + this.apiService.serverUrl + "/wiki/file");
    html = this.replaceAll(
      html,
      "http%3A%2F%2Flocalhost:3000/wiki/file",
      "" + this.apiService.serverUrl + "/wiki/file"
    );

    if (panel === WikiService.Panel.TopPanel) {
      this.topContentHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    } else if (panel === WikiService.Panel.LeftPanel) {
      this.leftContentHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    } else {
      this.mainContentHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  // <a href='#app-selBO/e5b4dfdc-edc9-4b13-a643-79a431f250e2/905b8777-5023-4612-a064-fb26947e42c0'>Sélectionner</a>

  // public loadPageFromBo(bo: any) {
  //   if (bo && bo.id) {
  //     const project = this.modelService.getSelectedProject();
  //     if (project) {
  //       this.loadPage("#" + project.id + "/" + bo.id + ".html", true);
  //     }
  //   }
  // }

  /**
   * Save in the history
   * @param url The url
   * @param languageCode The language code
   * @param pageTile The page title
   */
  public saveInHistory(url: string, languageCode: string, pageTile: string) {
    if (url && url !== "") {
      if (this.historyInfoList.length > this.historyPos + 1) {
        this.historyInfoList.splice(this.historyPos + 1);
      }
      this.historyInfoList.push(new HistoryInfo(url, languageCode, pageTile));
      this.historyPos++;
    }
  }

  /**
   * Back button click
   */
  public onBtnBackClick() {
    this.loadHistory(-1);
  }

  /**
   * Forward button click
   */
  public onBtnForwardClick() {
    this.loadHistory(+1);
  }

  /**
   * Load a page of the history
   * @param delta +/-1
   */
  private loadHistory(delta: number) {
    if (this.historyPos + delta < this.historyInfoList.length && this.historyPos + delta >= 0) {
      this.historyPos = this.historyPos + delta;
      const historyInfo = this.historyInfoList[this.historyPos];
      this.loadPage(historyInfo.url, false);
    }
  }

  /**
   * Execute an action
   * @param params The params
   */
  public executeAction(params: any) {
    if (params && params.length > 0) {
      const action: any = this.actionMap.get(params[0]);
      console.log("executeAction", action, params);
      if (action) {
        params.shift();
        action.run(params);
      }
    }
  }

  /**
   * Set the language code
   * @param value The language code string value
   */
  public setLanguage(value: string) {
    this.languageCode = value;
    this.refresh();
  }

  /**
   * Go to home page
   */
  public goHome() {
    this.mainContentUrl = this.INDEX_URL;
    this.refresh();
  }

  /**
   * Toggle edit main page
   */
  public onBtnEditClick() {
    this.options.isEditMode = !this.options.isEditMode;
  }

  /**
   * Save the edited page
   */
  public onBtnSaveClick() {
    this.apiService.postWikiPage(this.mainContentFullUrl, this.aceText);
    this.options.isDirty = false;
  }

  /**
   * On ACE editor change event
   * @param event The event
   */
  public onAceChange(event: any) {
    this.setHtmlContent(this.aceText);
    this.options.isDirty = true;
  }

  /**
   * On search change event
   * @param event Event
   */
  public onSearchChange(event: any) {
    // console.log(event, this.searchString);
  }

  /**
   * On search click event
   * @param event Event
   */
  public onSearchClick(event: any) {
    this.doSearch();
  }

  /**
   * Do search from a string value
   * @param searchString The search string value
   */
  public doSearch(searchString = this.searchString) {
    const searchOptions = {
      // tslint:disable-next-line: object-literal-shorthand
      searchString: searchString,
      languageCode: this.languageCode,
    };

    // TODO translation
    this.setSearchMessage("<p>Searching...</p>");

    this.apiService
      .searchWiki(searchOptions)
      .then((searchData: any) => {
        this.setHtmlResultHtml(searchData);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Set the search message ("searching..." for instance)
   * @param message The text message value
   */
  private setSearchMessage(message: string) {
    this.setSearchResult(message);
  }

  /**
   * Set the html of the search result
   * @param searchData The search data
   */
  private setHtmlResultHtml(searchData: any) {
    // tslint:disable-next-line: prefer-const
    let searchResultListItemTemplateHtml = '<div class="wiki-search-result"><a href="{{href}}">{{title}}</a></div>';

    let searchResultListHtml = "";
    searchData.searchResults.forEach((searchResult: any) => {
      searchResultListHtml +=
        searchResultListItemTemplateHtml
          .replace("{{href}}", searchResult.href)
          .replace("{{title}}", searchResult.title) + "\r\n";
    });

    this.searchResultInitHtml = this.searchResultTemplateHtml
      .replace("{{searchResults}}", searchResultListHtml)
      .replace("{{titleAppend}}", " for '" + searchData.searchOptions.searchString + "':");

    this.setSearchResult(this.searchResultInitHtml);
  }

  /**
   * Find page title in page content
   * @param content String file content
   * @returns The page title if found, null instead
   */
  private findPageTitle(content: string): string {
    let res = null;
    if (content) {
      // Via title html tag
      let pb = content.indexOf("<title>");
      let pe = content.indexOf("</title>");
      if (pb > 0 && pe > 0) {
        res = content.substring(pb + 7, pe);
      } else {
        // via json metadata
        try {
          pb = content.indexOf("{");
          pe = content.indexOf("}");
          if (pb > 0 && pe > 0) {
            const metaDataS = content.substring(pb, pe + 1);
            const metaData = JSON.parse(metaDataS);
            if (metaData && metaData.title) {
              res = metaData.title;
            }
          }
        } catch (ex) {}
      }
    }
    return res;
  }

  /**
   * Generates the documlentation of a project
   * @param project The project
   * @param languageCode The language code
   */
  public generateProjectDocumentation(project: any, languageCode?: string, templateDir?: string) {
    if (project) {
      this.apiService.buildWikiRailml(project, languageCode, templateDir);
    }
  }

  // public executeScript(params: any) {
  //   if (params && params.length > 0) {
  //     this.commandService.execute(new ExecuteScriptCommand(params[0]));
  //   }
  // }

  // public executeCommand(params: any) {
  //   if (params && params.length > 0) {
  //     this.commandService.execute(this.commandFactoryService.buildCommandFromType(params[0]));
  //   }
  // }
}
