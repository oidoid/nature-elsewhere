use super::sprite_composition::SpriteComposition;
use crate::math::rect::R16;
use crate::math::xy::XY16;

#[derive(Debug, Serialize)]
pub struct Sprite {
  pub source: R16,
  pub constituent: R16,
  pub composition: SpriteComposition,
  pad: u8,
  /// flip can be used to determine scale butttttt not collision then. world+render... mostly render since entities may have multiple of these
  pub destination: R16,
  pub scale: XY16,
  pub wrap: XY16,
  pub wrap_velocity: XY16,
}

impl Sprite {
  pub fn new(
    source: R16,
    constituent: R16,
    composition: SpriteComposition,
    destination: R16,
    scale: XY16,
    wrap: XY16,
    wrap_velocity: XY16,
  ) -> Self {
    Self {
      source,
      constituent,
      composition,
      pad: 0,
      destination,
      scale,
      wrap,
      wrap_velocity,
    }
  }
}
