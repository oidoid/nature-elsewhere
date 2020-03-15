use super::aseprite;
use super::{Animation, AnimationLookup, Atlas, Cel, Playback};
use crate::math::Millis;
use crate::{
  math::rect::R16,
  math::wh::{WH, WH16},
  math::xy::{XY, XY16},
};
use failure::Error;
use std::{convert::TryInto, f64};

pub fn parse(json: &str) -> Result<Atlas, Error> {
  parse_file(&serde_json::from_str(json)?)
}

pub fn parse_file(file: &aseprite::File) -> Result<Atlas, Error> {
  let aseprite::WH { w, h } = file.meta.size;
  Ok(Atlas {
    version: file.meta.version.clone(),
    filename: file.meta.image.clone(),
    format: file.meta.format.clone(),
    wh: WH { w: w.try_into()?, h: h.try_into()? },
    animations: parse_animation_lookup(file)?,
  })
}

pub fn parse_animation_lookup(
  aseprite::File { meta, frames }: &aseprite::File,
) -> Result<AnimationLookup, Error> {
  let aseprite::Meta { frame_tags, slices, .. } = meta;
  let mut animations = AnimationLookup::new();
  for frame_tag in frame_tags {
    // Every tag should be unique within the sheet.
    if animations.contains_key(&frame_tag.name) {
      let msg = format!("Duplicate tag {}.", frame_tag.name);
      return Err(failure::err_msg(msg));
    }
    animations.insert(
      frame_tag.name.clone(),
      parse_animation(frame_tag, frames, slices)?,
    );
  }
  Ok(animations)
}

pub fn parse_animation(
  frame_tag: &aseprite::FrameTag,
  frame_map: &aseprite::FrameMap,
  slices: &[aseprite::Slice],
) -> Result<Animation, Error> {
  let direction = Playback::parse(&frame_tag.direction)?;
  let frames = parse_tag_frames(frame_tag, frame_map);
  if frames.is_empty() {
    let msg = format!("No cels in {} animation.", frame_tag.name);
    return Err(failure::err_msg(msg));
  }

  let mut cels = Vec::new();
  for (i, frame) in frames.iter().enumerate() {
    cels.push(parse_cel(frame_tag, frame, i.try_into()?, slices)?);
  }

  let mut duration =
    cels.iter().fold(0., |time, Cel { duration, .. }| time + duration);
  if direction == Playback::PingPong && cels.len() > 2 {
    duration += duration - cels[0].duration + cels[cels.len() - 1].duration;
  }

  if duration == 0. {
    let msg = format!("Zero duration for {} animation.", frame_tag.name);
    return Err(failure::err_msg(msg));
  }

  if cels.len() > 2 {
    if let Some(i) = cels[1..cels.len() - 1]
      .iter()
      .position(|Cel { duration, .. }| duration.is_infinite())
    {
      let msg = format!(
        "Infinite duration for intermediate cel {} of {} animation.",
        i, frame_tag.name
      );
      return Err(failure::err_msg(msg));
    }
  }

  let aseprite::WH { w, h } = frames[0].source_size;
  Ok(Animation {
    wh: WH { w: w.try_into()?, h: h.try_into()? },
    cels,
    duration,
    direction,
  })
}

pub fn parse_tag_frames<'a>(
  aseprite::FrameTag { name, from, to, .. }: &aseprite::FrameTag,
  frame_map: &'a aseprite::FrameMap,
) -> Vec<&'a aseprite::Frame> {
  let mut frames = Vec::new();
  for i in *from..=*to {
    let tag_frame_number = format!("{} {}", name, i);
    frames.push(&frame_map[&tag_frame_number]);
  }
  return frames;
}

impl Playback {
  fn parse(str: &str) -> Result<Self, Error> {
    match str {
      "forward" => Ok(Self::Forward),
      "reverse" => Ok(Self::Reverse),
      "pingpong" => Ok(Self::PingPong),
      _ => Err(failure::err_msg(format!("Playback invalid: \"{}\".", str))),
    }
  }
}

pub fn parse_cel(
  frame_tag: &aseprite::FrameTag,
  frame: &aseprite::Frame,
  frame_number: u32,
  slices: &[aseprite::Slice],
) -> Result<Cel, Error> {
  Ok(Cel {
    xy: parse_xy(frame)?,
    duration: parse_duration(frame.duration)?,
    slices: parse_slices(frame_tag, frame_number, slices)?,
  })
}

pub fn parse_xy(frame: &aseprite::Frame) -> Result<XY16, Error> {
  let WH { w, h } = parse_padding(frame)?;
  Ok(XY { x: (frame.frame.x + w / 2), y: (frame.frame.y + h / 2) })
}

pub fn parse_padding(
  aseprite::Frame { frame, source_size, .. }: &aseprite::Frame,
) -> Result<WH16, Error> {
  let w = (frame.w - source_size.w).try_into()?;
  let h = (frame.h - source_size.h).try_into()?;
  if w & 1 == 1 || h & 1 == 1 {
    return Err(failure::err_msg("Padding is not evenly divisible."));
  }
  Ok(WH { w, h })
}

pub fn parse_duration(duration: aseprite::Duration) -> Result<Millis, Error> {
  match duration {
    0 => Err(failure::err_msg("Duration is zero.")),
    aseprite::INFINITE => Ok(f64::INFINITY),
    _ => Ok(Millis::from(duration)),
  }
}

pub fn parse_slices(
  aseprite::FrameTag { name, .. }: &aseprite::FrameTag,
  index: u32,
  slices: &[aseprite::Slice],
) -> Result<Vec<R16>, Error> {
  let mut rects = Vec::new();
  for slice in slices {
    if slice.name != *name {
      continue;
    }
    // For each Slice, get the greatest relevant Key.
    let key =
      slice.keys.iter().filter(|key| key.frame <= index).last().unwrap();
    let aseprite::Key { bounds, .. } = key;
    rects.push(R16::cast_wh(bounds.x, bounds.y, bounds.w, bounds.h));
  }
  Ok(rects)
}

#[cfg(test)]
mod test {
  use super::*;
  use std::collections::HashMap;

  #[test]
  fn parse_animation_lookup() {
    let file: aseprite::File = from_json!( {
      "meta": {
        "app": "http://www.aseprite.org/",
        "version": "1.2.8.1",
        "image": "atlas.png",
        "format": "I8",
        "size": { "w": 1024, "h": 1024 },
        "scale": "1",
        "frameTags": [
          {
            "name": "sceneryCloud", "from": 0, "to": 0, "direction": "forward"
          },
          { "name": "palette-red", "from": 1, "to": 1, "direction": "forward" },
          {
            "name": "sceneryConifer", "from": 2, "to": 2, "direction": "forward"
          },
          {
            "name": "sceneryConifer-shadow",
            "from": 3,
            "to": 3,
            "direction": "forward"
          }
        ],
        "slices": [
          {
            "name": "sceneryCloud",
            "color": "#0000ffff",
            "keys": [{
              "frame": 0, "bounds": { "x": 8, "y": 12, "w": 2, "h": 3 }
            }]
          },
          {
            "name": "palette-red",
            "color": "#0000ffff",
            "keys": [{
              "frame": 0, "bounds": { "x": 7, "y": 11, "w": 3, "h": 4 }
            }]
          },
          {
            "name": "sceneryConifer",
            "color": "#0000ffff",
            "keys": [{
              "frame": 0, "bounds": { "x": 7, "y": 10, "w": 3, "h": 5 }
            }]
          },
          {
            "name": "sceneryConifer-shadow",
            "color": "#0000ffff",
            "keys": [{
              "frame": 0, "bounds": { "x": 7, "y": 9, "w": 3, "h": 6 }
            }]
          }
        ]
      },
      "frames": {
        "sceneryCloud 0": {
          "frame": { "x": 220, "y": 18, "w": 18, "h": 18 },
          "rotated": false,
          "trimmed": false,
          "spriteSourceSize": { "x": 0, "y": 0, "w": 16, "h": 16 },
          "sourceSize": { "w": 16, "h": 16 },
          "duration": 1
        },
        "palette-red 1": {
          "frame": { "x": 90, "y": 54, "w": 18, "h": 18 },
          "rotated": false,
          "trimmed": false,
          "spriteSourceSize": { "x": 0, "y": 0, "w": 16, "h": 16 },
          "sourceSize": { "w": 16, "h": 16 },
          "duration": 65535
        },
        "sceneryConifer 2": {
          "frame": { "x": 72, "y": 54, "w": 18, "h": 18 },
          "rotated": false,
          "trimmed": false,
          "spriteSourceSize": { "x": 0, "y": 0, "w": 16, "h": 16 },
          "sourceSize": { "w": 16, "h": 16 },
          "duration": 65535
        },
        "sceneryConifer-shadow 3": {
          "frame": { "x": 54, "y": 54, "w": 18, "h": 18 },
          "rotated": false,
          "trimmed": false,
          "spriteSourceSize": { "x": 54, "y": 54, "w": 18, "h": 18 },
          "sourceSize": { "w": 16, "h": 16 },
          "duration": 65535
        }
      }
    })
    .unwrap();
    let mut expected = AnimationLookup::new();
    expected.insert(
      "sceneryCloud".to_string(),
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          xy: XY { x: 221, y: 19 },
          duration: 1.,
          slices: vec![R16 {
            from: XY { x: 8, y: 12 },
            to: XY { x: 10, y: 15 },
          }],
        }],
        duration: 1.,
        direction: Playback::Forward,
      },
    );
    expected.insert(
      "palette-red".to_string(),
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          xy: XY { x: 91, y: 55 },
          duration: f64::INFINITY,
          slices: vec![R16 {
            from: XY { x: 7, y: 11 },
            to: XY { x: 10, y: 15 },
          }],
        }],
        duration: f64::INFINITY,
        direction: Playback::Forward,
      },
    );
    expected.insert(
      "sceneryConifer".to_string(),
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          xy: XY { x: 73, y: 55 },
          duration: f64::INFINITY,
          slices: vec![R16 {
            from: XY { x: 7, y: 10 },
            to: XY { x: 10, y: 15 },
          }],
        }],
        duration: f64::INFINITY,
        direction: Playback::Forward,
      },
    );
    expected.insert(
      "sceneryConifer-shadow".to_string(),
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          xy: XY { x: 55, y: 55 },
          duration: f64::INFINITY,
          slices: vec![R16 {
            from: XY { x: 7, y: 9 },
            to: XY { x: 10, y: 15 },
          }],
        }],
        duration: f64::INFINITY,
        direction: Playback::Forward,
      },
    );
    assert_eq!(super::parse_animation_lookup(&file).unwrap(), expected);
  }

  #[test]
  fn parse_animation() {
    let frame_tag = aseprite::FrameTag {
      name: "cloud s".to_string(),
      from: 1,
      to: 1,
      direction: "forward".to_string(),
    };
    let mut frames = HashMap::new();
    frames.insert(
      "cloud xs 0".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 202, y: 36, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    frames.insert(
      "cloud s 1".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 184, y: 36, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    frames.insert(
      "cloud m 2".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 166, y: 36, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    let slices = [
      aseprite::Slice {
        name: "cloud xs".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 4, y: 12, w: 7, h: 3 },
        }],
      },
      aseprite::Slice {
        name: "cloud s".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 4, y: 11, w: 9, h: 4 },
        }],
      },
      aseprite::Slice {
        name: "cloud m".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 3, y: 11, w: 10, h: 4 },
        }],
      },
    ];
    assert_eq!(
      super::parse_animation(&frame_tag, &frames, &slices).unwrap(),
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          xy: XY { x: 185, y: 37 },
          duration: f64::INFINITY,
          slices: vec![R16 {
            from: XY { x: 4, y: 11 },
            to: XY { x: 13, y: 15 }
          }]
        }],
        duration: f64::INFINITY,
        direction: Playback::Forward
      }
    );
  }

  #[test]
  fn parse_playback_valid() {
    assert_eq!(Playback::parse("forward").unwrap(), Playback::Forward);
    assert_eq!(Playback::parse("reverse").unwrap(), Playback::Reverse);
    assert_eq!(Playback::parse("pingpong").unwrap(), Playback::PingPong);
  }

  #[test]
  fn parse_playback_invalid() {
    assert_eq!(Playback::parse("invalid").is_err(), true);
  }

  #[test]
  fn parse_cel() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 0,
      direction: "forward".to_string(),
    };
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 130, y: 18, w: 18, h: 18 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
      source_size: aseprite::WH { w: 16, h: 16 },
      duration: 65535,
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#0000ffff".to_string(),
      keys: vec![aseprite::Key {
        frame: 0,
        bounds: aseprite::Rect { x: 4, y: 4, w: 8, h: 12 },
      }],
    }];
    assert_eq!(
      super::parse_cel(&frame_tag, &frame, 0, &slices).unwrap(),
      Cel {
        xy: XY { x: 131, y: 19 },
        duration: f64::INFINITY,
        slices: vec![R16 { from: XY { x: 4, y: 4 }, to: XY { x: 12, y: 16 } }]
      }
    );
  }

  #[test]
  fn parse_xy_without_padding() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 3, h: 4 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 3, h: 4 },
      source_size: aseprite::WH { w: 3, h: 4 },
      duration: 1,
    };
    assert_eq!(parse_xy(&frame).unwrap(), XY { x: 1, y: 2 });
  }

  #[test]
  fn parse_xy_with_padding() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 5, h: 6 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 3, h: 4 },
      source_size: aseprite::WH { w: 3, h: 4 },
      duration: 1,
    };
    assert_eq!(parse_xy(&frame).unwrap(), XY { x: 2, y: 3 });
  }

  #[test]
  fn parse_padding_zero() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 3, h: 4 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 3, h: 4 },
      source_size: aseprite::WH { w: 3, h: 4 },
      duration: 1,
    };
    assert_eq!(parse_padding(&frame).unwrap(), WH { w: 0, h: 0 });
  }

  #[test]
  fn parse_padding_nonzero() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 4, h: 5 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 2, h: 3 },
      source_size: aseprite::WH { w: 2, h: 3 },
      duration: 1,
    };
    assert_eq!(parse_padding(&frame).unwrap(), WH { w: 2, h: 2 });
  }

  #[test]
  fn parse_padding_mixed() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 4, h: 6 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 2, h: 2 },
      source_size: aseprite::WH { w: 2, h: 2 },
      duration: 1,
    };
    assert_eq!(parse_padding(&frame).unwrap(), WH { w: 2, h: 4 });
  }

  #[test]
  fn parse_padding_indivisible() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 4, h: 6 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 3, h: 6 },
      source_size: aseprite::WH { w: 3, h: 6 },
      duration: 1,
    };
    assert_eq!(parse_padding(&frame).is_err(), true);
  }

  #[test]
  fn parse_duration_finite() {
    assert_eq!(parse_duration(1).unwrap(), 1.)
  }

  #[test]
  fn parse_duration_infinite() {
    assert_eq!(parse_duration(65535).unwrap(), f64::INFINITY)
  }

  #[test]
  fn parse_slices_rect() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 0,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![aseprite::Key {
        frame: 0,
        bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
      }],
    }];
    assert_eq!(
      parse_slices(&frame_tag, 0, &slices).unwrap(),
      vec![R16 { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 4 } },]
    )
  }

  #[test]
  fn parse_slices_unrelated_tags() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 0,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "unrelated ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![aseprite::Key {
        frame: 0,
        bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
      }],
    }];
    assert_eq!(parse_slices(&frame_tag, 0, &slices).unwrap(), vec![])
  }

  #[test]
  fn parse_slices_unrelated_keys() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 2,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![
        aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
        },
        aseprite::Key {
          frame: 1,
          bounds: aseprite::Rect { x: 4, y: 5, w: 6, h: 7 },
        },
        aseprite::Key {
          frame: 2,
          bounds: aseprite::Rect { x: 8, y: 9, w: 10, h: 11 },
        },
      ],
    }];
    assert_eq!(
      parse_slices(&frame_tag, 1, &slices).unwrap(),
      vec![R16 { from: XY { x: 4, y: 5 }, to: XY { x: 10, y: 12 } }]
    )
  }

  #[test]
  fn parse_slices_mul_keys() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 1,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![
        aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
        },
        aseprite::Key {
          frame: 1,
          bounds: aseprite::Rect { x: 4, y: 5, w: 6, h: 7 },
        },
      ],
    }];
    assert_eq!(
      parse_slices(&frame_tag, 0, &slices).unwrap(),
      vec![R16 { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 4 } }]
    )
  }

  #[test]
  fn parse_slices_none() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 0,
      direction: "forward".to_string(),
    };
    assert_eq!(parse_slices(&frame_tag, 0, &[]).unwrap(), vec![]);
  }

  #[test]
  fn parse_slices_single() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 1,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![aseprite::Key {
        frame: 0,
        bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
      }],
    }];
    assert_eq!(
      parse_slices(&frame_tag, 1, &slices).unwrap(),
      vec![R16 { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 4 } },]
    );
  }

  #[test]
  fn parse_slices_mul() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 1,
      direction: "forward".to_string(),
    };
    let slices = [
      aseprite::Slice {
        name: "stem ".to_string(),
        color: "#00000000".to_string(),
        keys: vec![
          aseprite::Key {
            frame: 0,
            bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
          },
          aseprite::Key {
            frame: 1,
            bounds: aseprite::Rect { x: 4, y: 5, w: 6, h: 7 },
          },
          aseprite::Key {
            frame: 2,
            bounds: aseprite::Rect { x: 12, y: 13, w: 14, h: 15 },
          },
        ],
      },
      aseprite::Slice {
        name: "unrelated ".to_string(),
        color: "#00000000".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
        }],
      },
      aseprite::Slice {
        name: "stem ".to_string(),
        color: "#00000000".to_string(),
        keys: vec![aseprite::Key {
          frame: 1,
          bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
        }],
      },
      aseprite::Slice {
        name: "stem ".to_string(),
        color: "#00000000".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 8, y: 9, w: 10, h: 11 },
        }],
      },
    ];
    assert_eq!(
      parse_slices(&frame_tag, 1, &slices).unwrap(),
      vec![
        R16 { from: XY { x: 4, y: 5 }, to: XY { x: 10, y: 12 } },
        R16 { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 4 } },
        R16 { from: XY { x: 8, y: 9 }, to: XY { x: 18, y: 20 } }
      ]
    );
  }
}
