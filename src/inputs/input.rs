use crate::graphics::viewport;
use crate::math::rect::R16;
use crate::math::wh::WH16;
use crate::math::xy::{XY, XY16};
use crate::utils::Millis;

#[derive(Clone)]
pub struct Input {
  /// True if input is on.
  pub active: bool,
  /// 0 on state change. When 0 and active, triggered on. When 0 and inactive,
  /// triggered off.
  pub timer: Millis, // this could be time and record the born time but may need to be an Option then
  /// The position of the input in window coordinates. Pointer state polling is
  /// simulated through events so level position must be recalculated through
  /// the camera lens of each frame.
  pub window_position: XY<i32>,
}

impl Input {
  pub fn active_triggered(&self) -> bool {
    self.active && self.timer == 0.
  }

  pub fn active_long(&self) -> bool {
    self.active && self.timer > 500.
  }

  pub fn inactive_triggered(&self) -> bool {
    !self.active && self.timer == 0.
  }

  pub fn level_xy(&self, canvas: WH16, cam: R16) -> XY16 {
    viewport::to_level_xy(&self.window_position, &canvas, &cam)
  }

  pub fn update(&mut self, elapsed: Millis) {
    self.timer += elapsed;
  }
}
