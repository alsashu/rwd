export interface IDiagramEvent {
  type: string;
  diagram: any;
  param: any;
  subject: string;
}

export class SvgDiagramEvent implements IDiagramEvent {
  public static CloningSvgObject = "CloningSvgObject";

  // public static BackgroundSingleClicked: string = "BackgroundSingleClicked";
  // public static BackgroundDoubleClicked: string = "BackgroundDoubleClicked";
  // public static BackgroundContextClicked: string = "BackgroundContextClicked";

  public static ChangingSelection = "ChangingSelection";
  public static ChangedSelection = "ChangedSelection";
  public static ClipboardChanged = "ClipboardChanged";
  public static ClipboardPasted = "ClipboardChanged";

  public static GainedFocus = "GainedFocus";

  public static HandleClicked = "HandleClicked";
  public static HandleMoved = "HandleMoved";

  public static LayoutCompleted = "LayoutCompleted";

  public static LostFocus = "LostFocus";

  // public static Modified: string = "Modified";

  public static ObjectSingleClicked = "ObjectSingleClicked";
  // public static ObjectDoubleClicked: string = "ObjectDoubleClicked";
  public static ObjectContextClicked = "ObjectContextClicked";

  public static SelectionMoved = "SelectionMoved";
  public static SelectionCopied = "SelectionCopied";
  public static SelectionDeleted = "SelectionDeleted";
  public static SelectionDeleting = "SelectionDeleting";

  // public static SelectionGrouped: string = "SelectionGrouped";
  // public static SelectionUngrouped: string = "SelectionUngrouped";

  // public static TextEdited: string = "TextEdited";

  public static ViewportBoundsChanged = "ViewportBoundsChanged";

  public type: string;
  public diagram: any;
  public param: any;
  public subject: string;

  constructor(params: any = null) {
    if (params) {
      for (let param in params) {
        this[param] = params[param];
      }
    }
  }
}
