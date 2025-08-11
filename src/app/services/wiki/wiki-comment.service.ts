import { IApiService } from "../api/api.service";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { ISessionService } from "../session/session.service";
import { WikiComment } from "./wiki-comment-model";

/*
 * Interface IWikiCommentService
 * Defines the methods for managing wiki comments.
 */
export interface IWikiCommentService {
  storeWikiComment(comment: any);
  getWikiComments();
  getWikiPageComments();
  getWikiCommentById(id: string);
  getWikiPageCommentById(id: string);
  editedWikiComment(id: string, selectedUser: string, comment: any);
  removeWikiComment(id: string);
  removeWikiPageComment(id: string);
}

/**
 * WikiCommentService
 */
export class WikiCommentService implements IWikiCommentService {
  public currentUser = null;
  public selectedPage = null;
  public parentDir = null;
  public language = null;
  public timePart: string;
  public datePart: string;
  public timeStamp = null;
  private apiService: IApiService;

  public static localStorageKey = {
    href: "alm-wiki-href",
    endpoint: "alm-wiki-endpoint",
    language: "alm-wiki-language",
    parentdir: "alm-wiki-dir",
  };

  private sessionService: ISessionService;

  /**
   * Constructor for WikiCommentService.
   * @param servicesService - The service to get other services.
   */
  constructor(public servicesService: IServicesService) {}

  /** Initializes the WikiCommentService by retrieving necessary services.
   * This method should be called before using any other methods in this service.
   */
  public initService() {
    this.sessionService = this.servicesService.getService(
      ServicesConst.SessionService
    ) as ISessionService;
    this.apiService = this.servicesService.getService(
      ServicesConst.ApiService
    ) as IApiService;
  }

  /**
   * Retrieves all wiki comments.
   * @returns Returns all wiki comments.
   */
  public getWikiComments(): any {
    return this.apiService.getWikiComments();
  }

  /**
   * Retrieves a wiki comment by its ID.
   * @param id - The ID of the wiki comment.
   * @returns Returns the wiki comment with the specified ID.
   */
  public getWikiCommentById(id: string): any {
    return this.apiService.getWikiCommentById(id);
  }

  /**
   * Saves a wiki comment.
   * @param comment - The comment to save.
   * @returns Returns the saved wiki comment.
   */
  private saveWikiComment(comment): any {
    return this.apiService.saveWikiComment(comment);
  }

  /**
   * Retrieves the current user information.
   * @returns Returns the current user information.
   */

  public getCurrentUser(): any {
    this.currentUser = this.sessionService.getCurrentUser();
    return this.currentUser;
  }

  /**
   * Retrieves the selected wiki page from local storage.
   * @returns Returns the selected wiki page.
   */
  public getSelectedPage(): any {
    this.selectedPage = localStorage.getItem(
      WikiCommentService.localStorageKey.endpoint
    );
    this.parentDir = localStorage.getItem(
      WikiCommentService.localStorageKey.parentdir
    );
    if (
      this.selectedPage === "en-US" ||
      this.selectedPage === "fr" ||
      this.selectedPage === "es" ||
      this.selectedPage === "it"
    ) {
      this.selectedPage = "index";
    }
    if (!this.selectedPage) {
      this.selectedPage = "index";
    }
    return this.selectedPage;
  }

  /**
   * Retrieves the selected language from local storage.
   * @returns Returns the selected language.
   */
  public getSelectedLanguage(): any {
    this.language = localStorage.getItem(
      WikiCommentService.localStorageKey.language
    );
    if (!this.language) {
      this.language = "en-US";
    }
    return this.language;
  }

  /**
   * Updates the selected wiki page in local storage.
   * @param page - The new selected wiki page.
   */
  public updateWikiComment(updatedComment: any): any {
    return this.apiService.putWikiComment(updatedComment);
  }

  /**
   * Removes a wiki comment by its ID.
   * @param id - The ID of the wiki comment to remove.
   * @returns Returns the result of the removal operation.
   */
  public removeWikiComment(id: string): any {
    return this.apiService.deleteWikiComment(id);
  }

  /** Retrieves comments for the selected wiki page.
   * @returns Returns the comments for the selected wiki page.
   */
  public getWikiPageComments(): any {
    this.getSelectedPage();
    this.getSelectedLanguage();
    const path = this.parentDir.replace("#", "").split("/");
    const dir = path[0];
    const wikiPage = path[1];
    return this.apiService.getWikiPageComments(
      this.selectedPage,
      this.language,
      dir,
      wikiPage
    );
  }

  /** Stores a new wiki comment.
   * @param comment - The comment to store.
   * @returns Returns the stored wiki comment.
   */
  public storeWikiComment(comment: any): any {
    this.timeStamp = new Date();
    this.getCurrentUser();
    this.getSelectedPage();
    this.getSelectedLanguage();
    const unqueId = this.generateUUID();
    const newComment = new WikiComment(
      unqueId,
      this.currentUser.userName,
      comment,
      this.selectedPage,
      this.timeStamp,
      this.language
    );
    this.saveWikiComment(newComment);
  }

  /** Removes a wiki comment for the selected page.
   * @param id - The ID of the comment to remove.
   * @returns Returns the result of the removal operation.
   */
  public removeWikiPageComment(id: string): any {
    this.getSelectedPage();
    this.getSelectedLanguage();
    return this.apiService.deleteWikiSelectedPageComment(
      id,
      this.selectedPage,
      this.language
    );
  }

  /** Edits an existing wiki comment.
   * @param id - The ID of the comment to edit.
   * @param selectedUser - The username of the user editing the comment.
   * @param comment - The new content of the comment.
   */
  public editedWikiComment(
    id: string,
    selectedUser: string,
    comment: any
  ): any {
    this.timeStamp = new Date();
    this.getCurrentUser();
    this.getSelectedPage();
    this.getSelectedLanguage();

    selectedUser =
      selectedUser === this.currentUser.userName
        ? this.currentUser.userName
        : selectedUser;

    const updatedComment = new WikiComment(
      id,
      selectedUser,
      comment,
      this.selectedPage,
      this.timeStamp,
      this.language
    );
    this.updateWikiComment(updatedComment);
  }

  /** Retrieves a wiki comment by its ID for the selected page.
   * @param id - The ID of the comment to retrieve.
   * @returns Returns the wiki comment with the specified ID for the selected page.
   */
  public getWikiPageCommentById(id: string): any {
    this.getSelectedPage();
    this.getSelectedLanguage();
    return this.apiService.getWikiSelectedPageCommentById(
      id,
      this.selectedPage,
      this.language
    );
  }

  /** Initializes the time record with the current timestamp and formats it into date and time parts.
   * This method should be called to set the initial timestamp when creating a new comment.
   */
  public timeRecord() {
    this.timeStamp = new Date();

    let year = this.timeStamp.getFullYear();
    let month = String(this.timeStamp.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    let day = String(this.timeStamp.getDate()).padStart(2, "0");

    this.datePart = `${day}-${month}-${year}`; // Get Date part (YYYY-MM-DD)

    let hours = String(this.timeStamp.getHours()).padStart(2, "0");
    let minutes = String(this.timeStamp.getMinutes()).padStart(2, "0");
    let seconds = String(this.timeStamp.getSeconds()).padStart(2, "0");

    this.timePart = `${hours}:${minutes}:${seconds}`; // Get Time part (HH:MM:SS)
  }

  /** Generates a unique identifier (UUID) for comments.
   * This method is used to create a unique ID for each comment.
   * @returns Returns a UUID string.
   */
  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
