use super::{AlignToBlueprint, SpriteBlueprint, WHBlueprint, XYBlueprint};
use crate::atlas::{Animator, Atlas};
use crate::components::AlignTo;
use crate::math::{R16, WH, XY};
use crate::sprites::{Sprite, SpriteComposition, SpriteLayer};

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

impl SpriteBlueprint {
  pub fn manufacture(&self, atlas: &Atlas) -> Sprite {
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
      R16::cast_wh(position.x, position.y, area.w, area.h),
      |bounds| {
        R16::cast_wh(
          bounds.x.unwrap_or(0),
          bounds.y.unwrap_or(0),
          bounds.w.unwrap_or(0),
          bounds.h.unwrap_or(0),
        )
      },
    );

    let layer = self.layer.unwrap_or(SpriteLayer::Default);
    let animator = self.animator.clone().map_or(
      Animator::new(
        animation,
        self.period.unwrap_or(0),
        self.exposure.unwrap_or(0.),
      ),
      |animator| {
        Animator::new(
          animation,
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
    let source = R16::cast_wh(
      animation.cels[0].xy.x,
      animation.cels[0].xy.y,
      animation.wh.w,
      animation.wh.h,
    );
    let constituent = R16::cast_wh(
      atlas.animations[&constituent_id].cels[0].xy.x,
      atlas.animations[&constituent_id].cels[0].xy.y,
      atlas.animations[&constituent_id].wh.w,
      atlas.animations[&constituent_id].wh.h,
    );
    // how does this work with animations? offsets are applied to everything.
    Sprite::new(
      source,
      constituent,
      composition,
      bounds,
      scale,
      wrap,
      wrap_velocity,
    )
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
