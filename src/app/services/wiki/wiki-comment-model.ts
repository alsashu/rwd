/**
 * WikiComment Models
 */
export class WikiComment {
  comment_id: string;
  username: string;
  comment: string;
  current_page: string;
  timestamp: string;
  language: string;
  constructor(
    comment_id: string = "",
    username: string = "",
    comment: string = "",
    current_page: string = "",
    timestamp: string = "",
    language: string = ""
  ) {
    this.comment_id = comment_id;
    this.username = username;
    this.comment = comment;
    this.current_page = current_page;
    this.timestamp = timestamp;
    this.language = language;
  }
}
