use crate::math::rect::R16;
use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component, Clone, Debug)]
pub struct Bounds {
  pub bounds: R16,
}

impl Bounds {
  pub fn new(fx: i16, fy: i16, tx: i16, ty: i16) -> Self {
    Bounds { bounds: R16::new(fx, fy, tx, ty) }
  }
}
