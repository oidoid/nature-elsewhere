use super::AnimationID;
use crate::math::Millis;
use crate::math::{R16, XY};
use std::collections::HashMap;

pub struct Atlas {
  /// The Aseprite version of the parsed file. E.g., '1.2.8.1'.
  pub version: String,
  /// The atlas image basename. E.g., 'atlas.png'.
  pub filename: String,
  /// Atlas image format. E.g., 'RGBA8888' or 'I8'.
  pub format: String,
  /// Atlas image dimensions (power of 2).
  pub size: XY<u16>,
  pub animations: AnimationMap,
}

pub type AnimationMap = HashMap<AnimationID, Animation>;

/// A sequence of cels.
#[derive(Debug, PartialEq)]
pub struct Animation {
  /// Width and height within the source atlas image in integral pixels.
  /// Dimensions are identical for every cel.
  pub size: XY<u16>,
  pub cels: Vec<Cel>,
  /// Positive animation length in milliseconds for a full cycle or infinite.
  /// For a ping-pong animation, this is a full traversal forward plus the
  /// traversal backward excluding the first and last frame. E.g., in a five cel
  /// animation, the total duration would be the sum of the individual durations
  /// for the initial five frames and the middle three frames.
  pub duration: Millis,
  pub direction: Playback,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Playback {
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
  /// top-left. The width and height are provided for convenience, only XY vary
  /// from Cel to Cel.
  pub bounds: R16,
  /// Positive cel exposure, possibly infinite.
  pub duration: Millis,
  /// Slices within the cel in local pixels.
  pub slices: Vec<R16>,
}
