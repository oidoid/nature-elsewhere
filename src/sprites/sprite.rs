use super::sprite_composition::SpriteComposition;
use crate::math::{R16, XY16};
use serde::Serialize;
use specs::prelude::DenseVecStorage;
use specs::Component;

/// The lowest level drawing primitive. The inputs are derived from an Atlas
/// identifier and parameters. The outputs map to a shader input.
/// Alt name: render source. This is assumed to be ordered properly as it does not have a layer.
#[derive(Component, Clone, Debug, Serialize)]
pub struct Sprite {
  /// The atlas region to draw from.
  pub source: R16,
  /// The atlas region to compose with.
  pub constituent: R16,
  /// The composition operation of source and constituent.
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
