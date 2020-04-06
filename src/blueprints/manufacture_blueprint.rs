use super::{AlignToBlueprint, WH16Blueprint, XY16Blueprint};
use crate::components::AlignTo;
use crate::math::{WH, WH16, XY, XY16};

/// Unfortunately, due to the deep patching of components, type mapping with
/// `deserialize_with` is not possible. Thus, component blueprints are patches
/// and retained until manufacture time.
pub trait Manufacture<T> {
  fn manufacture(&self) -> Option<T>;
}

impl Manufacture<AlignTo> for Option<AlignToBlueprint> {
  fn manufacture(&self) -> Option<AlignTo> {
    if let Some(blueprint) = self {
      let margin = blueprint.margin.clone().map_or(XY::new(0, 0), |margin| {
        XY::new(margin.x.unwrap_or(0), margin.y.unwrap_or(0))
      });
      Some(AlignTo::new(blueprint.alignment, margin, blueprint.to.clone()))
    } else {
      None
    }
  }
}

impl Manufacture<WH16> for Option<WH16Blueprint> {
  fn manufacture(&self) -> Option<WH16> {
    if let Some(blueprint) = self {
      Some(WH::new(blueprint.w.unwrap_or(0), blueprint.h.unwrap_or(0)))
    } else {
      None
    }
  }
}

impl Manufacture<XY16> for Option<XY16Blueprint> {
  fn manufacture(&self) -> Option<XY16> {
    if let Some(blueprint) = self {
      Some(XY::new(blueprint.x.unwrap_or(0), blueprint.y.unwrap_or(0)))
    } else {
      None
    }
  }
}
