import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { IServicesService } from "../services/iservices.service";
import { TextModalComponent } from "../../components/modal/text-modal/text-modal.component";
import { MessageModalComponent } from "../../components/modal/message-modal/message-modal.component";
import { VerificationModalComponent } from "../../components/modal/verification-modal/verification-modal.component";
import { IModalViewService } from "./imodal-view.service";
import { SearchOptionsModalComponent } from "src/app/components/modal/search-options-modal/search-options-modal.component";
import { IInjectableUtilsService } from "../injectable/injectable-utils.service";
import { ServicesConst } from "../services/services.const";
import { GitModalComponent } from "src/app/components/modal/git-modal/git-modal.component";
import { UploadProjectModalComponent } from "src/app/components/modal/upload-project-modal/upload-project-modal.component";
import { CompareProjectsModalComponent } from "src/app/components/modal/compare-projects-modal/compare-projects-modal.component";

/**
 * Service managing modal dialogs
 */
export class ModalViewService implements IModalViewService {
  public modalService: NgbModal;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(public servicesService: IServicesService) {}

  /**
   * Init the service
   */
  public initService() {
    this.modalService = (
      this.servicesService.getService(ServicesConst.InjectableUtilsService) as IInjectableUtilsService
    ).modalService;
  }

  /**
   * Open TextModal dialog
   * @param params The parameters
   * @param cbOK The OK call back function
   */
  public openTextModal(params: any = { text: "test", textLabel: "Text" }, cbOK: any) {
    const modal: NgbModalRef = this.modalService.open(TextModalComponent, { size: "lg", backdrop: "static" });
    (modal.componentInstance as TextModalComponent).init(params);
    modal.result.then(
      (result) => {
        if (cbOK) {
          cbOK(result);
        }
      },
      (reason) => {}
    );
  }

  // /**
  //  * Open FormModal dialog
  //  * @param params The parameters
  //  * @param cbOK The OK call back function
  //  */

  // public openFormModal(params: any = { object: {} }, cbOK: any) {
  //   const modal: NgbModalRef = this.modalService.open(FormModalComponent, {});
  //   (modal.componentInstance as FormModalComponent).init(params);
  //   modal.result.then(
  //     (result) => {
  //       if (cbOK) {
  //         cbOK(result);
  //       }
  //     },
  //     (reason) => {}
  //   );
  // }

  /**
   * Open MessageModal dialog
   * @param params The parameters
   * @param cbOK The OK call back function
   */
  public openMessageModalComponent(params: any = { object: {} }, cbOK: any) {
    const modal: NgbModalRef = this.modalService.open(MessageModalComponent, {});
    (modal.componentInstance as MessageModalComponent).init(params);
    modal.result.then(
      (result) => {
        if (cbOK) {
          cbOK(result);
        }
      },
      (reason) => {}
    );
  }

  /**
   * Open GitModal dialog
   * @param params The parameters
   * @param cbOK The OK call back function
   */
  public openGitModalComponent(params: any = { object: {} }, cbOK: any) {
    const modal: NgbModalRef = this.modalService.open(GitModalComponent, { size: "lg", backdrop: "static" });
    (modal.componentInstance as GitModalComponent).init(params);
    modal.result.then(
      (result) => {
        if (cbOK) {
          cbOK(result);
        }
      },
      (reason) => {}
    );
  }

  /**
   * Open UploadProjectModal dialog
   * @param params The parameters
   * @param cbOK The OK call back function
   */
  public openUploadProjectModalComponent(params: any = { object: {} }, cbOK: any) {
    const modal: NgbModalRef = this.modalService.open(UploadProjectModalComponent, { size: "lg", backdrop: "static" });
    (modal.componentInstance as UploadProjectModalComponent).init(params);
    modal.result.then(
      (result) => {
        if (cbOK) {
          cbOK(result);
        }
      },
      (reason) => {}
    );
  }

  /**
   * Open VerificationModal dialog
   * @param params The parameters
   * @param cbOK The OK call back function
   */
  public openVerificationModalComponent(params: any = { object: {} }, cbOK: any) {
    const modal: NgbModalRef = this.modalService.open(VerificationModalComponent, { size: "lg", backdrop: "static" });
    (modal.componentInstance as VerificationModalComponent).init(params);
    modal.result.then(
      (result) => {
        if (cbOK) {
          cbOK(result);
        }
      },
      (reason) => {}
    );
  }

  /**
   * Open SearchOptions dialog
   * @param params The parameters
   * @param cbOK The OK call back function
   */
  public openSearchOptionsModal(params: any = { object: {} }, cbOK: any) {
    const modal: NgbModalRef = this.modalService.open(SearchOptionsModalComponent, { backdrop: "static" });
    (modal.componentInstance as SearchOptionsModalComponent).init(params);
    modal.result.then(
      (result) => {
        if (cbOK) {
          cbOK(result);
        }
      },
      (reason) => {}
    );
  }

  /**
   * Open CompareProjectsModal dialog
   * @param params The parameters
   * @param cbOK The OK call back function
   */
  public openCompareProjectsModalComponent(params: any = { object: {} }, cbOK: any) {
    const modal: NgbModalRef = this.modalService.open(CompareProjectsModalComponent, {
      size: "lg",
      backdrop: "static",
    });
    (modal.componentInstance as CompareProjectsModalComponent).init(params);
    modal.result.then(
      (result) => {
        if (cbOK) {
          cbOK(result);
        }
      },
      (reason) => {}
    );
  }
}
