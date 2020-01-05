//! This typing assumes the options specified in aseprite-atlas-pack and
//! annotated herein with **via CLI**. The JSON export format appears to be
//! undocumented but the related [binary format] is. Types marked
//! "**by convention**" are supplemental to and unenforced by the JSON format.
//! Any data of these types should be validated as soon as possible. All numbers
//! are integers. All indices are zero-based. All geometry are described from
//! the top left to the bottom right in pixel units.
//!
//! [binary format]: https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md

use super::super::math::rect::Rect16;
use super::super::math::wh::WH16;
use std::collections::HashMap;

pub type Milliseconds = u16;

/// The topmost data type for JSON exported from Aseprite. This format
/// contains all the image and animation information for every file packed in
/// the atlas. **By convention**, every file has one or more animations. Every
/// animation has a Frame sequence, a Tag, and zero or more Slices.
pub struct File {
  meta: Meta,
  /// All Frames for all files packed.
  frames: FrameMap,
}

pub type FrameMap = HashMap<TagFrameNumber, Frame>;

pub struct Meta {
  /// E.g., 'http://www.aseprite.org/'.
  app: String,
  /// E.g., '1.2.8.1'.
  version: String,
  /// The associated output basename. E.g., 'atlas.png'.
  image: String,
  /// E.g., 'RGBA8888' or 'I8'.
  format: String,
  /// Output dimensions. **Via CLI** `--sheet-pack`, uses a power of 2.
  size: WH16,
  /// E.g., '1'.
  scale: String,
  /// All FrameTags for all files packed **via CLI** `--list-tags`.
  frameTags: Vec<FrameTag>,
  /// All slices for all files packed **via CLI** `--list-slices`.
  slices: Vec<Slice>,
}

/// A Tag followed by a space followed by a frame number **via CLI**
/// `--filename-format '{tag} {frame}'`.
pub type TagFrameNumber = String;

pub type Tag = String;

/// A single animation frame and most primitive unit. Each file packed always a
/// has at least one Frame.
#[derive(Debug, Deserialize)]
pub struct Frame {
  /// The Frame's bounds within the atlas, including a any border padding
  /// **via CLI** `--inner-padding n`. The padding dimensions may also be
  /// calculated by subtracting member's WH dimensions from sourceSize and
  /// dividing by 2.
  frame: Rect16,
  rotated: bool,
  trimmed: bool,
  /// The Frame's bounds within the file packed, not including padding.
  spriteSourceSize: Rect16,
  /// The width and height components of spriteSourceSize.
  sourceSize: WH16,
  duration: Duration,
}

/// A label and animation behavior for one or more Frames. When combined with
/// the referenced Frames, an animation is represented.
pub struct FrameTag {
  /// **By convention**, the associated Frame's Tag.
  name: Tag,
  /// The inclusive starting Frame index.
  from: u16,
  /// The inclusive ending Frame index, possibly identical to the starting frame
  /// index.
  to: u16,
  direction: AnimationDirection,
}

/// Positive animation length in milliseconds. **By convention**, animations
/// that should pause use the special INFINITE value.
pub type Duration = Milliseconds;

/// **By convention**, a reserved value to indicate a value without
/// termination.
pub const INFINITE: Duration = !0;

pub enum AnimationDirection {
  /// Animate from start to end; when looping, return to start.
  Forward,
  /// Animate from end to start; when looping, return to end.
  Reverse,
  /// Animate from start to end - 1 or start, whichever is greater; when
  /// looping, change direction (initially, end to start + 1 or end, whichever
  /// is lesser. A traversal from start to end - 1 then end to start + 1 is
  /// considered a complete loop.
  PingPong,
}

// impl AnimationDirection {
//   fn parse(str: String) -> AnimationDirection {
//     match str {
//       "forward" => AnimationDirection::Forward,
//       "reverse" => AnimationDirection::Reverse,
//       "pingpong" => AnimationDirection::PingPong,
//     }
//   }
// }

#[derive(Debug, Deserialize)]
pub struct Slice {
  name: Tag,
  /// Color in #rrggbbaa format. E.g., blue is '#0000ffff'.
  color: String,
  keys: Vec<Key>,
}

#[derive(Debug, Deserialize)]
pub struct Key {
  /// The inclusive associated Frame's start offset, the exclusive previous
  /// Frame's end offset. **By convention,** the exclusive end offset is the
  /// next higher Key.frame if it exists or the animation's end if not. A
  /// Key's Frame index may be calculated from FrameTag.index + Key.frame.
  frame: u32,
  /// The slice dimensions.
  bounds: Rect16,
}
