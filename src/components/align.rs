use crate::math::R16;
use crate::math::XY16;
use serde::{Deserialize, Serialize};
use specs::prelude::DenseVecStorage;
use specs::{Component, Entity};

/// Relative position within a rectangle.
#[derive(Clone, Copy, Debug, Deserialize, Serialize, PartialEq)]
pub enum Alignment {
  /// Top-center.
  North,
  /// Top-right.
  NorthEast,
  /// Mid-right.
  East,
  /// Bottom-right.
  SouthEast,
  /// Bottom-center.
  South,
  /// Bottom-left.
  SouthWest,
  /// Mid-left.
  West,
  /// Top-left.
  NorthWest,
  Center,
}

/// **Warning:** order matters. This component must be processed after all other
/// translations to prevent jitter. E.g., if the a HUD sprite is aligned to the
/// bottom of the camera, its AlignTo position must be plotted **after** the
/// camera's position and dimensions are known. Otherwise, the HUD sprite will
/// be aligned to the camera's previous position causing a highly distracting
/// wiggle effect.
#[derive(Component, Clone, Debug)]
pub struct AlignTo {
  alignment: Alignment,
  margin: XY16,
  to: Option<Entity>, // how does hte parser know what to set this to? need an enum? dynamic? idlk
}

impl AlignTo {
  pub fn new(alignment: Alignment, margin: XY16, to: Option<Entity>) -> Self {
    Self { alignment, margin, to }
  }

  pub fn plot(&self, bounds: &R16, to: &R16) -> XY16 {
    XY16 {
      x: to.from.x
        + match self.alignment {
          Alignment::SouthWest | Alignment::West | Alignment::NorthWest => {
            self.margin.x
          }
          Alignment::SouthEast | Alignment::East | Alignment::NorthEast => {
            to.width() - (bounds.width() + self.margin.x)
          }
          Alignment::North | Alignment::South | Alignment::Center => {
            (to.width() / 2) - ((bounds.width() / 2) + self.margin.x)
          }
        },
      y: to.from.y
        + match self.alignment {
          Alignment::North | Alignment::NorthEast | Alignment::NorthWest => {
            self.margin.y
          }
          Alignment::SouthEast | Alignment::South | Alignment::SouthWest => {
            to.height() - (bounds.height() + self.margin.y)
          }
          Alignment::East | Alignment::West | Alignment::Center => {
            (to.height() / 2) - ((bounds.height() / 2) + self.margin.y)
          }
        },
    }
  }
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn plot() {
    [
      (Alignment::North, XY16::new(3, 5), XY16::new(12, 25)),
      (Alignment::NorthEast, XY16::new(3, 5), XY16::new(17, 25)),
      (Alignment::East, XY16::new(3, 5), XY16::new(17, 20)),
      (Alignment::SouthEast, XY16::new(3, 5), XY16::new(17, 25)),
      (Alignment::South, XY16::new(3, 5), XY16::new(12, 25)),
      (Alignment::SouthWest, XY16::new(3, 5), XY16::new(13, 25)),
      (Alignment::West, XY16::new(3, 5), XY16::new(13, 20)),
      (Alignment::NorthWest, XY16::new(3, 5), XY16::new(13, 25)),
      (Alignment::Center, XY16::new(3, 5), XY16::new(12, 20)),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (alignment, margin, expected))| {
      let align_to = AlignTo {
        alignment: alignment.clone(),
        margin: margin.clone(),
        to: None,
      };
      assert_eq!(
        align_to.plot(&R16::cast_wh(0, 0, 7, 9), &R16::cast_wh(10, 20, 17, 19)),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (alignment, margin)
      )
    })
  }
}
