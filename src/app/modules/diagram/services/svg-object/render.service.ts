import { ISvgObjectService } from "./svg-object.service";
import { UtilsService } from "../utils/utils.service";
import { DomSanitizer } from "@angular/platform-browser";

export class RenderService {
  sanitizer: DomSanitizer;

  constructor(private svgObjectService: ISvgObjectService) {}

  private getSanitizer() {
    if (!this.sanitizer) {
      this.sanitizer = UtilsService.instance.sanitizer;
    }
    return this.sanitizer;
  }

  public updateSvgObjectSafeStyle(svgObject: any) {
    if (svgObject) {
      svgObject.safeStyle = this.getSvgObjectSafeStyle(svgObject);
    }
  }

  public getSvgObjectSafeStyle(svgObject: any): string {
    // if (!style) {
    let style = "";
    if (svgObject.fill) {
      style += "fill:" + svgObject.fill + ";";
    } else {
      // style += "fill:none;";
    }
    if (svgObject.stroke) {
      style += "stroke:" + svgObject.stroke + ";";
    }
    if (svgObject.strokeWidth) {
      style += "stroke-width:" + svgObject.strokeWidth + ";";
    }
    if (svgObject.strokeDasharray) {
      style += "stroke-dasharray:" + svgObject.strokeDasharray + ";";
    }
    if (svgObject.fontSize) {
      style += "font-size:" + svgObject.fontSize + ";";
    }
    // }

    if (style !== svgObject.style) {
      svgObject.style = style;
    }
    svgObject.safeStyle = this.getSanitizer().bypassSecurityTrustStyle(style ? style : "");

    // if (style === "stroke-width:2;fill:none;") {
    //   console.log(svgObject, style);
    // }
    return svgObject.safeStyle;
  }

  public updateSvgObjectSafeSvg(svgObject: any) {
    if (svgObject && svgObject.svg) {
      svgObject.safeSvg = this.getSanitizer().bypassSecurityTrustHtml(svgObject.svg);
    }
  }

  public bypassSecurityTrustHtml(html: string): any {
    return this.getSanitizer().bypassSecurityTrustHtml(html);
  }

  public updateSvgObjectTransform(svgObject: any, translate = true, rotateScale = true): string {
    let res = "";
    if (svgObject) {
      res = this.getSvgObjectTransform(svgObject, translate, rotateScale);
      svgObject.transform = res;
    }
    return res;
  }

  public getSvgObjectTransform(svgObject: any, translate = true, rotateScale = true): string {
    let transform = "";
    if (svgObject) {
      //      if (svgObject.transform == undefined) {
      if (true) {
        if (
          translate &&
          svgObject.x !== undefined &&
          svgObject.y !== undefined &&
          (svgObject.svgObjects || svgObject.type.indexOf("handle") > -1)
        ) {
          transform += "translate(" + svgObject.x + ", " + svgObject.y + ") ";
        }
        if (svgObject.translate !== undefined) {
          transform += "translate(" + svgObject.translate + ") ";
        }
        if (rotateScale && svgObject.rotate !== undefined && svgObject.rotate !== 0) {
          transform += "rotate(" + svgObject.rotate + ") ";
        }
        if (rotateScale && svgObject.scale !== undefined) {
          transform += "scale(" + svgObject.scale + ", " + svgObject.scale + ") ";
        }
        if (rotateScale && svgObject.scaleX !== undefined && svgObject.scaleY !== undefined) {
          transform += "scale(" + svgObject.scaleX + ", " + svgObject.scaleY + ") ";
        }
        svgObject.transform = transform;
      }
      transform = svgObject.transform;
    }
    return transform;
  }
}
