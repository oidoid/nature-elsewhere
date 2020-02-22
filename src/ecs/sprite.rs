use crate::math::rect::R16;
use crate::math::xy::XY16;
use specs::prelude::DenseVecStorage;
use specs::Component;

pub type Composition = u8;

#[derive(Component, Clone)]
pub struct Renderable {
  pub src: R16,
  pub constituent: R16,
  pub composition: Composition,
  pub dst: R16,
  pub scale: XY16,
  pub wrap_xy: XY16,
  pub wrap_velocity_xy: XY16,
}
