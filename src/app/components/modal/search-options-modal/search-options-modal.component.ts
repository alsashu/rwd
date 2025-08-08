import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ServicesService } from "src/app/services/services/services.service";

@Component({
  selector: "app-search-options-modal",
  templateUrl: "./search-options-modal.component.html",
  styleUrls: ["./search-options-modal.component.css"],
})
/**
 * Search options modal component
 */
export class SearchOptionsModalComponent implements OnInit {
  /**
   * Parameters
   */
  public params = {
    formData: {
      caseSensitive: false,
      namesOrPropertiesOnly: false,
      filterObjectType: "*",
      filterPropertyName: "",
    },
  };

  /**
   * Constructor
   * @param activeModal NgbActiveModal
   * @param servicesService The services service
   */
  public constructor(public activeModal: NgbActiveModal, public servicesService: ServicesService) {}

  /**
   * ngOnInit
   */
  public ngOnInit() {}

  /**
   * Modal view init
   * @param params The parameters
   */
  public init(params: any) {
    this.params = params;
  }

  /**
   * On validate click
   */
  public onValidateClick() {
    if (!this.params.formData.filterObjectType || this.params.formData.filterObjectType === "") {
      this.params.formData.filterObjectType = "*";
    }
    this.activeModal.close(this.params);
  }
}
