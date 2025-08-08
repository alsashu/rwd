export class SvgConstService {
  public static primitiveTypes: string[] = [
    "use",
    "svg",
    "line",
    "rect",
    "circle",
    "ellipse",
    "polygon",
    "polyline",
    "path",
    "text",
    "image",
  ];

  public static DIAGRAM_OBJECT_TYPE = "diagram";
  public static SVG_OBJECT_TYPE = "svg-object";

  public static ROOT_OBJECT_TYPE = "root";
  public static LIBRARY_OBJECT_TYPE = "library-object";
  public static GROUP_OBJECT_TYPE = "group";
  public static TEXT_OBJECT_TYPE = "text";
  public static CIRCLE_OBJECT_TYPE = "circle";
  public static ELLIPSE_OBJECT_TYPE = "ellipse";
  public static RECT_OBJECT_TYPE = "rect";
  public static POLYLINE_OBJECT_TYPE = "polyline";
  public static POLYGON_OBJECT_TYPE = "polygon";
  public static USE_OBJECT_TYPE = "use";

  public static POINT_SEL_TYPE = "point";
  public static LINE_SEL_TYPE = "line";
  public static POLYLINE_SEL_TYPE = "polyline";
  public static POLYGON_SEL_TYPE = "polygon";
  public static PATH_SEL_TYPE = "path";
  public static RECTANGLE_SEL_TYPE = "rectangle";

  public static SELECTION_HANDLE = "selection-handle";
  public static TRANSLATE_HANDLE = "translate-handle";
  public static ROTATE_HANDLE = "rotate-handle";
  public static POLYLINE_HANDLE = "polyline-handle";
  public static PLUS_HANDLE = "plus-handle";
  public static SIZE_HANDLE = "size-handle";
  public static LINK_HANDLE = "link-handle";
  public static RAY_POLYLINE_HANDLE = "ray-polyline-handle";
  public static PATH_HANDLE = "path-handle";
  public static MAPPING_HANDLE = "mapping-handle";
  public static TOGGLE_HANDLE = "toggle-handle";

  public static VERIFICATION_HANDLE = "verification-handle";
  public static TO_BE_VERIFIED_HANDLE = "tobeverified-handle";

  //TODO
  public static WF_ACTIVITY_LIB_ID = "wf-activity-1";
}
