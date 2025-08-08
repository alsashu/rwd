import { DiagramComponent } from "./diagram.component";
import { DiagramEventController } from "./diagram-event.controller";
import { DiagramService } from "../../services/diagram/diagram.service";
import { RenderService } from "../../services/svg-object/render.service";
import { DecorationService } from "../../services/svg-object/decoration.service";
import { SvgObjectService } from "../../services/svg-object/svg-object.service";
import { TemplateRef } from "@angular/core";

export interface IDiagramController {
  diagramService: DiagramService;
  diagramComponent: DiagramComponent;
  eventController: DiagramEventController;

  hasFocus(): boolean;
  getDiagramComponentNativeElement(): any;
  refresh();
}

export class DiagramController implements IDiagramController {
  public getToolTipTemplateCB = (): TemplateRef<any> => null;

  public diagramService: DiagramService;
  public eventController: DiagramEventController = new DiagramEventController(this.diagramComponent);
  public svgObjectService: SvgObjectService;
  public renderService: RenderService;
  public decorationService: DecorationService;

  constructor(public diagramComponent: DiagramComponent) {
    this.diagramService = new DiagramService(this);
    this.svgObjectService = this.diagramService.svgObjectService;
    this.renderService = this.svgObjectService.renderService;
    this.decorationService = this.svgObjectService.decorationService;
  }

  public onDestroy() {
    this.diagramService.onDestroy();
  }

  public refresh() {
    this.diagramComponent.refresh();
  }

  public getDiagramComponentNativeElement() {
    return this.diagramComponent.getDiagramComponentNativeElement();
  }

  public hasFocus(): boolean {
    return this.diagramComponent.hasFocus();
  }

  public focus() {
    this.diagramComponent.focus();
  }

  public getOrgCoord(): { x: number; y: number } {
    return this.diagramService ? this.diagramService.getOrgCoord() : { x: 0, y: 0 };
  }

  public getDefautTooltipHtml(svgObject: any): any {
    let html = "<div>";
    if (svgObject && svgObject.bo) {
      html += svgObject.bo.label ? "<div><b>" + svgObject.bo.label + "</b></div>" : "";
      html += svgObject.bo.type ? "<div>" + svgObject.bo.type + "</div>" : "";
      // if (svgObject.projectName) {
      //   html += "<div>" + svgObject.projectName + "</div>";
      // }
    }
    html += "</div>";
    return this.renderService.bypassSecurityTrustHtml(html);
  }

  public getTooltipTemplate(): TemplateRef<any> {
    return this.getToolTipTemplateCB ? this.getToolTipTemplateCB() : null;
  }
}
