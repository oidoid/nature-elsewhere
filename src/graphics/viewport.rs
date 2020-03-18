use crate::math::rect::R16;
use crate::math::wh::{WH, WH16};
use crate::math::xy::{XY, XY16};
use num::traits::cast::ToPrimitive;
use web_sys::Document;

pub struct Viewport {
  pub canvas_wh: WH16,
  pub scale: i16,
  pub cam_wh: WH16,
}

impl Viewport {
  pub fn new(document: &Document) -> Self {
    let canvas_wh = canvas_wh(document);
    let scale = scale(&canvas_wh, &WH16 { w: 128, h: 128 }, 0);
    let cam_wh = cam_wh(&canvas_wh, scale);
    Self { canvas_wh, scale, cam_wh }
  }
}

// is this what i want or do i want fixed scaling or osmething else?
/// Returns the maximum scale possible.
pub fn scale(canvas_wh: &WH16, min_size: &WH16, zoom_out: i16) -> i16 {
  let x = canvas_wh.w / min_size.w;
  let y = canvas_wh.h / min_size.h;
  1.max((x.min(y)) - zoom_out)
}

pub fn canvas_wh(document: &Document) -> WH16 {
  let root =
    document.document_element().expect("Document root element missing.");
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

/// {x, y} The viewport coordinates of the input in window pixels,
///        usually new XY(event.clientX, event.clientY).
/// {w, h} The viewport dimensions in window pixels (canvasWH).
/// cam The coordinates and dimensions of the camera the input was made
///     through in level pixels.
/// Returns the fractional position in level coordinates.
pub fn to_level_xy(
  &XY { x, y }: &XY<i32>,
  &WH { w, h }: &WH16,
  cam: &R16,
) -> XY16 {
  XY {
    x: cam.from.x
      + ((x * i32::from(cam.width())) / i32::from(w)).to_i16().unwrap(),
    y: cam.from.y
      + ((y * i32::from(cam.height())) / i32::from(h)).to_i16().unwrap(),
  }
}
