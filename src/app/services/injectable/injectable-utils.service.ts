import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxUiLoaderService } from "ngx-ui-loader";

// tslint:disable-next-line: no-empty-interface
export interface IInjectableUtilsService {
  httpClient: HttpClient;
  ngxService: NgxUiLoaderService;
  modalService: NgbModal;
  sanitizer: DomSanitizer;
  router: Router;
}

@Injectable({
  providedIn: "root",
})
/**
 * Injectable utils service
 */
// tslint:disable-next-line: max-classes-per-file
export class InjectableUtilsService implements IInjectableUtilsService {
  constructor(
    public httpClient: HttpClient,
    public ngxService: NgxUiLoaderService,
    public modalService: NgbModal,
    public sanitizer: DomSanitizer,
    public router: Router
  ) {}

  /**
   * Service init
   */
  public initService() {}
}
