import { Component, OnInit, Input } from "@angular/core";
import { TextViewActionsService } from "./text-view-actions.service";
import { IViewComponent } from "../../../services/view/iview.component";
import { IViewService } from "../../../services/view/view.service";
import { ModelService } from "../../../services/model/model.service";
import { ScriptService } from "../../../services/script/script.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { TranslateService } from "src/app/services/translate/translate.service";

@Component({
  selector: "app-text-view",
  templateUrl: "./text-view.component.html",
  styleUrls: ["./text-view.component.css"],
})
export class TextViewComponent implements OnInit, IViewComponent {
  @Input()
  public config: any = {
    viewComponent: null,
  };

  public viewActionsService = new TextViewActionsService(this);

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

  public script: any;
  public text = "";

  public viewService: IViewService;
  public modelService: ModelService;
  public scriptService: ScriptService;
  public translateService: TranslateService;

  constructor(public servicesService: ServicesService) {
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
    this.scriptService = this.servicesService.getService(ServicesConst.ScriptService) as ScriptService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as TranslateService;
  }

  public ngOnInit() {
    this.config.viewComponent = this;

    if (this.config.scriptId) {
      /*
      this.script = this.modelService.getObjectFromVersionId(
        this.config.versionId,
        this.config.scriptId
      );
*/
    }
    if (!this.script && this.config.script) {
      this.script = this.config.script;
    }
    if (this.script) {
      this.text = this.script.code;
    }
  }

  public isThisView(view: any) {
    return view.type === "text-view" && view.config.scriptId == this.config.scriptId;
  }

  public translateFromMap(text: string): string {
    return this.translateService.translateFromMap(text);
  }

  public onBtnSaveClick() {
    if (this.script) {
      this.script.code = this.text;
    }
  }

  public onBtnExecute() {
    this.scriptService.executeCode(this.text);
  }
}
