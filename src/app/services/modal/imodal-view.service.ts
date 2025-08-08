import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

/**
 * Interface of the Modal View Service
 */
export interface IModalViewService {
  modalService: NgbModal;
  openVerificationModalComponent(params: any, cbOK: any);
  openSearchOptionsModal(params: any, cbOK: any);
  openTextModal(params: any, cbOK: any);
  openMessageModalComponent(params: any, cbOK: any);
  openGitModalComponent(params: any, cbOK: any);
  openUploadProjectModalComponent(params: any, cbOK: any);
  openCompareProjectsModalComponent(params: any, cbOK: any);
}
