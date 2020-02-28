use crate::math::rect::R16;
use crate::math::xy::XY16;

#[derive(Serialize)]
pub struct RenderInstance {
  pub src: R16,
  pub constituent: R16,
  pub composition: u8,
  pad: u8,
  pub dst: R16,
  pub scale: XY16,
  pub wrap_xy: XY16,
  pub wrap_velocity_xy: XY16,
}

impl RenderInstance {
  pub fn new(
    src: R16,
    constituent: R16,
    composition: u8,
    dst: R16,
    scale: XY16,
    wrap_xy: XY16,
    wrap_velocity_xy: XY16,
  ) -> Self {
    RenderInstance {
      src,
      constituent,
      composition,
      pad: 0,
      dst,
      scale,
      wrap_xy,
      wrap_velocity_xy,
    }
  }
}
