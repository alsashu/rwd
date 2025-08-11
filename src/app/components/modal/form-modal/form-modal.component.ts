import { Component, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ServicesService } from "src/app/services/services/services.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ModelPropertiesService } from "src/app/services/model/model-properties.service";

@Component({
  selector: "app-form-modal",
  templateUrl: "./form-modal.component.html",
  styleUrls: ["./form-modal.component.css"],
})
export class FormModalComponent implements OnInit {
  public object: any = {};
  public properties = [];
  public excludedProperties = [];

  public title = "Paramètres";
  public btnOKLabel = "Valider";

  public modelPropertiesService: ModelPropertiesService;

  constructor(public activeModal: NgbActiveModal, public servicesService: ServicesService) {
    this.modelPropertiesService = this.servicesService.getService(
      ServicesConst.ModelPropertiesService
    ) as ModelPropertiesService;
  }

  public ngOnInit() {}

  public init(params: any) {
    if (params) {
      if (params.title) {
        this.title = params.title;
      }
      if (params.btnOKLabel) {
        this.btnOKLabel = params.btnOKLabel;
      }
      this.setObject(params.object);
    }
  }

  public setObject(object: any) {
    this.object = object;
    this.updateProperties();
  }

  public updateProperties() {
    this.properties = this.modelPropertiesService.getObjectProperties(this.object, this.excludedProperties);
  }

  public getProperties(): any[] {
    if (!this.properties) {
      this.updateProperties();
    }
    return this.properties;
  }

  public validateProperties() {
    this.properties.forEach((property) => {
      if (this.object[property.name] !== undefined) {
        this.object[property.name] = property.value;
      }
    });
  }

  public onValidateClick() {
    this.validateProperties();
    this.activeModal.close(this.object);
  }
}
