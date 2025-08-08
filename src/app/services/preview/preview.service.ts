import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { MvcConst } from "../mvc/mvc.const";
import { IMvcService } from "../mvc/imvc.service";

export interface IPreviewService {
  data: any;
  onPreviewChange(event: any, svgContainerComponent: any);
  calcPreview(svgContainerComponent: any);
  scroll(coord: any, size: any);
}

export class PreviewService implements IPreviewService {
  public data = {
    visibleLeft: 0,
    visibleTop: 0,
    visibleWidth: 500,
    visibleHeight: 200,
    canvasWidth: 10000,
    canvasHeight: 4000,
    activeView: null,
    viewBox: "0 0 10000 4000",
  };
  private svgContainerComponent;
  private mvcService: IMvcService;

  constructor(public servicesService: IServicesService) {}

  public initService() {
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;

    this.mvcService.mvcEvent.subscribe((message) => {
      if (message.type === MvcConst.MSG_MODEL_CHANGED) {
        if (message.view && message.view.config && message.view.config.viewComponent) {
          const viewComponent = message.view.config.viewComponent;
          if (viewComponent.svgContainerComponent) {
            //            viewComponent.svgContainerComponent.scroll(
            //              viewComponent.svgContainerComponent.getScrollPos()
            //            );
            this.onPreviewChange(null, viewComponent.svgContainerComponent);
          }
        }
      }
    });
  }

  public onPreviewChange(event: any, svgContainerComponent: any) {
    this.svgContainerComponent = svgContainerComponent;
    this.calcPreview(svgContainerComponent);
  }

  public calcPreview(svgContainerComponent: any) {
    if (!svgContainerComponent || !svgContainerComponent.getPreviewData) {
      return;
    }
    const data = svgContainerComponent.getPreviewData();
    if (data) {
      data.viewBox = "0 0 " + data.canvasWidth + " " + data.canvasHeight;
      this.data = data;
    }
  }

  public scroll(coord: any, size: any) {
    if (!this.svgContainerComponent) {
      return;
    }
    const delta = { x: 0, y: 0 };
    // Ratio <>
    if (size.width / size.height >= this.data.canvasWidth / this.data.canvasHeight) {
      const kh = size.height / this.data.canvasHeight;
      delta.x = (size.width - this.data.canvasWidth * kh) / 2.0;
    } else {
      const kw = size.width / this.data.canvasWidth;
      delta.y = (size.height - this.data.canvasHeight * kw) / 2.0;
    }
    const scroll = {
      x: Math.round(((coord.x - delta.x) / (size.width - delta.x * 2)) * this.data.canvasWidth),
      y: Math.round(((coord.y - delta.y) / (size.height - delta.y * 2)) * this.data.canvasHeight),
    };
    this.svgContainerComponent.scroll(scroll);
  }
}
