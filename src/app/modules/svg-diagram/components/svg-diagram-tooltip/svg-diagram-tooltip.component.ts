import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-svg-diagram-tooltip",
  templateUrl: "./svg-diagram-tooltip.component.html",
  styleUrls: ["./svg-diagram-tooltip.component.css"],
})
/**
 * Tooltip component for svg diagram
 */
export class SvgDiagramTooltipComponent implements OnInit {
  @ViewChild("svgtooltip", { static: false })
  public svgTooltip: ElementRef;

  public tooltipSvgObject: any = null;
  public tooltipHTML = "";

  /**
   * Tooltip template callback
   */
  private _tooltipTemplateCB: any = (): TemplateRef<any> => null;
  get tooltipTemplateCB(): any {
    return this._tooltipTemplateCB;
  }
  set tooltipTemplateCB(value: any) {
    this._tooltipTemplateCB = value;
  }

  /**
   * Tooltip data callback for a related svgObject
   * @param svgObject The svgObject
   * @returns The tooltip data
   */
  private _tooltipDataCB: any = (svgObject: any): any => null;
  public get tooltipDataCB(): any {
    return this._tooltipDataCB;
  }
  public set tooltipDataCB(value: any) {
    this._tooltipDataCB = value;
  }

  /**
   * Constructor
   * @param renderer The renderer
   */
  constructor(public renderer: Renderer2) {}

  /**
   * OnInit function
   */
  public ngOnInit(): void {}

  /**
   * Show the tooltip related to an svgObject
   * refer to example: https://stackblitz.com/edit/angular-svg-tooltip?file=src%2Fapp%2Fapp.component.ts
   * @param event The event
   * @param svgObject The svgObject
   */
  public showTooltip(event: any, svgObject: any) {
    this.tooltipSvgObject = svgObject;
    this.tooltipHTML = "";
    if (svgObject) {
      const target = event.target as HTMLElement;
      const coordinates = target.getBoundingClientRect();
      const x = `${coordinates.left + 40}px`;
      const y = `${coordinates.top - 40}px`;
      this.renderer.setStyle(this.svgTooltip.nativeElement, "left", x);
      this.renderer.setStyle(this.svgTooltip.nativeElement, "top", y);
      this.renderer.setStyle(this.svgTooltip.nativeElement, "display", "block");
    }
  }

  /**
   * Hide the tooltip
   * @param event The event
   * @param svgObject The svgObject
   */
  public hideTooltip(event: any, svgObject: any) {
    this.renderer.setStyle(this.svgTooltip.nativeElement, "display", "none");
    this.tooltipSvgObject = null;
  }

  /**
   * Tooltip template getter
   * @returns The template
   */
  public getTooltipTemplate(): any {
    return this.tooltipTemplateCB ? this.tooltipTemplateCB() : null;
  }

  /**
   * SvgObject getter
   * @returns The svgObject value
   */
  public getTooltipSvgObject(): any {
    return this.tooltipSvgObject;
  }

  /**
   * Default tooltip html value
   * @param svgObject The svgObject
   * @returns The default value
   */
  public getDefautTooltipHtml(svgObject: any): any {
    return this.tooltipHTML;
  }
}
