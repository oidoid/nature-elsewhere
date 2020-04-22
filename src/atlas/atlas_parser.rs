use super::aseprite;
use super::{Animation, AnimationID, AnimationMap, Atlas, Cel, Playback};
use crate::math::Millis;
use crate::math::R16;
use crate::math::{WH, WH16};
use std::num::TryFromIntError;
use std::{convert::TryInto, f64};
use strum::IntoEnumIterator;

pub fn parse(file: &aseprite::File) -> Result<Atlas, AtlasParseError> {
  let aseprite::WH { w, h } = file.meta.size;

  let animations = parse_animation_map(file)?;
  // animations can only contain valid (present) AnimationIDs, exactly zero or
  // one of each, but are all AnimationIDs present in animations?
  if animations.len() != AnimationID::iter().count() {
    for id in AnimationID::iter() {
      if !animations.contains_key(&id) {
        return Err(format!("Missing ID {} in atlas animations.", id).into());
      }
    }
  }

  Ok(Atlas {
    version: file.meta.version.clone(),
    filename: file.meta.image.clone(),
    format: file.meta.format.clone(),
    wh: WH { w: w.try_into()?, h: h.try_into()? },
    animations,
  })
}

pub fn parse_animation_map(
  aseprite::File { meta, frames }: &aseprite::File,
) -> Result<AnimationMap, AtlasParseError> {
  let aseprite::Meta { frame_tags, slices, .. } = meta;
  let mut animations = AnimationMap::new();
  for frame_tag in frame_tags {
    let id = AnimationID::parse(&frame_tag.name)?;
    // Every tag should be unique within the sheet.
    if animations.contains_key(&id) {
      return Err(
        format!("Duplicate animation tag {}.", frame_tag.name).into(),
      );
    }
    animations.insert(id, parse_animation(frame_tag, frames, slices)?);
  }
  Ok(animations)
}

impl AnimationID {
  fn parse(id: &str) -> Result<Self, AtlasParseError> {
    match id {
      "appleTree" => Ok(Self::AppleTree),
      "appleTree-shadow" => Ok(Self::AppleTreeShadow),
      "arrow-upRight" => Ok(Self::ArrowDiagonal),
      "arrow-right" => Ok(Self::ArrowHorizontal),
      "arrow-up" => Ok(Self::ArrowVertical),
      "backpacker-idleDown" => Ok(Self::BackpackerIdleDown),
      "backpacker-idleLeft" => Ok(Self::BackpackerIdleLeft),
      "backpacker-idleRight" => Ok(Self::BackpackerIdleRight),
      "backpacker-idleUp" => Ok(Self::BackpackerIdleUp),
      "backpacker-meleeRight" => Ok(Self::BackpackerMeleeRight),
      "backpacker-walkDown" => Ok(Self::BackpackerWalkDown),
      "backpacker-walkHorizontalShadow" => {
        Ok(Self::BackpackerWalkHorizontalShadow)
      }
      "backpacker-walkLeft" => Ok(Self::BackpackerWalkLeft),
      "backpacker-walkRight" => Ok(Self::BackpackerWalkRight),
      "backpacker-walkUp" => Ok(Self::BackpackerWalkUp),
      "backpacker-walkVerticalShadow" => Ok(Self::BackpackerWalkVerticalShadow),
      "bee" => Ok(Self::Bee),
      "bee-blood" => Ok(Self::BeeBlood),
      "bee-dead" => Ok(Self::BeeDead),
      "bee-shadow" => Ok(Self::BeeShadow),
      "bird-fly" => Ok(Self::BirdFly),
      "bird-rest" => Ok(Self::BirdRest),
      "bird-rise" => Ok(Self::BirdRise),
      "bunny-blood" => Ok(Self::BunnyBlood),
      "bunny" => Ok(Self::Bunny),
      "bunny-dead" => Ok(Self::BunnyDead),
      "bunny-shadow" => Ok(Self::BunnyShadow),
      "bush" => Ok(Self::Bush),
      "bush-shadow" => Ok(Self::BushShadow),
      "cattails" => Ok(Self::Cattails),
      "cloud-large" => Ok(Self::CloudLarge),
      "cloud-largeShadow" => Ok(Self::CloudLargeShadow),
      "cloud-medium" => Ok(Self::CloudMedium),
      "cloud-mediumShadow" => Ok(Self::CloudMediumShadow),
      "cloudRain" => Ok(Self::CloudRain),
      "cloudRain-puddle" => Ok(Self::CloudRainPuddle),
      "cloudRainSplash" => Ok(Self::CloudRainSplash),
      "cloudRain-sprinkle" => Ok(Self::CloudRainSprinkle),
      "clover-0x0" => Ok(Self::Clover0x0),
      "clover-0x1" => Ok(Self::Clover0x1),
      "clover-0x2" => Ok(Self::Clover0x2),
      "clover-0x3" => Ok(Self::Clover0x3),
      "clover-0x4" => Ok(Self::Clover0x4),
      "clover-1x0" => Ok(Self::Clover1x0),
      "clover-1x1" => Ok(Self::Clover1x1),
      "clover-1x2" => Ok(Self::Clover1x2),
      "clover-1x3" => Ok(Self::Clover1x3),
      "clover-1x4" => Ok(Self::Clover1x4),
      "conifer" => Ok(Self::Conifer),
      "conifer-shadow" => Ok(Self::ConiferShadow),
      "egg-compartment-drawer" => Ok(Self::EggCompartmentDrawer),
      "egg-compartment-unit" => Ok(Self::EggCompartmentUnit),
      "eggCompartment-unitPressed" => Ok(Self::EggCompartmentUnitPressed),
      "flag" => Ok(Self::Flag),
      "flag-shadow" => Ok(Self::FlagShadow),
      "flower" => Ok(Self::Flower),
      "flower-shadow" => Ok(Self::FlowerShadow),
      "frog-eat" => Ok(Self::FrogEat),
      "frog-idle" => Ok(Self::FrogIdle),
      "frog-idleShadow" => Ok(Self::FrogIdleShadow),
      "frog-leap" => Ok(Self::FrogLeap),
      "grass-00" => Ok(Self::Grass00),
      "grass-01" => Ok(Self::Grass01),
      "grass-02" => Ok(Self::Grass02),
      "grass-03" => Ok(Self::Grass03),
      "grass-04" => Ok(Self::Grass04),
      "grass-05" => Ok(Self::Grass05),
      "grass-06" => Ok(Self::Grass06),
      "grass-07" => Ok(Self::Grass07),
      "grass-08" => Ok(Self::Grass08),
      "grass-09" => Ok(Self::Grass09),
      "grass-10" => Ok(Self::Grass10),
      "grass-11" => Ok(Self::Grass11),
      "grass-12" => Ok(Self::Grass12),
      "grass-13" => Ok(Self::Grass13),
      "grass-14" => Ok(Self::Grass14),
      "grass-15" => Ok(Self::Grass15),
      "grass-shadow" => Ok(Self::GrassShadow),
      "healthBauble" => Ok(Self::HealthBauble),
      "itemApple" => Ok(Self::ItemApple),
      "itemApple-shadow" => Ok(Self::ItemAppleShadow),
      "lattice" => Ok(Self::Lattice),
      "lifeCounter" => Ok(Self::LifeCounter),
      "meleeButton-disabled" => Ok(Self::MeleeButtonDisabled),
      "meleeButton-enabled" => Ok(Self::MeleeButtonEnabled),
      "memFont-000" => Ok(Self::MemFont000),
      "memFont-001" => Ok(Self::MemFont001),
      "memFont-002" => Ok(Self::MemFont002),
      "memFont-003" => Ok(Self::MemFont003),
      "memFont-004" => Ok(Self::MemFont004),
      "memFont-005" => Ok(Self::MemFont005),
      "memFont-006" => Ok(Self::MemFont006),
      "memFont-007" => Ok(Self::MemFont007),
      "memFont-008" => Ok(Self::MemFont008),
      "memFont-009" => Ok(Self::MemFont009),
      "memFont-010" => Ok(Self::MemFont010),
      "memFont-011" => Ok(Self::MemFont011),
      "memFont-012" => Ok(Self::MemFont012),
      "memFont-013" => Ok(Self::MemFont013),
      "memFont-014" => Ok(Self::MemFont014),
      "memFont-015" => Ok(Self::MemFont015),
      "memFont-016" => Ok(Self::MemFont016),
      "memFont-017" => Ok(Self::MemFont017),
      "memFont-018" => Ok(Self::MemFont018),
      "memFont-019" => Ok(Self::MemFont019),
      "memFont-020" => Ok(Self::MemFont020),
      "memFont-021" => Ok(Self::MemFont021),
      "memFont-022" => Ok(Self::MemFont022),
      "memFont-023" => Ok(Self::MemFont023),
      "memFont-024" => Ok(Self::MemFont024),
      "memFont-025" => Ok(Self::MemFont025),
      "memFont-026" => Ok(Self::MemFont026),
      "memFont-027" => Ok(Self::MemFont027),
      "memFont-028" => Ok(Self::MemFont028),
      "memFont-029" => Ok(Self::MemFont029),
      "memFont-030" => Ok(Self::MemFont030),
      "memFont-031" => Ok(Self::MemFont031),
      "memFont-032" => Ok(Self::MemFont032),
      "memFont-033" => Ok(Self::MemFont033),
      "memFont-034" => Ok(Self::MemFont034),
      "memFont-035" => Ok(Self::MemFont035),
      "memFont-036" => Ok(Self::MemFont036),
      "memFont-037" => Ok(Self::MemFont037),
      "memFont-038" => Ok(Self::MemFont038),
      "memFont-039" => Ok(Self::MemFont039),
      "memFont-040" => Ok(Self::MemFont040),
      "memFont-041" => Ok(Self::MemFont041),
      "memFont-042" => Ok(Self::MemFont042),
      "memFont-043" => Ok(Self::MemFont043),
      "memFont-044" => Ok(Self::MemFont044),
      "memFont-045" => Ok(Self::MemFont045),
      "memFont-046" => Ok(Self::MemFont046),
      "memFont-047" => Ok(Self::MemFont047),
      "memFont-048" => Ok(Self::MemFont048),
      "memFont-049" => Ok(Self::MemFont049),
      "memFont-050" => Ok(Self::MemFont050),
      "memFont-051" => Ok(Self::MemFont051),
      "memFont-052" => Ok(Self::MemFont052),
      "memFont-053" => Ok(Self::MemFont053),
      "memFont-054" => Ok(Self::MemFont054),
      "memFont-055" => Ok(Self::MemFont055),
      "memFont-056" => Ok(Self::MemFont056),
      "memFont-057" => Ok(Self::MemFont057),
      "memFont-058" => Ok(Self::MemFont058),
      "memFont-059" => Ok(Self::MemFont059),
      "memFont-060" => Ok(Self::MemFont060),
      "memFont-061" => Ok(Self::MemFont061),
      "memFont-062" => Ok(Self::MemFont062),
      "memFont-063" => Ok(Self::MemFont063),
      "memFont-064" => Ok(Self::MemFont064),
      "memFont-065" => Ok(Self::MemFont065),
      "memFont-066" => Ok(Self::MemFont066),
      "memFont-067" => Ok(Self::MemFont067),
      "memFont-068" => Ok(Self::MemFont068),
      "memFont-069" => Ok(Self::MemFont069),
      "memFont-070" => Ok(Self::MemFont070),
      "memFont-071" => Ok(Self::MemFont071),
      "memFont-072" => Ok(Self::MemFont072),
      "memFont-073" => Ok(Self::MemFont073),
      "memFont-074" => Ok(Self::MemFont074),
      "memFont-075" => Ok(Self::MemFont075),
      "memFont-076" => Ok(Self::MemFont076),
      "memFont-077" => Ok(Self::MemFont077),
      "memFont-078" => Ok(Self::MemFont078),
      "memFont-079" => Ok(Self::MemFont079),
      "memFont-080" => Ok(Self::MemFont080),
      "memFont-081" => Ok(Self::MemFont081),
      "memFont-082" => Ok(Self::MemFont082),
      "memFont-083" => Ok(Self::MemFont083),
      "memFont-084" => Ok(Self::MemFont084),
      "memFont-085" => Ok(Self::MemFont085),
      "memFont-086" => Ok(Self::MemFont086),
      "memFont-087" => Ok(Self::MemFont087),
      "memFont-088" => Ok(Self::MemFont088),
      "memFont-089" => Ok(Self::MemFont089),
      "memFont-090" => Ok(Self::MemFont090),
      "memFont-091" => Ok(Self::MemFont091),
      "memFont-092" => Ok(Self::MemFont092),
      "memFont-093" => Ok(Self::MemFont093),
      "memFont-094" => Ok(Self::MemFont094),
      "memFont-095" => Ok(Self::MemFont095),
      "memFont-096" => Ok(Self::MemFont096),
      "memFont-097" => Ok(Self::MemFont097),
      "memFont-098" => Ok(Self::MemFont098),
      "memFont-099" => Ok(Self::MemFont099),
      "memFont-100" => Ok(Self::MemFont100),
      "memFont-101" => Ok(Self::MemFont101),
      "memFont-102" => Ok(Self::MemFont102),
      "memFont-103" => Ok(Self::MemFont103),
      "memFont-104" => Ok(Self::MemFont104),
      "memFont-105" => Ok(Self::MemFont105),
      "memFont-106" => Ok(Self::MemFont106),
      "memFont-107" => Ok(Self::MemFont107),
      "memFont-108" => Ok(Self::MemFont108),
      "memFont-109" => Ok(Self::MemFont109),
      "memFont-110" => Ok(Self::MemFont110),
      "memFont-111" => Ok(Self::MemFont111),
      "memFont-112" => Ok(Self::MemFont112),
      "memFont-113" => Ok(Self::MemFont113),
      "memFont-114" => Ok(Self::MemFont114),
      "memFont-115" => Ok(Self::MemFont115),
      "memFont-116" => Ok(Self::MemFont116),
      "memFont-117" => Ok(Self::MemFont117),
      "memFont-118" => Ok(Self::MemFont118),
      "memFont-119" => Ok(Self::MemFont119),
      "memFont-120" => Ok(Self::MemFont120),
      "memFont-121" => Ok(Self::MemFont121),
      "memFont-122" => Ok(Self::MemFont122),
      "memFont-123" => Ok(Self::MemFont123),
      "memFont-124" => Ok(Self::MemFont124),
      "memFont-125" => Ok(Self::MemFont125),
      "memFont-126" => Ok(Self::MemFont126),
      "memFont-127" => Ok(Self::MemFont127),
      "monument-medium" => Ok(Self::MonumentMedium),
      "monument-mediumShadow" => Ok(Self::MonumentMediumShadow),
      "monument-small" => Ok(Self::MonumentSmall),
      "monument-smallShadow" => Ok(Self::MonumentSmallShadow),
      "moon" => Ok(Self::Moon),
      "mountain" => Ok(Self::Mountain),
      "mountain-shadow" => Ok(Self::MountainShadow),
      "oddoid" => Ok(Self::Oddoid),
      "palette-black" => Ok(Self::PaletteBlack),
      "palette-blue" => Ok(Self::PaletteBlue),
      "palette-darkGreen" => Ok(Self::PaletteDarkGreen),
      "palette-darkRed" => Ok(Self::PaletteDarkRed),
      "palette-green" => Ok(Self::PaletteGreen),
      "palette-grey" => Ok(Self::PaletteGrey),
      "palette-lightBlue" => Ok(Self::PaletteLightBlue),
      "palette-lightGreen" => Ok(Self::PaletteLightGreen),
      "palette-lightGrey" => Ok(Self::PaletteLightGrey),
      "palette-orange" => Ok(Self::PaletteOrange),
      "palette-paleGreen" => Ok(Self::PalettePaleGreen),
      "palette-red" => Ok(Self::PaletteRed),
      "palette-transparent" => Ok(Self::PaletteTransparent),
      "palette-white" => Ok(Self::PaletteWhite),
      "path->" => Ok(Self::PathCornerE),
      "path-^" => Ok(Self::PathCornerN),
      "path-/" => Ok(Self::PathNe),
      "pig" => Ok(Self::Pig),
      "pig-shadow" => Ok(Self::PigShadow),
      "backpackerIcon-idle" => Ok(Self::PlayerStatusIdle),
      "backpackerIcon-walk" => Ok(Self::PlayerStatusWalk),
      "pond" => Ok(Self::Pond),
      "roseBauble" => Ok(Self::RoseBauble),
      "snake-shadow" => Ok(Self::SnakeShadow),
      "snake" => Ok(Self::Snake),
      "subshrub-shadow" => Ok(Self::SubshrubShadow),
      "subshrub" => Ok(Self::Subshrub),
      "tree-largeBare" => Ok(Self::TreeLargeBare),
      "tree-largeShadow" => Ok(Self::TreeLargeShadow),
      "tree-large" => Ok(Self::TreeLarge),
      "tree-smallShadow" => Ok(Self::TreeSmallShadow),
      "tree-small" => Ok(Self::TreeSmall),
      "uiButton-base" => Ok(Self::UiButtonBase),
      "uiButton-create" => Ok(Self::UiButtonCreate),
      "uiButton-decrement" => Ok(Self::UiButtonDecrement),
      "uiButton-destroy" => Ok(Self::UiButtonDestroy),
      "uiButton-increment" => Ok(Self::UiButtonIncrement),
      "uiButton-menu" => Ok(Self::UiButtonMenu),
      "uiButton-pressed" => Ok(Self::UiButtonPressed),
      "uiButton-toggleGrid" => Ok(Self::UiButtonToggleGrid),
      "uiCheckerboard-blackTransparent" => {
        Ok(Self::UiCheckerboardBlackTransparent)
      }
      "uiCheckerboard-blackWhite" => Ok(Self::UiCheckerboardBlackWhite),
      "uiCheckerboard-blueGrey" => Ok(Self::UiCheckerboardBlueGrey),
      "uiCursor-hand-pick" => Ok(Self::UiCursorHandPick),
      "uiCursor-hand-point" => Ok(Self::UiCursorHandPoint),
      "uiReticle" => Ok(Self::UiCursorReticle),
      "uiDestinationMarker" => Ok(Self::UiDestinationMarker),
      "uiGrid" => Ok(Self::UiGrid),
      "uiSwitch" => Ok(Self::UiSwitch),
      "uiWindowModeChart" => Ok(Self::UiWindowModeChart),
      "uiZoomMultiplierChart" => Ok(Self::UiZoomMultiplierChart),
      "water" => Ok(Self::Water),
      "wave" => Ok(Self::Wave),
      _ => Err(format!("Animation ID invalid: \"{}\".", id).into()),
    }
  }
}

pub fn parse_animation(
  frame_tag: &aseprite::FrameTag,
  frame_map: &aseprite::FrameMap,
  slices: &[aseprite::Slice],
) -> Result<Animation, AtlasParseError> {
  let direction = Playback::parse(&frame_tag.direction)?;
  let frames = parse_tag_frames(frame_tag, frame_map);
  if frames.is_empty() {
    return Err(format!("No cels in \"{}\" animation.", frame_tag.name).into());
  }
  let size = &frames[0].source_size;

  let mut cels = Vec::new();
  for (i, frame) in frames.iter().enumerate() {
    if &frame.source_size != size {
      return Err(
        format!(
          "Cel {} size mismatch of \"{}\" animation. Expected {}, got {}.",
          i, frame_tag.name, size, frame.source_size
        )
        .into(),
      );
    }
    cels.push(parse_cel(frame_tag, frame, i.try_into()?, slices)?);
  }

  let mut duration =
    cels.iter().fold(0., |time, Cel { duration, .. }| time + duration);
  if direction == Playback::PingPong && cels.len() > 2 {
    duration += duration - cels[0].duration + cels[cels.len() - 1].duration;
  }

  if duration == 0. {
    return Err(
      format!("Zero total duration for \"{}\" animation.", frame_tag.name)
        .into(),
    );
  }

  if cels.len() > 1 {
    if let Some(i) = cels[0..cels.len() - 1]
      .iter()
      .position(|Cel { duration, .. }| duration.is_infinite())
    {
      return Err(
        format!(
          "Infinite duration for non-final cel {} of \"{}\" animation.",
          i, frame_tag.name
        )
        .into(),
      );
    }
  }

  Ok(Animation {
    wh: WH { w: size.w.try_into()?, h: size.h.try_into()? },
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
  frames
}

impl Playback {
  fn parse(direction: &str) -> Result<Self, AtlasParseError> {
    match direction {
      "forward" => Ok(Self::Forward),
      "reverse" => Ok(Self::Reverse),
      "pingpong" => Ok(Self::PingPong),
      _ => Err(
        format!("Animation playback direction invalid: \"{}\".", direction)
          .into(),
      ),
    }
  }
}

pub fn parse_cel(
  frame_tag: &aseprite::FrameTag,
  frame: &aseprite::Frame,
  frame_number: u32,
  slices: &[aseprite::Slice],
) -> Result<Cel, AtlasParseError> {
  Ok(Cel {
    bounds: parse_bounds(frame)?,
    duration: parse_duration(frame.duration)?,
    slices: parse_slices(frame_tag, frame_number, slices)?,
  })
}

pub fn parse_bounds(frame: &aseprite::Frame) -> Result<R16, AtlasParseError> {
  let pad = parse_padding(frame)?;
  Ok(R16::new_wh(
    frame.frame.x + pad.w / 2,
    frame.frame.y + pad.h / 2,
    frame.source_size.w.try_into()?,
    frame.source_size.h.try_into()?,
  ))
}

/// Returns evenly divisible padding.
pub fn parse_padding(
  aseprite::Frame { frame, source_size, .. }: &aseprite::Frame,
) -> Result<WH16, AtlasParseError> {
  let w = (frame.w - source_size.w).try_into()?;
  let h = (frame.h - source_size.h).try_into()?;
  if is_odd(w) || is_odd(h) {
    return Err("Cel padding is not evenly divisible.".into());
  }
  Ok(WH { w, h })
}

fn is_odd(val: i16) -> bool {
  val & 1 == 1
}

pub fn parse_duration(
  duration: aseprite::Duration,
) -> Result<Millis, AtlasParseError> {
  match duration {
    0 => Err("Cel duration is zero.".into()),
    aseprite::INFINITE => Ok(f64::INFINITY),
    _ => Ok(Millis::from(duration)),
  }
}

pub fn parse_slices(
  aseprite::FrameTag { name, .. }: &aseprite::FrameTag,
  index: u32,
  slices: &[aseprite::Slice],
) -> Result<Vec<R16>, AtlasParseError> {
  let mut rects = Vec::new();
  for slice in slices {
    if slice.name != *name {
      continue;
    }
    // For each Slice, get the greatest relevant Key.
    let key =
      slice.keys.iter().filter(|key| key.frame <= index).last().unwrap();
    let aseprite::Key { bounds, .. } = key;
    rects.push(
      R16::try_from_wh(bounds.x, bounds.y, bounds.w, bounds.h)
        .ok_or("Slice bounds conversion to R16 failed.")?,
    );
  }
  Ok(rects)
}

#[derive(Debug)]
pub struct AtlasParseError(pub String);

impl From<&str> for AtlasParseError {
  fn from(error: &str) -> Self {
    Self(error.to_string())
  }
}

impl From<String> for AtlasParseError {
  fn from(error: String) -> Self {
    Self(error)
  }
}

impl From<TryFromIntError> for AtlasParseError {
  fn from(error: TryFromIntError) -> Self {
    Self(error.to_string())
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use crate::math::XY;
  use std::collections::HashMap;

  #[test]
  fn parse_animation_map() {
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
            "name": "cloud-large", "from": 0, "to": 0, "direction": "forward"
          },
          { "name": "palette-red", "from": 1, "to": 1, "direction": "forward" },
          {
            "name": "conifer", "from": 2, "to": 2, "direction": "forward"
          },
          {
            "name": "conifer-shadow",
            "from": 3,
            "to": 3,
            "direction": "forward"
          }
        ],
        "slices": [
          {
            "name": "cloud-large",
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
            "name": "conifer",
            "color": "#0000ffff",
            "keys": [{
              "frame": 0, "bounds": { "x": 7, "y": 10, "w": 3, "h": 5 }
            }]
          },
          {
            "name": "conifer-shadow",
            "color": "#0000ffff",
            "keys": [{
              "frame": 0, "bounds": { "x": 7, "y": 9, "w": 3, "h": 6 }
            }]
          }
        ]
      },
      "frames": {
        "cloud-large 0": {
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
        "conifer 2": {
          "frame": { "x": 72, "y": 54, "w": 18, "h": 18 },
          "rotated": false,
          "trimmed": false,
          "spriteSourceSize": { "x": 0, "y": 0, "w": 16, "h": 16 },
          "sourceSize": { "w": 16, "h": 16 },
          "duration": 65535
        },
        "conifer-shadow 3": {
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
    let mut expected = AnimationMap::new();
    expected.insert(
      AnimationID::CloudLarge,
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          bounds: R16::new_wh(221, 19, 16, 16),
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
      AnimationID::PaletteRed,
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          bounds: R16::new_wh(91, 55, 16, 16),
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
      AnimationID::Conifer,
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          bounds: R16::new_wh(73, 55, 16, 16),
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
      AnimationID::ConiferShadow,
      Animation {
        wh: WH { w: 16, h: 16 },
        cels: vec![Cel {
          bounds: R16::new_wh(55, 55, 16, 16),
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
    assert_eq!(super::parse_animation_map(&file).unwrap(), expected);
  }

  #[test]
  fn parse_animation_id_valid() {
    assert_eq!(AnimationID::parse("bee").unwrap(), AnimationID::Bee);
  }

  #[test]
  fn parse_animation_id_invalid() {
    assert_eq!(AnimationID::parse("invalid").is_err(), true);
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
          bounds: R16::new_wh(185, 37, 16, 16),
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
        bounds: R16::new_wh(131, 19, 16, 16),
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
    assert_eq!(parse_bounds(&frame).unwrap(), R16::new_wh(1, 2, 3, 4));
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
    assert_eq!(parse_bounds(&frame).unwrap(), R16::new_wh(2, 3, 3, 4));
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
