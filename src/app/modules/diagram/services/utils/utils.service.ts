import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor(public sanitizer: DomSanitizer) {
    UtilsService.instance = this;
  }

  static instance: any;
}
