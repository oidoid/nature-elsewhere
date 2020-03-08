use crate::math::rect::R16;
use crate::math::xy::XY16;
use crate::sprites::sprite_composition::SpriteComposition;
use crate::sprites::sprite_layer::SpriteLayer;
use specs::prelude::DenseVecStorage;
use specs::Component;

// where do animators fit in? separate component? then there's some overlap...

#[derive(Debug, Component)]
pub struct RenderSource {
  /// The atlas region to draw from.
  pub source: R16, // this is dervied from an atlas id...
  /// The atlas region to compose with.
  pub constituent: R16,
  /// The composition operation of source and constituent.
  pub composition: SpriteComposition,
  pub wrap: XY16,
  pub wrap_velocity: XY16,
  pub layer: SpriteLayer, // I feel like this shouldn't be render_layer since an etnity probably has multiple of these?
}
