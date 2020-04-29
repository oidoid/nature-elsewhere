use crate::math::{R16, XY, XY16, XY32};
use std::{
  convert::{TryFrom, TryInto},
  num::NonZeroU16,
};
use web_sys::Document;

pub struct Viewport {
  pub canvas_size: XY<u16>,
  pub scale: NonZeroU16,
  pub cam: R16,
}

impl Viewport {
  pub fn new(document: &Document) -> Self {
    let canvas_size = canvas_size(document);
    let scale = scale(&canvas_size, &XY::try_from((128, 128)).unwrap(), 0);
    let cam_size = cam_size(&canvas_size, scale);
    Self {
      canvas_size,
      scale,
      cam: (0, 0, cam_size.x, cam_size.y)
        .try_into()
        .expect("Rect<u16> to R16 conversion failed."),
    }
  }
}

// is this what i want or do i want fixed scaling or osmething else?
/// Returns the maximum scale possible.
pub fn scale(
  canvas_size: &XY<u16>,
  min_size: &XY<NonZeroU16>,
  zoom_out: u16,
) -> NonZeroU16 {
  let XY { x, y } = canvas_size.clone() / XY::<u16>::from(min_size.clone());
  let scale = 1.max(x.min(y) - zoom_out);
  NonZeroU16::new(scale).expect("Zoom out is zero.")
}

pub fn canvas_size(document: &Document) -> XY<u16> {
  let root =
    document.document_element().expect("Document root element missing.");
  XY::try_from((root.client_width(), root.client_height()))
    .expect("Document root width i32 to u16 conversion failed.")
}

pub fn cam_size(size: &XY<u16>, scale: NonZeroU16) -> XY<u16> {
  let scale = f32::from(scale.get());
  XY::try_from((
    (f32::from(size.x) / scale).ceil(),
    (f32::from(size.y) / scale).ceil(),
  ))
  .expect("Cam f32 to u16 conversion failed.")
}

/// position The viewport coordinates of the input in window pixels, usually new
///   XY(event.clientX, event.clientY).
/// size The viewport dimensions in window pixels (canvas_wh).
/// cam The coordinates and dimensions of the camera the input was made
///   through in level pixels.
/// Returns the fractional position in level coordinates.
pub fn to_level_xy(position: &XY32, size: &XY<u16>, cam: &R16) -> XY16 {
  let level_size = XY32::from(size.clone());
  let cam_size = XY32::from(cam.size());
  cam.from.clone()
    + XY::try_from(position.clone() * cam_size / level_size)
      .expect("Level i32 to i16 conversion failed.")
}
