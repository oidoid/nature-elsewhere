use serde::{Deserialize, Serialize};
use std::fmt;
use std::fmt::Formatter;

/// The sprite draw order from bottom (lesser) to top (greater). Within a Layer,
/// sprites are drawn in y-coordinate + height ascending order (lesser to
/// greater). y-coordinate + height-ordering is the preferred resolution
/// mechanism but the lowest possible Layer may be used where necessary. Layer
/// is like a z-coordinate.
///
/// The effect is that a sprite may be drawn above or below other sprites in a
/// controlled manner allowing for effects like shadows to consistently be drawn
/// below the object meant to cast it.
#[repr(u8)]
#[derive(Clone, Copy, Debug, Deserialize, PartialEq, Serialize)]
pub enum SpriteLayer {
  /// Terrain.
  Plane,
  Grid,
  AbovePlane,
  Shadow,
  /// Anything flat that is painted on the plane and should appear above
  /// shadow.
  Decal,
  Blood,
  Dead,

  /// Anything above the terrain and not flat.
  Default,

  /// Anything elevated.
  Floats,

  UILo,
  UIMid,
  UIHi,
  UIHiHi,
  /// Special entity offset hack.
  UIPickerOffset,
  UICursor = !0,
}

impl fmt::LowerHex for SpriteLayer {
  fn fmt(&self, formatter: &mut Formatter) -> Result<(), fmt::Error> {
    write!(formatter, "{:#04x}", *self as u8)
  }
}

impl fmt::Display for SpriteLayer {
  fn fmt(&self, formatter: &mut Formatter) -> Result<(), fmt::Error> {
    write!(formatter, "{:#04x}", self)
  }
}
