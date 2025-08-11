import { Component, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

/**
 * Modal window displaying a message
 */
@Component({
  selector: "app-message-modal",
  templateUrl: "./message-modal.component.html",
  styleUrls: ["./message-modal.component.css"],
})
export class MessageModalComponent implements OnInit {
  public title = "RIGHT VIEWER";
  public message = "...";
  public btnOKLabel = "OK";
  public buttonsDisabled = false;
  public buttonOKDisabled = false;

  /**
   * Construtor
   * @param activeModal Active modal
   */
  constructor(public activeModal: NgbActiveModal) {}

  /**
   * Angular init
   */
  public ngOnInit() {}

  /**
   * Init
   * @param params Parameters
   */
  public init(params: any) {
    if (params) {
      if (params.title) {
        this.title = params.title;
      }
      if (params.message) {
        this.message = params.message;
      }
      if (params.btnOKLabel) {
        this.btnOKLabel = params.btnOKLabel;
      }
      if (params.cb) {
        params.cb(this);
      }
    }
  }

  /**
   * On validate
   */
  public onValidateClick() {
    this.activeModal.close();
  }
}
