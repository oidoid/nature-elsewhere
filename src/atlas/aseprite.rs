//! This typing assumes the options specified in aseprite-atlas-pack and
//! annotated herein with **via CLI**. The JSON export format appears to be
//! undocumented but the related [binary format] is. Types marked
//! "**by convention**" are supplemental to and unenforced by the JSON format.
//! Any data of these types should be validated as soon as possible. All numbers
//! are integers. All indices are zero-based. All geometry are described from
//! the top left to the bottom right in pixel units.
//!
//! [binary format]: https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md

use serde::Deserialize;
use std::collections::HashMap;
use std::fmt;

/// The topmost data type for JSON exported from Aseprite. This format contains
/// all the image and animation information for every file packed in the atlas.
/// **By convention**, every file has one or more animations. Every animation
/// has a Frame sequence, a Tag, and zero or more Slices.
#[derive(Deserialize)]
pub struct File {
  pub meta: Meta,
  /// All Frames for all files packed.
  pub frames: FrameMap,
}

pub type FrameMap = HashMap<TagFrameNumber, Frame>;

#[derive(Deserialize)]
pub struct Meta {
  /// E.g., "http://www.aseprite.org/".
  pub app: String,
  /// E.g., "1.2.8.1".
  pub version: String,
  /// The associated output basename. E.g., "atlas.png".
  pub image: String,
  /// E.g., "RGBA8888" or "I8".
  pub format: String,
  /// Output dimensions. **Via CLI** `--sheet-pack`, uses a power of 2.
  pub size: WH,
  /// E.g., "1".
  pub scale: String,
  /// All FrameTags for all files packed **via CLI** `--list-tags`.
  #[serde(rename = "frameTags")]
  pub frame_tags: Vec<FrameTag>,
  /// All slices for all files packed **via CLI** `--list-slices`.
  pub slices: Vec<Slice>,
}

/// A Tag followed by a space followed by a frame number **via CLI**
/// `--filename-format '{tag} {frame}'`.
pub type TagFrameNumber = String;

pub type Tag = String;

/// A single animation frame and most primitive unit. Each file packed always a
/// has at least one Frame.
#[derive(Deserialize)]
pub struct Frame {
  /// The Frame's bounds within the atlas, including a any border padding
  /// **via CLI** `--inner-padding n`. The padding dimensions may also be
  /// calculated by subtracting member's WH dimensions from sourceSize and
  /// dividing by 2.
  pub frame: Rect,
  pub rotated: bool,
  pub trimmed: bool,
  /// The Frame's bounds within the file packed, not including padding.
  #[serde(rename = "spriteSourceSize")]
  pub sprite_source_size: Rect,
  /// The width and height components of spriteSourceSize.
  #[serde(rename = "sourceSize")]
  pub source_size: WH,
  pub duration: Duration,
}

/// A label and animation behavior for one or more Frames. When combined with
/// the referenced Frames, an animation is represented.
#[derive(Deserialize)]
pub struct FrameTag {
  /// **By convention**, the associated Frame's Tag.
  pub name: Tag,
  /// The inclusive starting Frame index.
  pub from: u16,
  /// The inclusive ending Frame index, possibly identical to the starting frame
  /// index.
  pub to: u16,
  pub direction: String,
}

/// Positive animation length in milliseconds. **By convention**, animations
/// that should pause use the special INFINITE value.
pub type Duration = u16;

/// **By convention**, a reserved value to indicate a value without
/// termination.
pub const INFINITE: Duration = !0;

#[derive(Deserialize)]
pub struct Slice {
  pub name: Tag,
  /// Color in #rrggbbaa format. E.g., blue is "#0000ffff".
  pub color: String,
  pub keys: Vec<Key>,
}

#[derive(Deserialize)]
pub struct Key {
  /// The inclusive associated Frame's start offset, the exclusive previous
  /// Frame's end offset. **By convention,** the exclusive end offset is the
  /// next higher Key.frame if it exists or the animation's end if not. A
  /// Key's Frame index may be calculated from FrameTag.index + Key.frame.
  pub frame: u32,
  /// The slice dimensions.
  pub bounds: Rect,
}

#[derive(Deserialize)]
pub struct Rect {
  /// Distance from the top in pixels.
  pub x: i16,
  /// Distance from the left in pixels.
  pub y: i16,
  /// Width in pixels.
  pub w: u16,
  /// Height in pixels.
  pub h: u16,
}

#[derive(Deserialize, PartialEq)]
pub struct WH {
  /// Width in pixels.
  pub w: u16,
  /// Height in pixels.
  pub h: u16,
}

impl fmt::Display for WH {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({}, {})", self.w, self.h)
  }
}
