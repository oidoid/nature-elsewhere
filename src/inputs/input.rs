use crate::graphics;
use crate::math::{Millis, R16, WH16, XY, XY16};

static LONG_DURATION: Millis = 500.;

#[derive(Clone, Debug)]
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
    self.active && self.timer > LONG_DURATION
  }

  pub fn inactive_triggered(&self) -> bool {
    !self.active && self.timer == 0.
  }

  pub fn to_level_xy(&self, canvas: &WH16, cam: &R16) -> XY16 {
    graphics::to_level_xy(&self.window_position, canvas, cam)
  }

  pub fn update(&mut self, elapsed: Millis) {
    self.timer += elapsed;
  }
}
