import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone,
  HostListener,
  Renderer2,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DiagramController } from "./diagram.controller";
import { UtilsService } from "../../services/utils/utils.service";
import { DiagramEvent } from "../../services/diagram/diagram-event";

export interface IDiagramComponent {
  diagramController: DiagramController;
}

@Component({
  selector: "app-diagram",
  templateUrl: "./diagram.component.html",
  styleUrls: ["./diagram.component.css"],
})
export class DiagramComponent implements OnInit, OnDestroy, IDiagramComponent {
  @Input()
  public contexteMenu: any;

  @ViewChild("svg", { static: true })
  public svgRef: ElementRef;

  @ViewChild("svgTooltip", { static: false })
  public svgTooltipRef: ElementRef;

  public _hasFocus = false;

  public isInfoPanelPined = true;
  public isMouseOverInfoPanel = false;

  public config: any = {
    mode: "diagram",
    width: 200000,
    height: 10000,
    center: false,
    grid: {
      isVisible: true,
      isActive: true,
      rnd: 10,
    },
    display: {
      speedMode: false,
      priorityLevel: 0,
      isTooltipVisible: true,
    },
    selection: {
      isVisible: false,
      path: "M10 10 h200 v100 h-200 v-100 Z",
    },

    image: {
      isVisible: false,
      url: "assets/poste-26-1.png",
    },
  };

  public svgProperties = {
    svgWidth: 200000,
    svgHeight: 10000,
    zoom: 1.0,
    zoomK: 1.2,

    // Used by svg tag
    viewBox: "0 0 200000 10000",
    width: 200000 * 1,
    height: 10000 * 1,
  };

  public previewData: any;

  public diagramController: DiagramController = new DiagramController(this);

  constructor(
    public el: ElementRef,
    public changeDetectorRef: ChangeDetectorRef,
    public ngZone: NgZone,
    public sanitizer: DomSanitizer,
    public renderer: Renderer2,
    public utilsService: UtilsService
  ) {}

  public ngOnInit() {
    this.getEventController().onInit();
  }

  public ngOnDestroy() {
    this.diagramController.onDestroy();
    this.getEventController().onDestroy();
  }

  public getDiagram() {
    return this.diagramController.diagramService.diagram;
  }

  public getEventController() {
    return this.diagramController.eventController;
  }

  public getDiagramComponentNativeElement() {
    return this.el.nativeElement;
  }

  public refresh() {
    this.detectChanges();
  }

  private detectChanges() {
    this.changeDetectorRef.detectChanges();
  }

  public focus() {
    this.svgRef.nativeElement.focus();
  }

  public hasFocus(): boolean {
    return this._hasFocus;
  }

  public setHasFocus(value: boolean) {
    this._hasFocus = value;
    this.diagramController.diagramService.emitDiagramEvent(
      new DiagramEvent({
        type: value ? DiagramEvent.GainedFocus : DiagramEvent.LostFocus,
        object: this.diagramController.diagramService.diagram,
      })
    );
  }

  @HostListener("window:keydown", ["$event"])
  public onKeyDownEvent(event: KeyboardEvent) {
    this.getEventController().onKeyDown(event);
  }

  public updateSelectionRect(isVisible: boolean, rect = null) {
    this.config.selection.isVisible = isVisible;
    if (rect) {
      this.config.selection.path =
        "M" +
        String(rect.x) +
        " " +
        String(rect.y) +
        " h" +
        String(rect.width) +
        " v" +
        String(rect.height) +
        " h" +
        String(-rect.width) +
        " v" +
        String(-rect.height) +
        " ";
    }
  }

  // TODO TEST
  public closeTooltip() {
    if (this.svgTooltipRef) {
      console.log(this.svgTooltipRef);
      // this.svgTooltipRef.nativeElement.close();
    }
    // if (this.svgTooltip) {
    //   this.svgTooltip.close();
    // }
  }

  // public getTooltipTemplate(): any {
  //   return this.toolTipTemplate;
  // }
}
