import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

/**
 * Text modal component
 */
@Component({
  selector: "app-text-modal",
  templateUrl: "./text-modal.component.html",
  styleUrls: ["./text-modal.component.css"],
})
export class TextModalComponent {
  public title = "RIGHT VIEWER";
  public textLabel = "";
  public btnOKLabel = "OK";
  public rows = 13;

  public formData = {
    text: "",
  };

  /**
   * Constructor
   * @param activeModal
   */
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Init function
   * @param params Params
   */
  public init(params: any) {
    if (params) {
      if (params.title) {
        this.title = params.title;
      }
      if (params.textLabel) {
        this.textLabel = params.textLabel;
      }
      if (params.rows) {
        this.rows = params.rows;
      }
      if (params.text) {
        this.formData.text = params.text;
      }
      if (params.btnOKLabel) {
        this.btnOKLabel = params.btnOKLabel;
      }
    }
  }
}
