use crate::math::rect::R16;
use crate::math::wrap::wrap;
use crate::math::xy::XY16;
use specs::prelude::DenseVecStorage;
use specs::Component;

/// **Warning:** order matters. This component should be processed after all
/// other translations to wrap when expected.
#[derive(Component, Clone, Debug)]
pub struct Wraparound;

impl Wraparound {
  pub fn wrap(&self, bounds: &R16, level: &R16) -> XY16 {
    XY16::new(
      wrap(bounds.from.x, -bounds.width() + 1, level.to.x),
      wrap(bounds.from.y, -bounds.height() + 1, level.to.y),
    )
  }
}
