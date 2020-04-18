use super::{
  AlignToBlueprint, MarkerBlueprint, SpriteBlueprint, WHBlueprint, XYBlueprint,
};
use crate::atlas::{AnimationID, Animator, Atlas};
use crate::components::AlignTo;
use crate::math::{R16, WH, XY};
use crate::sprites::{Sprite, SpriteComposition, SpriteLayer};
use std::collections::HashMap;
use std::hash::Hash;

/// Unfortunately, due to the deep patching of components, type mapping with
/// `deserialize_with` is not possible. Thus, component blueprints are patches
/// and retained until manufacture time.
pub trait ManufactureBlueprint<T> {
  fn manufacture(&self) -> T;
}

pub trait ManufactureAtlasBlueprint<T> {
  fn manufacture(&self, atlas: &Atlas) -> T;
}

impl ManufactureBlueprint<Option<AlignTo>> for Option<AlignToBlueprint> {
  fn manufacture(&self) -> Option<AlignTo> {
    if let Some(blueprint) = self {
      let margin = blueprint.margin.manufacture().unwrap_or(XY::new(0, 0));
      Some(AlignTo::new(blueprint.alignment, margin, blueprint.to.clone()))
    } else {
      None
    }
  }
}

impl<'a, T: Hash + Eq + Clone>
  ManufactureAtlasBlueprint<Option<HashMap<T, Vec<Sprite>>>>
  for HashMap<T, Vec<SpriteBlueprint>>
{
  fn manufacture(&self, atlas: &Atlas) -> Option<HashMap<T, Vec<Sprite>>> {
    let mut sprite_map = HashMap::new();
    for (state, blueprints) in self.iter() {
      // this is inflating all the states which seems bad <-- this needs to be runtime... how can runtime and manufacturer work together? i need a lut for this.
      let sprites: Vec<_> = blueprints
        .iter()
        .map(|component| component.manufacture(atlas))
        .collect();
      sprite_map.insert(state.clone(), sprites);
    }
    if sprite_map.is_empty() {
      None
    } else {
      Some(sprite_map)
    }
  }
}

impl ManufactureBlueprint<Option<()>> for Option<MarkerBlueprint> {
  fn manufacture(&self) -> Option<()> {
    if self.is_some() {
      Some(())
    } else {
      None
    }
  }
}

impl<'a> ManufactureAtlasBlueprint<Sprite> for SpriteBlueprint {
  fn manufacture(&self, atlas: &Atlas) -> Sprite {
    //another name is props
    let id = self.id;
    let constituent_id = self.constituent_id.unwrap_or(id);
    let composition = self.composition.unwrap_or(SpriteComposition::Source);
    let scale = self
      .scale
      .clone()
      .map_or(XY::new(self.sx.unwrap_or(1), self.sy.unwrap_or(1)), |scale| {
        XY::new(scale.x.unwrap_or(1), scale.y.unwrap_or(1))
      });
    // valid ate scale is nonzero or enforce it with templatized XY<nonzero thingy>
    let position =
      self.position.clone().map_or(
        XY::new(self.x.unwrap_or(0), self.y.unwrap_or(0)),
        |position| XY::new(position.x.unwrap_or(0), position.y.unwrap_or(0)),
      );
    let animation = &atlas.animations[&id];
    // do i need to validate area too?
    let area = self.area.clone().map_or(
      WH::new(
        self.w.unwrap_or(animation.wh.w),
        self.h.unwrap_or(animation.wh.h),
      ),
      |area| WH::new(area.w.unwrap_or(0), area.h.unwrap_or(0)),
    ); //use atlas, review ts
    let bounds = self.bounds.clone().map_or(
      R16::new_wh(position.x, position.y, area.w, area.h),
      |bounds| {
        R16::new_wh(
          bounds.x.unwrap_or(0),
          bounds.y.unwrap_or(0),
          bounds.w.unwrap_or(0),
          bounds.h.unwrap_or(0),
        )
      },
    );

    let layer = self.layer.unwrap_or(SpriteLayer::Default);
    let animator = self.animator.clone().map_or(
      Animator::new(self.period.unwrap_or(0), self.exposure.unwrap_or(0.)),
      |animator| {
        Animator::new(
          animator.period.unwrap_or(0),
          animator.exposure.unwrap_or(0.),
        )
      },
    );
    let wrap = self
      .wrap
      .clone()
      .map_or(XY::new(self.wx.unwrap_or(0), self.wy.unwrap_or(0)), |wrap| {
        XY::new(wrap.x.unwrap_or(0), wrap.y.unwrap_or(0))
      });
    let wrap_velocity = self.wrap_velocity.clone().map_or(
      XY::new(self.wvx.unwrap_or(0), self.wvy.unwrap_or(0)),
      |wrap_velocity| {
        XY::new(wrap_velocity.x.unwrap_or(0), wrap_velocity.y.unwrap_or(0))
      },
    );

    Sprite::new(
      animator,
      id,
      constituent_id,
      composition,
      bounds,
      scale,
      wrap,
      wrap_velocity,
    )
  }
}

impl ManufactureBlueprint<Option<String>> for Option<String> {
  fn manufacture(&self) -> Option<String> {
    if let Some(blueprint) = self {
      Some(blueprint.clone())
    } else {
      None
    }
  }
}

impl<T: Clone + Default> ManufactureBlueprint<Option<WH<T>>>
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

impl<T: Clone + Default> ManufactureBlueprint<Option<XY<T>>>
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
