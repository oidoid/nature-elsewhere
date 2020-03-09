use super::{Animation, Cel, Playback};
use crate::{math::wrap::wrap, utils::Millis};
use std::convert::TryInto;

/// Cel index oscillation state. This integer may fall outside of animation
/// bounds (even negative) depending on the animation interval selected by
/// direction. Any integer in [0, length) is always valid. Aseprite indices are
/// u16s but a period can be negative.
pub type Period = i32;

/// Record and update an Animation's state.
#[derive(Debug)]
pub struct Animator<'a> {
  /// Animations are generally immutable and referenced by multiple Animators.
  pub animation: &'a Animation,

  /// The current cycle offset used to track oscillation state and calculate
  /// index.
  pub period: Period,

  /// Current cel exposure in milliseconds. When the fractional value meets or
  /// exceeds the cel exposure duration, the cel is advanced according to
  /// direction. This value should be carried over from each call with the
  /// current time step added, and zeroed on manual cel change.
  pub exposure: Millis,
}

impl<'a> Animator<'a> {
  pub fn new(animation: &'a Animation) -> Option<Self> {
    if animation.cels.len() < 2 {
      return None;
    }
    Some(Animator { animation, period: 0, exposure: 0. })
  }

  /// Reset the animation and exposure.
  pub fn reset(&mut self) {
    self.period = 0;
    self.exposure = 0.;
  }

  /// Change the animation cel period and reset the period.
  pub fn set(&mut self, period: Period) {
    self.period = period;
    self.exposure = 0.;
  }

  /// Returns the current animation cel.
  pub fn cel(&self) -> &Cel {
    &self.animation.cels[self.index()]
  }

  /// Returns the current animation cel index for the Animator's period.
  pub fn index(&self) -> usize {
    let len: Period = self.animation.cels.len().try_into().unwrap();
    (self.period % len).abs().try_into().unwrap()
  }

  /// Apply the time since last frame was shown, possibly advancing the
  /// animation period.
  pub fn animate(&mut self, exposure: Millis) {
    // Avoid unnecessary iterations by skipping complete animation cycles.
    // Modulo by infinity is the number.
    self.exposure = (self.exposure + exposure) % self.animation.duration;
    while self.exposure >= self.cel().duration {
      self.exposure -= self.cel().duration;
      self.period = self
        .animation
        .direction
        .advance(self.period, self.animation.cels.len());
    }
  }
}

impl Playback {
  /// Returns the next period.
  fn advance(self, period: Period, len: usize) -> Period {
    let len = len.try_into().unwrap();
    match self {
      // An integer in the domain [0, +∞).
      Self::Forward => (period % Period::max_value()) + 1,
      // An integer in the domain (-∞, len - 1].
      Self::Reverse => (period % Period::min_value()) - 1 + len,
      // An integer in the domain [2 - len, len - 1].
      Self::PingPong => wrap(period - 1, 2 - len, len),
    }
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use crate::math::{wh::WH, xy::XY};
  use std::f32;

  #[test]
  fn new() {
    let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 0., slices: vec![] };
    [
      (vec![], false),
      (vec![cel.clone()], false),
      (vec![cel.clone(), cel.clone()], true),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (cels, expected))| {
      let animation = Animation {
        wh: WH { w: 0, h: 0 },
        cels: cels.clone(),
        duration: 0.,
        direction: Playback::Forward,
      };
      let animator = Animator::new(&animation);
      assert_eq!(
        animator.is_some(),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (cels, expected),
      )
    });
  }

  #[test]
  fn reset() {
    let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
    let animation = Animation {
      wh: WH { w: 0, h: 0 },
      cels: vec![cel.clone(), cel.clone()],
      duration: 2.,
      direction: Playback::Forward,
    };
    let mut animator = Animator::new(&animation).unwrap();
    animator.animate(1.5);
    assert_eq!(animator.period, 1);
    assert_eq!(animator.exposure, 0.5);
    animator.reset();
    assert_eq!(animator.period, 0);
    assert_eq!(animator.exposure, 0.);
  }

  #[test]
  fn set() {
    let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
    let animation = Animation {
      wh: WH { w: 0, h: 0 },
      cels: vec![
        cel.clone(),
        cel.clone(),
        cel.clone(),
        cel.clone(),
        cel.clone(),
      ],
      duration: 2.,
      direction: Playback::Forward,
    };
    let mut animator = Animator::new(&animation).unwrap();
    animator.animate(1.5);
    assert_eq!(animator.period, 1);
    assert_eq!(animator.exposure, 0.5);
    animator.set(3);
    assert_eq!(animator.period, 3);
    assert_eq!(animator.exposure, 0.);
  }

  #[test]
  fn animate_exposure_lt_duration() {
    let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
    let animation = Animation {
      wh: WH { w: 0, h: 0 },
      cels: vec![cel.clone(), cel.clone()],
      duration: 2.,
      direction: Playback::Forward,
    };
    let mut animator = Animator::new(&animation).unwrap();
    animator.animate(0.5);
    assert_eq!(animator.period, 0);
    assert_eq!(animator.exposure, 0.5);
  }

  #[test]
  fn animate_exposure_eq_duration() {
    let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
    let animation = Animation {
      wh: WH { w: 0, h: 0 },
      cels: vec![cel.clone(), cel.clone()],
      duration: 2.,
      direction: Playback::Forward,
    };
    let mut animator = Animator::new(&animation).unwrap();
    animator.animate(1.);
    assert_eq!(animator.period, 1);
    assert_eq!(animator.exposure, 0.);
  }

  #[test]
  fn animate_exposure_gt_duration() {
    let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
    let animation = Animation {
      wh: WH { w: 0, h: 0 },
      cels: vec![cel.clone(), cel.clone()],
      duration: 2.,
      direction: Playback::Forward,
    };
    let mut animator = Animator::new(&animation).unwrap();
    animator.animate(1.5);
    assert_eq!(animator.period, 1);
    assert_eq!(animator.exposure, 0.5);
  }

  #[test]
  fn animate_infinite_duration() {
    let cel =
      Cel { xy: XY { x: 0, y: 0 }, duration: f32::INFINITY, slices: vec![] };
    let animation = Animation {
      wh: WH { w: 0, h: 0 },
      cels: vec![cel.clone(), cel.clone()],
      duration: f32::INFINITY,
      direction: Playback::Forward,
    };
    let mut animator = Animator::new(&animation).unwrap();
    animator.animate(1.5);
    assert_eq!(animator.period, 0);
    assert_eq!(animator.exposure, 1.5);
  }

  #[test]
  fn index_start() {
    [Playback::Forward, Playback::Reverse, Playback::PingPong]
      .iter()
      .enumerate()
      .for_each(|(i, &direction)| {
        let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
        let animation = Animation {
          wh: WH { w: 0, h: 0 },
          cels: vec![cel.clone(), cel.clone()],
          duration: 2.,
          direction,
        };
        let mut animator = Animator::new(&animation).unwrap();
        animator.animate(1.);
        assert_eq!(animator.index(), 1, "Case {} failed: {:?}.", i, direction);
      });
  }

  #[test]
  fn index_end() {
    [Playback::Forward, Playback::Reverse, Playback::PingPong]
      .iter()
      .enumerate()
      .for_each(|(i, &direction)| {
        let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
        let animation = Animation {
          wh: WH { w: 0, h: 0 },
          cels: vec![cel.clone(), cel.clone()],
          duration: 2.,
          direction,
        };
        let mut animator = Animator::new(&animation).unwrap();
        animator.period = 1;
        animator.animate(1.);
        assert_eq!(animator.index(), 0, "Case {} failed: {:?}.", i, direction);
      });
  }

  #[test]
  fn index_bounds() {
    [
      (
        Playback::Forward,
        0,
        [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0],
      ),
      (
        Playback::Forward,
        Period::max_value(),
        [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0],
      ),
      (
        Playback::Reverse,
        Period::min_value(),
        [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0],
      ),
      (
        Playback::Reverse,
        3,
        [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3],
      ),
      (
        Playback::PingPong,
        -2,
        [3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2],
      ),
      (
        Playback::PingPong,
        0,
        [1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2],
      ),
      (
        Playback::PingPong,
        3,
        [2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1],
      ),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(direction, period, expected))| {
      let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
      let animation = Animation {
        wh: WH { w: 0, h: 0 },
        cels: vec![cel.clone(), cel.clone(), cel.clone(), cel.clone()],
        duration: 4.,
        direction,
      };
      let mut animator = Animator::new(&animation).unwrap();
      animator.period = period;
      let mut recording = Vec::new();
      for _ in 0..animation.cels.len() * 5 {
        animator.animate(1.);
        recording.push(animator.index())
      }
      assert_eq!(
        recording,
        expected,
        "Case {} failed: {:?}.",
        i,
        (direction, period, expected),
      );
    });
  }

  #[test]
  fn direction_exposure_eq_duration() {
    [
      (Playback::Forward, [1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0]),
      (Playback::Reverse, [4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0]),
      (Playback::PingPong, [1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1]),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(direction, expected))| {
      let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
      let animation = Animation {
        wh: WH { w: 0, h: 0 },
        cels: vec![
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
        ],
        duration: 5.,
        direction,
      };
      let mut animator = Animator::new(&animation).unwrap();
      let mut recording = Vec::new();
      for _ in 0..animation.cels.len() * 3 {
        animator.animate(1.);
        recording.push(animator.index())
      }
      assert_eq!(
        recording,
        expected,
        "Case {} failed: {:?}.",
        i,
        (direction, expected),
      );
    });
  }

  #[test]
  fn direction_exposure_gt_duration() {
    [
      (Playback::Forward, [1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0]),
      (Playback::Reverse, [4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0]),
      (Playback::PingPong, [1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1]),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(direction, expected))| {
      let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
      let animation = Animation {
        wh: WH { w: 0, h: 0 },
        cels: vec![
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
        ],
        duration: 5.,
        direction,
      };
      let mut animator = Animator::new(&animation).unwrap();
      let mut recording = Vec::new();
      for _ in 0..animation.cels.len() * 3 {
        animator.animate(6.);
        recording.push(animator.index())
      }
      assert_eq!(
        recording,
        expected,
        "Case {} failed: {:?}.",
        i,
        (direction, expected),
      );
    });
  }

  #[test]
  fn direction_fractional_exposure_lt_duration() {
    [
      (
        Playback::Forward,
        [
          0, 1, 2, 3, 4, 0, 1, 2, 3, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 2, 3, 4, 0,
          1, 2, 3, 4, 0, 1, 1,
        ],
      ),
      (
        Playback::Reverse,
        [
          0, 4, 3, 2, 1, 0, 4, 3, 2, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 3, 2, 1, 0,
          4, 3, 2, 1, 0, 4, 4,
        ],
      ),
      (
        Playback::PingPong,
        [
          0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 1, 2, 3, 4,
          3, 2, 1, 0, 1, 2, 2,
        ],
      ),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(direction, expected))| {
      let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
      let animation = Animation {
        wh: WH { w: 0, h: 0 },
        cels: vec![
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
        ],
        duration: 5.,
        direction,
      };
      let mut animator = Animator::new(&animation).unwrap();
      let mut recording = Vec::new();
      for _ in 0..animation.cels.len() * 6 {
        animator.animate(0.9);
        recording.push(animator.index())
      }
      assert_eq!(
        recording,
        expected,
        "Case {} failed: {:?}.",
        i,
        (direction, expected),
      );
    });
  }

  #[test]
  fn direction_fractional_exposure_eq_duration() {
    [
      (
        Playback::Forward,
        [
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1,
          2, 2, 3, 3, 4, 4, 0,
        ],
      ),
      (
        Playback::Reverse,
        [
          0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4,
          3, 3, 2, 2, 1, 1, 0,
        ],
      ),
      (
        Playback::PingPong,
        [
          0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3,
          4, 4, 3, 3, 2, 2, 1,
        ],
      ),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(direction, expected))| {
      let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
      let animation = Animation {
        wh: WH { w: 0, h: 0 },
        cels: vec![
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
        ],
        duration: 5.,
        direction,
      };
      let mut animator = Animator::new(&animation).unwrap();
      let mut recording = Vec::new();
      for _ in 0..animation.cels.len() * 6 {
        animator.animate(0.5);
        recording.push(animator.index())
      }
      assert_eq!(
        recording,
        expected,
        "Case {} failed: {:?}.",
        i,
        (direction, expected),
      );
    });
  }

  #[test]
  fn direction_fractional_exposure_gt_duration() {
    [
      (
        Playback::Forward,
        [
          0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1,
          2, 2, 3, 3, 4, 4, 0,
        ],
      ),
      (
        Playback::Reverse,
        [
          0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4,
          3, 3, 2, 2, 1, 1, 0,
        ],
      ),
      (
        Playback::PingPong,
        [
          0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3,
          4, 4, 3, 3, 2, 2, 1,
        ],
      ),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(direction, expected))| {
      let cel = Cel { xy: XY { x: 0, y: 0 }, duration: 1., slices: vec![] };
      let animation = Animation {
        wh: WH { w: 0, h: 0 },
        cels: vec![
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
          cel.clone(),
        ],
        duration: 5.,
        direction,
      };
      let mut animator = Animator::new(&animation).unwrap();
      let mut recording = Vec::new();
      for _ in 0..animation.cels.len() * 6 {
        animator.animate(5.5);
        recording.push(animator.index())
      }
      assert_eq!(
        recording,
        expected,
        "Case {} failed: {:?}.",
        i,
        (direction, expected),
      );
    });
  }
}
