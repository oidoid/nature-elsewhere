use crate::atlas::animator::Animator;
use crate::atlas::atlas::AtlasID;
use crate::math::rect::R16;
use crate::math::wh::WH16;
use crate::math::xy::XY16;
use specs::prelude::DenseVecStorage;
use specs::{
  Builder, Component, DispatcherBuilder, ReadStorage, System, VecStorage,
  World, WorldExt, WriteStorage,
};

pub type Layer = u8;

// See https://developer.android.com/reference/android/graphics/PorterDuff.Mode.
#[repr(u8)]
pub enum Composition {
  /// The constituent is unused. The source is rendered unaltered.
  Source,
  /// The constituent is rendered with the source's alpha.
  SourceMask,
  /// The source is rendered where the source AND constituent's alpha are
  /// nonzero.
  SourceIn,
  /// The source is rendered with the constituent's alpha. The distinction from
  /// SOURCE_MASK is useful since the source controls animation playback.
  ConstituentMask,
}

pub struct Sprite<'a> {
  pub id: AtlasID,
  pub constituentID: AtlasID,
  pub composition: Composition,
  pub bounds: R16,
  pub layer: Layer,
  pub scale: XY16,
  pub animator: Animator<'a>,
  pub wrap: XY16,
  pub wrapVelocity: XY16,
}

#[derive(Component, Clone)]
pub struct State {}

// there are cases where non-i16 xy are useful.
