import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { cloneDeep } from "lodash";
import { PropertiesViewActionsService } from "./properties-view-actions.service";
import { PropertiesComponent } from "../../../components/app/properties/properties.component";
import { IViewComponent } from "../../../services/view/iview.component";
import { ISelectionService } from "../../../common/services/selection/selection.service";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { AViewComponent } from "../base/aview.component";
import { ICompareService } from "src/app/services/compare/compare.service";

@Component({
  selector: "app-properties-view",
  templateUrl: "./properties-view.component.html",
  styleUrls: ["./properties-view.component.css"],
})
/**
 * Properties view component
 */
export class PropertiesViewComponent extends AViewComponent implements OnInit, OnDestroy, IViewComponent {
  public static viewType = "properties-view";

  public static objectTypes = {
    boType: 1,
    goType: 2,
    libType: 3,
  };

  @ViewChild(PropertiesComponent, { static: true })
  public propertiesComponent: PropertiesComponent;

  public viewActionsService = new PropertiesViewActionsService(this);

  public options = {
    isSelectionVisible: true,
    isReadOnly: true,
    getObjectList: () => this.getObjectList(),
    getDebugData: (o: any) => this.getDebugData(o),
  };

  public objectType = PropertiesViewComponent.objectTypes.boType;

  private modelConfig = {
    cleanSvgObjectProperties: ["diagram", "parent", "parentDiagram", "metaData"],
  };

  private refreshTimeOut = null;
  private refreshDelayMs = 400;
  private mvcEventSubscription: any;

  private selectionService: ISelectionService;

  /**
   * Constructor
   * @param changeDetectorRef The ChangeDetectorRef
   * @param servicesService The ServicesService
   */
  constructor(public changeDetectorRef: ChangeDetectorRef, public servicesService: ServicesService) {
    super(PropertiesViewComponent.viewType, servicesService);
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.mvcEventSubscription = this.mvcService.mvcEvent.subscribe((message: any) => {
      this.refreshWithDelay();
    });
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    if (this.mvcEventSubscription) {
      this.mvcEventSubscription.unsubscribe();
    }
  }

  /**
   * Refresh the view
   */
  public refresh() {
    this.propertiesComponent.refresh();
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Refresh the view with a delay
   */
  public refreshWithDelay() {
    clearTimeout(this.refreshTimeOut);
    this.refreshTimeOut = setTimeout(() => {
      this.refresh();
    }, this.refreshDelayMs);
  }

  /**
   * Get propertiesComponent options
   * @returns The options
   */
  public getPcOptions() {
    return this.propertiesComponent.options;
  }

  /**
   * Get the list of objects to which properties are displayed
   * @returns The list of objects
   */
  private getObjectList(): any[] {
    let objectList = [];
    if (this.objectType === PropertiesViewComponent.objectTypes.boType) {
      objectList = this.selectionService.getSelectedObjects();
    } else if (this.objectType === PropertiesViewComponent.objectTypes.libType) {
      objectList = this.selectionService.getSelectedLibraryObjects();
    } else if (this.objectType === PropertiesViewComponent.objectTypes.goType) {
      objectList = this.selectionService.getSelectedSvgObjects();
    }
    return objectList;
  }

  /**
   * Get debug data in json format
   * @param object The object
   * @returns The stringified json debug data
   */
  private getDebugData(object: any): string {
    let debugData = null;
    if (object) {
      try {
        // tslint:disable-next-line: prefer-conditional-expression
        if (this.objectType === PropertiesViewComponent.objectTypes.goType) {
          debugData = JSON.stringify(this.cleanSvgObjectRec(cloneDeep(object)), null, "  ");
        } else {
          debugData = JSON.stringify(this.cleanBo(cloneDeep(object)), null, "  ");
        }
      } catch (e) {
        // console.log("EXCEPTION", e);
      }
    }
    return debugData;
  }

  /**
   * Clean a business object to avoid circular depencies when json stringify
   * @param bo The object
   * @returns The cleaned object
   */
  private cleanBo(bo: any) {
    return bo;
  }

  /**
   * Recursively clean an object to avoid circular depencies when json stringify
   * @param svgObject The svg object
   * @returns The svg object
   */
  private cleanSvgObjectRec(svgObject: any) {
    this.modelConfig.cleanSvgObjectProperties.forEach((prop: any) => delete svgObject[prop]);
    if (svgObject.svgObjects) {
      svgObject.svgObjects.forEach((child: any) => this.cleanSvgObjectRec(child));
    }
    return svgObject;
  }

  /**
   * Select the type of object to be displayed (business, graphical or library object)
   * @param value The type of object
   */
  public selectObjectType(value: number) {
    this.objectType = value;
    this.refresh();
  }
}
