use crate::{
  math::{rect::R16, wh::WH16, xy::XY16},
  utils::Millis,
};
use std::collections::HashMap;

#[derive(Debug)]
pub struct Atlas {
  /// The Aseprite version of the parsed file. E.g., '1.2.8.1'.
  pub version: String,
  /// The atlas image basename. E.g., 'atlas.png'.
  pub filename: String,
  /// Atlas image format. E.g., 'RGBA8888' or 'I8'.
  pub format: String,
  /// Atlas image dimensions (power of 2).
  pub wh: WH16,
  pub anims: AnimMap,
}

impl Atlas {
  pub fn is_id(&self, id: &AtlasID) -> bool {
    self.anims.get(id).is_some()
  }
}

pub type AtlasID = String;
pub type AnimMap = HashMap<AtlasID, Anim>;

/// A sequence of animation cels.
#[derive(Debug, PartialEq)]
pub struct Anim {
  /// Width and height within the source atlas image in integral pixels.
  /// Dimensions are identical for every cel.
  pub wh: WH16,
  pub cels: Vec<Cel>,
  /// Positive animation length in milliseconds for a full cycle or infinite.
  /// For a ping-pong animation, this is a full traversal forward plus the
  /// traversal backward excluding the first and last frame. E.g., in a five cel
  /// animation, the total duration would be the sum of the individual durations
  /// for the initial five frames and the middle three frames.
  pub duration: Millis,
  pub direction: AnimDirection,
}

#[derive(Clone, Copy, Debug, Deserialize, PartialEq)]
pub enum AnimDirection {
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

/// A single frame of an animation sequence.
#[derive(Clone, Debug, PartialEq)]
pub struct Cel {
  /// Location within the source atlas image in integral pixels from the
  /// top-left.
  pub xy: XY16,
  /// Positive cel exposure in integral milliseconds, None if infinite.
  pub duration: Millis,
  /// Slices within the cel in local pixels.
  pub slices: Vec<R16>,
}
