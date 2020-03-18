use crate::math::Millis;
use std::time::Duration;

pub struct Timing {
  /// Total elapsed game time rendered. Excludes time spent paused.
  pub play_time: Duration,
  /// Time since last frame, possibly 0.
  pub delta: Millis,
}
