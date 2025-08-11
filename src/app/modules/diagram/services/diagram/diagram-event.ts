export interface IDiagramEvent {
  type: string;
  diagram: any;
  param: any;
  subject: string;

  undo();
  redo();
}

export class DiagramEvent implements IDiagramEvent {
  public static CloningSvgObject: string = "CloningSvgObject";

  // public static AnimationStarting: string = "AnimationStarting";
  // public static AnimationFinished: string = "AnimationFinished";

  // public static BackgroundSingleClicked: string = "BackgroundSingleClicked";
  // public static BackgroundDoubleClicked: string = "BackgroundDoubleClicked";
  // public static BackgroundContextClicked: string = "BackgroundContextClicked";

  public static ChangingSelection: string = "ChangingSelection";
  public static ChangedSelection: string = "ChangedSelection";
  public static ClipboardChanged: string = "ClipboardChanged";
  public static ClipboardPasted: string = "ClipboardChanged";

  // public static DocumentBoundsChanged: string = "DocumentBoundsChanged";

  // public static ExternalObjectsDropped: string = "ExternalObjectsDropped";

  public static GainedFocus: string = "GainedFocus";

  public static HandleClicked: string = "HandleClicked";
  public static HandleMoved: string = "HandleMoved";

  // public static InitialLayoutCompleted: string = "InitialLayoutCompleted";

  public static LayoutCompleted: string = "LayoutCompleted";

  // public static LinkDrawn: string = "LinkDrawn";
  // public static LinkRelinked: string = "LinkRelinked";
  // public static LinkReshaped: string = "LinkReshaped";

  public static LostFocus: string = "LostFocus";

  // public static Modified: string = "Modified";

  public static ObjectSingleClicked: string = "ObjectSingleClicked";
  // public static ObjectDoubleClicked: string = "ObjectDoubleClicked";
  public static ObjectContextClicked: string = "ObjectContextClicked";

  // public static PartCreated: string = "PartCreated";
  // public static PartResized: string = "PartResized";
  // public static PartRotated: string = "PartRotated";

  public static SelectionMoved: string = "SelectionMoved";
  public static SelectionCopied: string = "SelectionCopied";
  public static SelectionDeleted: string = "SelectionDeleted";
  public static SelectionDeleting: string = "SelectionDeleting";

  // public static SelectionGrouped: string = "SelectionGrouped";
  // public static SelectionUngrouped: string = "SelectionUngrouped";

  // public static TextEdited: string = "TextEdited";

  public static ViewportBoundsChanged: string = "ViewportBoundsChanged";

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

  public undo() {}

  public redo() {}
}
