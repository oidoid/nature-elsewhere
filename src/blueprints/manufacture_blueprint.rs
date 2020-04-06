use super::{AlignToBlueprint, WHBlueprint, XYBlueprint};
use crate::components::AlignTo;
use crate::math::{WH, XY};

/// Unfortunately, due to the deep patching of components, type mapping with
/// `deserialize_with` is not possible. Thus, component blueprints are patches
/// and retained until manufacture time.
pub trait ManufactureBlueprint<T> {
  fn manufacture(&self) -> Option<T>;
}

impl ManufactureBlueprint<AlignTo> for Option<AlignToBlueprint> {
  fn manufacture(&self) -> Option<AlignTo> {
    if let Some(blueprint) = self {
      let margin = blueprint.margin.manufacture().unwrap_or(XY::new(0, 0));
      Some(AlignTo::new(blueprint.alignment, margin, blueprint.to.clone()))
    } else {
      None
    }
  }
}

impl<T: Clone + Default> ManufactureBlueprint<WH<T>>
  for Option<WHBlueprint<T>>
{
  fn manufacture(&self) -> Option<WH<T>> {
    if let Some(blueprint) = self {
      Some(WH::new(
        blueprint.w.clone().unwrap_or_default(),
        blueprint.h.clone().unwrap_or_default(),
      ))
    } else {
      None
    }
  }
}

impl<T: Clone + Default> ManufactureBlueprint<XY<T>>
  for Option<XYBlueprint<T>>
{
  fn manufacture(&self) -> Option<XY<T>> {
    if let Some(blueprint) = self {
      Some(XY::new(
        blueprint.x.clone().unwrap_or_default(),
        blueprint.y.clone().unwrap_or_default(),
      ))
    } else {
      None
    }
  }
}
