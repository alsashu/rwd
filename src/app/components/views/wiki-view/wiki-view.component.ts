import { Component, OnInit, Input, ViewChild, Renderer2, OnDestroy } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { WikiViewActionsService } from "./wiki-view-actions.service";
import { IWikiService } from "src/app/services/wiki/wiki.service";
import { WikiComponent } from "./wiki/wiki.component";
import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IModelService } from "src/app/services/model/model.service";
import { MvcConst } from "src/app/services/mvc/mvc.const";
import { AViewComponent } from "../base/aview.component";

@Component({
  selector: "app-wiki-view",
  templateUrl: "./wiki-view.component.html",
  styleUrls: ["./wiki-view.component.css"],
})
/**
 * Wiki view component
 */
export class WikiViewComponent extends AViewComponent implements OnInit, OnDestroy {
  public static viewType = "wiki-view";

  @ViewChild("wikiComponent", { static: true })
  public wikiComponent: WikiComponent;

  @Input()
  public config: any = {
    viewComponent: null,
    selectedBo: null,
    selectedUrl: null,
  };

  public viewActionsService = new WikiViewActionsService(this);

  private OPEN_VIEW_TAG = "#view/";
  private SELECT_BO_TAG = "#app-selBO/";
  // private FUNCTION_TAG = "#function";

  public mvcEventSubscription: any;

  public wikiService: IWikiService;
  private selectionService: ISelectionService;
  private modelService: IModelService;

  /**
   * Constructor
   * @param sanitizer
   * @param renderer
   * @param servicesService
   */
  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2, public servicesService: ServicesService) {
    super(WikiViewComponent.viewType, servicesService);

    this.wikiService = this.servicesService.getService(ServicesConst.WikiService) as IWikiService;
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as IModelService;
  }

  /**
   * OnInit angular function
   */
  public ngOnInit() {
    this.config.viewComponent = this;
    this.wikiService.eventEmitter.subscribe((message: any) => {
      this.onWikiServiceMessage(message);
    });
    this.initMvc();

    if (this.config && this.config.selectedBo) {
      this.loadPageFromBo(this.config.selectedBo);
    }
  }

  /**
   * OnDestroy angular function
   */
  public ngOnDestroy() {
    if (this.mvcEventSubscription) {
      this.mvcEventSubscription.unsubscribe();
    }
  }

  /**
   * Init the MVC message subscription
   */
  public initMvc() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      if ([MvcConst.MSG_OPEN_BO_DOCUMENTATION_REQUEST].includes(message.type)) {
        this.loadPageFromBo(message.object);
      } else {
        if ([MvcConst.MSG_OPEN_URL_DOCUMENTATION_REQUEST].includes(message.type)) {
          this.wikiService.loadPage(message.url, true);
        }
      }
    });
  }

  /**
   * Tests if this is this view
   * @param view A view
   * @returns Boolean
   */
  public isThisView(view: any): boolean {
    return view.type === "wiki-view";
  }

  /**
   * Refresh the view
   */
  public refresh() {
    this.wikiComponent.refresh();
  }

  /**
   * Manage a wiki service message
   * @param message The message
   */
  public onWikiServiceMessage(message: any) {
    // console.log("wikiService service", message);

    if (message && message.type === "onContentClick") {
      const event = message.event;
      const target = event.target;
      if (target.tagName.toLowerCase() === "a") {
        try {
          const href: string = target.href;
          // console.log(">> href =", href);
          if (href) {
            const i = href.indexOf("#");
            const pageRef = href.substring(i);

            if (pageRef.indexOf(this.OPEN_VIEW_TAG) > -1) {
              const values = pageRef.split("/");
              const view = {
                type: "diagram-view",
                title: values[4],
                config: { diagramId: values[3], projectId: values[2] },
              };
              // TODO
              // this.viewService.openView(view);
              message.cancel = true;
            } else if (pageRef.indexOf(this.SELECT_BO_TAG) > -1) {
              const values = pageRef.split("/");
              if (values.length > 2) {
                const o = this.modelService.getObjectById(null, values[2]);
                if (o) {
                  this.selectionService.selectObjects([o]);
                }
              }
              message.cancel = true;
            }
          }
        } catch (ex) {
          console.log("EXCEPTION", ex);
        }
      }
    }
  }

  /**
   * Loads a page related to an object
   * @param bo The object
   */
  public loadPageFromBo(bo: any) {
    if (bo && bo.id) {
      const project = this.modelService.getSelectedProject();
      if (project) {
        this.wikiService.loadPage("#generated/" + project.label + "/" + bo.type + "-" + bo.id + ".html", true);
      }
    }
  }
}
