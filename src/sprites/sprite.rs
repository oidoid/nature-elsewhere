use super::sprite_composition::SpriteComposition;
use crate::atlas::{AnimationID, Animator};
use crate::math::{R16, XY16};
use serde::Serialize;

// This is the actual thing that's serialized too. not sure if purely for searilziation
// or if it should also preserve teh data itself. in the case of the bottom half, it could.

pub struct AbstractSprite<'a> {
  pub animator: Animator<'a>, // the animator is really useful since it reports on the current source rect. it's nice to not have to worry about this. only the animator, atlas, and animation id are needed.
  pub source: AnimationID, // not really used after animator is made. collision doesn't change between frames either? but cna between states
  pub constituent: AnimationID, // should be Animation reference instead i guess
  pub composition: SpriteComposition,
  pub destination: R16,
  pub scale: XY16,
  pub wrap: XY16,
  pub wrap_velocity: XY16,
}

#[repr(C)]
struct Foo {
  a: f32,
  b: u8,
  c: i128,
}

/// The lowest level drawing primitive. The inputs are derived from an Atlas
/// identifier and parameters. The outputs map to a shader input.
/// Alt name: render source. This is assumed to be ordered properly as it does not have a layer.
#[repr(C)] // does this need to be packed? that isn't supported with serialization any mo?
#[derive(Serialize, Debug)]
pub struct Sprite {
  /// The atlas region to draw from. This is specific by a Cel within an
  /// Animation. The data copied never changes except to copy in a new Cel's
  /// region. That is, AnimationID is used to access the Animation and an
  /// Animator to determine the Cel within. AnimationID (as a number) and Cel
  /// index could be passed to the shader, probably as a bitmask, instead if the
  /// Atlas' Animations were uploaded. WH is consistent for all Cels and is only
  /// needed CPU-side at construction time.
  pub source: R16,
  /// The atlas region to compose from. This is specific by a Cel within an
  /// Animation. The data copied never changes except to copy in a new Cel's
  /// region.
  pub constituent: R16,
  /// The composition operation of source and constituent.
  pub composition: SpriteComposition,
  pad: u8,
  /// flip can be used to determine scale butttttt not collision then. world+render... mostly render since entities may have multiple of these
  pub destination: R16,
  pub scale: XY16,
  pub wrap: XY16,
  pub wrap_velocity: XY16,
  // i could put a gap which could store an animator but these are serialized into bytes
  // or use serialize skip
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
    // Only non-zero scales make sense.
    assert!(scale.area() > 0);
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
