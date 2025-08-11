import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { IWikiCommentService } from "src/app/services/wiki/wiki-comment.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesService } from "src/app/services/services/services.service";
import { IUserService } from "src/app/services/user/user.service";
import { IWikiService } from "src/app/services/wiki/wiki.service";

declare var $;

@Component({
  selector: "app-wiki-comment-panel",
  templateUrl: "./wiki-comment-panel.component.html",
  styleUrls: ["./wiki-comment-panel.component.css"],
})

/**
 * WikiCommentPanelComponent is responsible for displaying and managing comments on a wiki page.
 */
export class WikiCommentPanelComponent {
  @ViewChild("summernote", { static: true }) summernoteElement!: ElementRef;
  @Input() content: string = "";
  @Output() contentChange = new EventEmitter<string>();

  private commentService: IWikiCommentService;
  private wikiService: IWikiService;
  private userService: IUserService;
  public commenList: any;
  public isEditMode: boolean = false;
  public selectedId: string;
  public selectedUser: string;
  public role: string;

  public isTyping: boolean = false;
  public isSummernoteVisible: boolean = false;

  public currentUser: string;

  /**
   * Constructor for WikiCommentPanelComponent.
   * @param servicesService
   * @param sanitizer
   */
  constructor(
    public servicesService: ServicesService,
    private sanitizer: DomSanitizer
  ) {
    this.commentService = this.servicesService.getService(
      ServicesConst.CommentService
    ) as IWikiCommentService;
    this.wikiService = this.servicesService.getService(
      ServicesConst.WikiService
    ) as IWikiService;
    this.userService = this.servicesService.getService(
      ServicesConst.UserService
    ) as IUserService;
  }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser().userName;
    this.initEditor();
    this.refreshComments();
    this.initToolbarHoverEffect();
    this.role = sessionStorage.getItem("roles");
  }

  ngOnDestroy() {
    $(this.summernoteElement.nativeElement).summernote("destroy");
    this.wikiService.anchorClicked.unsubscribe();
  }

  /**
   * Fetches comments for the wiki page.
   */
  getWikiComments() {
    let commentData = this.commentService.getWikiComments().then((data) => {
      this.commenList = data;
    });
  }

  /**
   * Fetches comments for the current wiki page.
   */
  getWikiPageComments() {
    let commentData = this.commentService.getWikiPageComments().then((data) => {
      this.commenList = data;
    });
  }

  /**
   * Saves the wiki comment.
   */
  saveWikiComment() {
    const comment = $(this.summernoteElement.nativeElement).summernote("code");
    if (this.isNullOrEmpty(comment)) {
      this.commentService.storeWikiComment(comment);
      this.clearSummernote();
      this.getWikiPageComments();
      this.wikiService.refresh();
    }
  }

  /**
   * Sanitizes HTML input to prevent XSS attacks.
   * @param input The HTML input to sanitize.
   * @returns SafeHtml
   */
  sanitizeHTML(input: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(input);
  }

  /**
   * Deletes a wiki comment.
   * @param id The ID of the comment to delete.
   */
  deleteWikiComment(id: string) {
    const userConfirmed = confirm(
      "Are you sure you want to delete this comment?"
    );
    if (userConfirmed) {
      this.commentService.removeWikiPageComment(id);
      this.getWikiPageComments();
      this.wikiService.refresh();
      this.refreshComments();
    }
  }

  /**
   * Edits a wiki comment.
   */
  editWikiComment() {
    const comment = $(this.summernoteElement.nativeElement).summernote("code");
    this.commentService.editedWikiComment(
      this.selectedId,
      this.selectedUser,
      comment
    );
    this.getWikiPageComments();
    this.wikiService.refresh();
    this.clearSummernote();
    this.isEditMode = false;
  }

  /**
   * Gets a wiki comment by its ID and username.
   * @param id The ID of the comment.
   * @param username The username of the comment author.
   */
  getWikiCommentById(id: string, username: string) {
    this.selectedId = id;
    this.selectedUser = username;
    let commentData = this.commentService
      .getWikiPageCommentById(id)
      .then((data) => {
        $(this.summernoteElement.nativeElement).summernote(
          "code",
          data.comment
        );
      });
    this.isEditMode = true;
  }

  /**
   * Clears the Summernote editor content.
   */
  clearSummernote() {
    // Check if summernoteRef is defined
    if (this.summernoteElement) {
      const summernoteElement = $(this.summernoteElement.nativeElement); // Use jQuery to select the element
      summernoteElement.summernote("reset"); // Clear the Summernote editor's content
      this.content = "";
    }

    console.log("Content reset and stored!");
  }

  /**
   * Refreshes the comments section.
   */
  refreshComments() {
    this.wikiService.anchorClicked.subscribe(() => {
      setTimeout(() => {
        this.getWikiPageComments();
      }, 300);
    });
    this.getWikiPageComments();
  }

  /**
   * Initializes the Summernote editor.
   */
  initEditor() {
    $(this.summernoteElement.nativeElement).summernote({
      height: 50,
      placeholder: "Write your comment here...",
      //airMode: true,
      callbacks: {
        onInit: () => {
          $(this.summernoteElement.nativeElement).summernote(
            "code",
            "this.content"
          );
          //this.isTyping=true;
        },
        onChange: (contents, $editable) => {
          this.contentChange.emit(contents);
        },
      },
    });
    $(this.summernoteElement.nativeElement).summernote("code", this.content);
  }

  /**
   * Initializes the toolbar hover effect for the Summernote editor.
   */
  initToolbarHoverEffect() {
    $(".note-toolbar").css("visibility", "hidden");

    const $editor = $(this.summernoteElement.nativeElement).parent();
    $editor.hover(
      () => {
        $editor.find(".note-toolbar").css("visibility", "visible");
      },
      () => {
        $editor.find(".note-toolbar").css("visibility", "hidden");
      }
    );
  }

  /**
   * Checks if the current user is the same as the provided username or if the user is an admin.
   * @param username The username to check against the current user.
   * @returns boolean indicating if the current user is the same or an admin.
   */
  isUserOrAdmin(username): boolean {
    return (
      this.currentUser.toLowerCase() === username.toLowerCase() ||
      this.currentUser.toLowerCase() === "admin"
    );
  }

  /**
   * Checks if the input is null or empty.
   * @param input The input string to check.
   * @returns boolean indicating if the input is null or empty.
   */
  isNullOrEmpty(input: string): boolean {
    const result = true;

    if (
      input === "<p><br></p>" ||
      input === "" ||
      input.replace(/&nbsp;/g, "").trim() === ""
    ) {
      alert("Editor should not be empty or contain only spaces.");
      return false;
    }
    return result;
  }

  /**
   * Initializes the toolbar hover effect for the Summernote editor (version 1).
   * This method is a variation of initToolbarHoverEffect that uses a different approach.
   */
  initToolbarHoverEffect_v1() {
    const wrapper = $(this.summernoteElement.nativeElement).closest(
      ".summernote-wrapper"
    );

    wrapper.hover(
      () => {
        wrapper.find(".note-toolbar").css("visibility", "visible");
      },
      () => {
        wrapper.find(".note-toolbar").css("visibility", "hidden");
      }
    );
  }

  /**
   * Initializes the toolbar hover effect for the Summernote editor (version 2).
   * This method is another variation of initToolbarHoverEffect that uses a different approach.
   */
  showSummernote() {
    this.isSummernoteVisible = true;
    $(this.summernoteElement.nativeElement).summernote("focus");
  }

  /**
   * Hides the Summernote editor if the content is empty or contains only a line break.
   */
  hideSummernote() {
    const content = $(this.summernoteElement.nativeElement).summernote(
      "code"
    ).trim;

    if (!content || content === "<p><br></p>") {
      this.isSummernoteVisible = false;
    }
  }

  /**
   * Toggles the visibility of the Summernote editor.
   */
  lockSummernote() {
    if (!this.isTyping) {
      this.isSummernoteVisible = true;
    }
  }

  /**
   * Unlocks the Summernote editor if the user is not typing.
   * This method is called when the user stops typing.
   */
  unlockSummernote() {
    if (!this.isTyping) {
      this.isSummernoteVisible = false;
    }
  }
}
