use crate::math::rect::R16;
use crate::math::wh::{WH, WH16};
use crate::math::xy::{XY, XY16};
use num::traits::cast::ToPrimitive;
use web_sys::Document;

// is this what i want or do i want fixed scaling or osmething else?
/// Returns the maximum scale possible.
pub fn scale(canvas_wh: &WH16, min_size: &WH16, zoom_out: i16) -> i16 {
  let x = canvas_wh.w / min_size.w;
  let y = canvas_wh.h / min_size.h;
  1.max((x.min(y)) - zoom_out)
}

pub fn canvas_wh(doc: &Document) -> WH16 {
  let root = doc.document_element().expect("Document root element missing.");
  let w = root
    .client_width()
    .to_i16()
    .expect("Document root width i32 to i16 conversion failed.");
  let h = root
    .client_height()
    .to_i16()
    .expect("Document root height i32 to i16 conversion failed.");
  WH { w, h }
}

pub fn cam_wh(WH { w, h }: &WH16, scale: i16) -> WH16 {
  let scale = scale.to_f32().expect("Scale i16 to f32 conversion failed.");
  WH {
    w: (w.to_f32().expect("Cam width i16 to f32 conversion failed.") / scale)
      .ceil()
      .to_i16()
      .expect("Cam width f32 to i16 conversion failed."),
    h: (h.to_f32().expect("Cam height i16 to f32 conversion failed.") / scale)
      .ceil()
      .to_i16()
      .expect("Cam height f32 to i16 conversion failed."),
  }
}

/** @arg {x, y} The viewport coordinates of the input in window pixels,
            usually new XY(event.clientX, event.clientY).
@arg {w, h} The viewport dimensions in window pixels (canvasWH).
@arg cam The coordinates and dimensions of the camera the input was made
          through in level pixels.
@return The fractional position in level coordinates. */
pub fn to_level_xy(XY { x, y }: &XY16, WH { w, h }: &WH16, cam: &R16) -> XY16 {
  XY {
    x: cam.from.x + (x * cam.width()) / w,
    y: cam.from.y + (y * cam.height()) / h,
  }
}
