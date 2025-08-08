import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-verification-tooltip",
  templateUrl: "./verification-tooltip.component.html",
  styleUrls: ["./verification-tooltip.component.css"],
})
/**
 * Verification tool tip component
 */
export class VerificationTooltipComponent implements OnInit {
  @Input()
  public ttData?: any;

  constructor() {}

  public ngOnInit(): void {}
}
