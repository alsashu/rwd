import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IApiService } from "src/app/services/api/api.service";
import { IGitService } from "src/app/services/git/git-service";
import { ITranslateService } from "src/app/services/translate/translate.service";

/**
 * Git modal states
 */
enum GitModalState {
  EnterGitCloneUrl,
  SelectBranch,
  CheckOut,
  Convert,
  End,
}

/**
 * Git modal component
 */
@Component({
  selector: "app-git-modal",
  templateUrl: "./git-modal.component.html",
  styleUrls: ["./git-modal.component.css"],
})
export class GitModalComponent {
  public title = "RIGHT VIEWER";
  public textLabel = "";
  public gitUrl = "";
  public message = "";
  public btnOKLabel = "OK";
  public buttonsDisabled = false;

  public gitService: IGitService;
  public apiService: IApiService;
  public translateService: ITranslateService;

  public params: any;
  public branches = [];
  public branch = "";

  public gitUrlVisible = true;
  public branchesVisible = false;
  public messageVisible = true;

  public state: GitModalState = GitModalState.EnterGitCloneUrl;

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
    this.params = params;
    this.gitService = params.gitService;
    this.apiService = this.gitService.apiService;
    this.translateService = this.gitService.translateService;
    this.setState(GitModalState.EnterGitCloneUrl);
  }

  /**
   * Set form state
   * @param state The state
   */
  private setState(state: GitModalState) {
    this.state = state;
    if (state === GitModalState.EnterGitCloneUrl) {
      this.title = this.translateService.translateFromMap("Git clone project");
      this.textLabel = this.translateService.translateFromMap("Git clone path");
      this.gitUrl = "";
      this.buttonsDisabled = false;
      this.branch = "";
    } else if (state === GitModalState.SelectBranch) {
      this.gitUrlVisible = false;
      this.message = this.translateService.translateFromMap("Getting branches...");
      this.buttonsDisabled = true;

      this.apiService.gitCloneProject({ gitUrl: this.gitUrl }).then((res: any) => {
        this.buttonsDisabled = false;
        this.message = "";
        if (res.newBranches) {
          if (res.newBranches.length) {
            this.branches = res.newBranches;
            this.branchesVisible = true;
          } else {
            this.message = this.translateService.translateFromMap("No available branch.");
            this.setState(GitModalState.End);
          }
        } else {
          this.message = res.message;
          this.setState(GitModalState.End);
        }
      });
    } else if (state === GitModalState.CheckOut) {
      this.branchesVisible = false;
      this.message = this.translateService.translateFromMap("Checking out branch ") + this.branch + "...";
      this.buttonsDisabled = true;

      this.apiService.gitCheckoutProject({ gitUrl: this.gitUrl, branch: this.branch }).then((res: any) => {
        if (res.result === "ok") {
          this.message = this.translateService.translateFromMap("Project checkout done");
          this.setState(GitModalState.Convert);
        } else {
          this.buttonsDisabled = false;
          this.message = this.translateService.translateFromMap("Error: ") + res.message;
        }
      });
    } else if (state === GitModalState.Convert) {
      this.message = this.translateService.translateFromMap("Converting projects...");
      this.apiService.convertProject().subscribe((res: any) => {
        this.gitService.modelService.reloadProjectList();
        this.message = this.translateService.translateFromMap("Convertion done.");
        this.buttonsDisabled = false;
      });
    } else if (state === GitModalState.End) {
    }
  }

  /**
   * On ok button click event
   */
  public onOKBtnClick() {
    if (this.state === GitModalState.EnterGitCloneUrl) {
      this.setState(GitModalState.SelectBranch);
    } else if (this.state === GitModalState.SelectBranch) {
      if (this.branch && this.branch.length) {
        this.setState(GitModalState.CheckOut);
      }
    } else if (this.state === GitModalState.Convert || this.state === GitModalState.End) {
      this.activeModal.close("done");
    }
  }
}
