use serde::Deserialize;

/// The sprite draw order from bottom (lesser) to top (greater). Within a Layer,
/// sprites are drawn in y-coordinate + height ascending order (lesser to
/// greater). y-coordinate + height-ordering is the preferred resolution
/// mechanism but the lowest possible Layer may be used where necessary. Layer
/// is like a z-coordinate.
#[repr(u8)]
#[derive(Clone, Copy, Debug, Deserialize, PartialEq)]
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
