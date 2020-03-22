use crate::math::XY16;
use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component, Clone, Debug)]
pub struct Velocity {
  pub position: XY16,
}
