use super::{SpriteComposition, SpriteLayer};
use crate::atlas::{AnimationID, Animator, Atlas};
use crate::math::{R16, XY16};

/// A mapping from an Atlas Animation to a level region. This includes all
/// distinct needed to represent an instance to the shader.
pub struct Sprite {
  /// Source Animation state.
  pub animator: Animator,
  /// The Animation subtextures identifer to draw from.
  pub source: AnimationID,
  /// The Animation subtextures identifer to compose with source. The
  /// constituent uses the source Animator's period and as such cannot be
  /// animated distinctly. Wrapping is not applied to the constituent.
  pub constituent: AnimationID,
  /// The composition operator for source and constituent.
  pub composition: SpriteComposition,
  /// The level region to draw to including scale. The width and height are
  /// unsigned and never negative even when scaling indicates the sprite will be
  /// flipped when rendered.
  ///
  /// Each animation cel has the same size so an sprite's dimensions only change
  /// when explicitly instructed. Specifying a different destination width or
  /// height than the source truncates or repeats the scaled rendered source.
  ///
  /// This region is used to determine when the sprite is on screen and therefor
  /// should be drawn, as well as for rendering itself. The region is also used
  /// for certain collision tests.
  pub destination: R16,
  /// The destination multiple.
  pub scale: XY16,
  /// The initial marquee translation offset in .1 pixels. The total offset is
  /// calculated using the global game clock and therefor synchronized by
  /// default except where this property deviates.
  pub wrap: XY16,
  /// The marquee translation speed in .1 pixels per second (or 1 px / 10 000 ms
  /// or 1 px / 10 s). The offset for each render is calculated by the shader as
  /// `wrap + wrap_velocity * game_clock`.
  pub wrap_velocity: XY16,
  /// The painting draw order.
  pub layer: SpriteLayer,
}

impl Sprite {
  pub fn new(
    animator: Animator,
    source: AnimationID,
    constituent: AnimationID,
    composition: SpriteComposition,
    destination: R16,
    scale: XY16,
    wrap: XY16,
    wrap_velocity: XY16,
    layer: SpriteLayer,
  ) -> Self {
    Self {
      animator,
      source,
      constituent,
      composition,
      destination,
      scale,
      wrap,
      wrap_velocity,
      layer,
    }
  }

  pub fn move_by(&mut self, by: &XY16) {
    self.destination = self.destination.clone() + by.clone();
  }

  pub fn move_to(&mut self, to: &XY16) {
    self.destination = self.destination.move_to(to);
  }

  pub fn serialize(
    &self,
    config: &bincode::Config,
    atlas: &Atlas,
  ) -> bincode::Result<Vec<u8>> {
    let mut bytes = Vec::new();
    let animation = &atlas.animations[&self.source];
    let animator = &self.animator;
    bytes.append(&mut config.serialize(animator.cel(animation).map_or(
      Err(bincode::ErrorKind::Custom("Source Cel unavailable".to_string())),
      |cel| Ok(&cel.xy),
    )?)?);
    bytes.append(&mut config.serialize(&animation.wh)?);
    let constituent_animation = &atlas.animations[&self.constituent];
    bytes.append(&mut config.serialize(
      animator.cel(constituent_animation).map_or(
        Err(bincode::ErrorKind::Custom(
          "Constituent Cel unavailable".to_string(),
        )),
        |cel| Ok(&cel.xy),
      )?,
    )?);
    bytes.append(&mut config.serialize(&constituent_animation.wh)?);
    bytes.append(&mut config.serialize(&self.composition)?);
    bytes.append(&mut config.serialize(&self.destination)?);
    bytes.append(&mut config.serialize(&self.scale)?);
    bytes.append(&mut config.serialize(&self.wrap)?);
    bytes.append(&mut config.serialize(&self.wrap_velocity)?);
    Ok(bytes)
  }
}

//   /// flip can be used to determine scale butttttt not collision then. world+render... mostly render since entities may have multiple of these
//   pub destination: R16,
