import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { IWikiService } from "src/app/services/wiki/wiki.service";

@Component({
  selector: "app-wiki",
  templateUrl: "./wiki.component.html",
  styleUrls: ["./wiki.component.css"],
})
export class WikiComponent implements OnInit, OnDestroy {
  @ViewChild("topContent", { static: true })
  public topContentComponent;

  @ViewChild("leftContent", { static: true })
  public leftContentComponent;

  @ViewChild("mainContent", { static: true })
  public mainContentComponent;

  @ViewChild("searchContent", { static: true })
  public searchContentComponent;

  public wikiService: IWikiService;

  formData = {
    content: "",
  };

  constructor(private renderer: Renderer2, public servicesService: ServicesService) {
    this.wikiService = this.servicesService.getService(ServicesConst.WikiService) as IWikiService;
  }

  public ngOnInit() {
    this.wikiService.initComponentsData(
      {
        topContentComponent: this.topContentComponent,
        leftContentComponent: this.leftContentComponent,
        mainContentComponent: this.mainContentComponent,
        searchContentComponent: this.searchContentComponent,
      },
      this.renderer
    );
    this.refresh();
  }

  public ngOnDestroy() {
    this.wikiService.deleteListeners();
  }

  public refresh() {
    this.wikiService.refresh();
  }
}
