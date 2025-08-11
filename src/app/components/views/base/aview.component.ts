import { IMvcService } from "src/app/services/mvc/imvc.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { ITranslateService } from "src/app/services/translate/translate.service";
import { IViewComponent } from "src/app/services/view/iview.component";
import { IViewService } from "src/app/services/view/view.service";

/**
 * Abstract class of a view component
 */
export abstract class AViewComponent implements IViewComponent {
  public viewService: IViewService;
  public mvcService: IMvcService;
  public translateService: ITranslateService;

  /**
   * Constructor
   * @param viewType The view type
   * @param servicesService The ServicesService
   */
  constructor(public viewType: string, public servicesService: ServicesService) {
    this.viewService = this.servicesService.getService(ServicesConst.ViewService) as IViewService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    this.translateService = this.servicesService.getService(ServicesConst.TranslateService) as ITranslateService;
  }

  /**
   * Test is the view is this view
   * @param view The view to be compared to
   * @returns True if it is the same view
   */
  public isThisView(view: any): boolean {
    return view && view.type === this.viewType;
  }

  /**
   * Translates a text
   * @param text The text to be translate
   * @returns The translated text
   */
  public translateFromMap(text: string): string {
    return this.translateService.translateFromMap(text);
  }
}
