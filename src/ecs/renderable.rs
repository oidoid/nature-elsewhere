use crate::atlas::animator::Animator;
use crate::atlas::atlas_id::AtlasID;
use crate::math::rect::R16;
use crate::math::wh::WH16;
use crate::math::xy::XY16;
use specs::prelude::DenseVecStorage;
use specs::{
  Builder, Component, DispatcherBuilder, ReadStorage, System, VecStorage,
  World, WorldExt, WriteStorage,
};

pub type Layer = u8;
pub type Composition = u8;

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
