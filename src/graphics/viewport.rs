use crate::math::{R16, XY, XY16, XY32};
use std::{convert::TryFrom, num::NonZeroU16};
use web_sys::Document;

pub struct Viewport {
  pub canvas_wh: XY16,
  pub scale: NonZeroU16,
  pub cam: R16,
}

impl Viewport {
  pub fn new(document: &Document) -> Self {
    let canvas_wh = canvas_wh(document);
    let scale = scale(&canvas_wh, &XY::new(128, 128), 0);
    let cam_wh = cam_wh(&canvas_wh, scale);
    Self { canvas_wh, scale, cam: R16::new_wh(0, 0, cam_wh.x, cam_wh.y) }
  }
}

// is this what i want or do i want fixed scaling or osmething else?
/// Returns the maximum scale possible.
pub fn scale(canvas_wh: &XY16, min_size: &XY16, zoom_out: u16) -> NonZeroU16 {
  let XY { x, y } = canvas_wh.clone() / min_size.clone();
  let scale =
    1.max(x.min(y) - i16::try_from(zoom_out).expect("Zoom out is too large."));
  NonZeroU16::new(u16::try_from(scale).expect("Zoom out is negative."))
    .expect("Zoom out is zero.")
}

pub fn canvas_wh(document: &Document) -> XY16 {
  let root =
    document.document_element().expect("Document root element missing.");
  XY16::try_from((root.client_width(), root.client_height()))
    .expect("Document root width i32 to i16 conversion failed.")
}

pub fn cam_wh(size: &XY16, scale: NonZeroU16) -> XY16 {
  let scale = f32::from(scale.get());
  XY16::try_from((
    (f32::from(size.x) / scale).ceil(),
    (f32::from(size.y) / scale).ceil(),
  ))
  .expect("Cam f32 to i16 conversion failed.")
}

/// position The viewport coordinates of the input in window pixels, usually new
///   XY(event.clientX, event.clientY).
/// size The viewport dimensions in window pixels (canvas_wh).
/// cam The coordinates and dimensions of the camera the input was made
///   through in level pixels.
/// Returns the fractional position in level coordinates.
pub fn to_level_xy(position: &XY32, size: &XY16, cam: &R16) -> XY16 {
  let level_size = XY32::from(size.clone());
  let cam_size = XY32::from(cam.size());
  cam.from.clone()
    + XY::try_from(position.clone() * cam_size / level_size)
      .expect("Level i32 to i16 conversion failed.")
}
