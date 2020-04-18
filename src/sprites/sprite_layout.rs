use super::{Sprite, SpriteLayer};
use crate::atlas::AnimationID;
use crate::math::{R16, XY16};

// Decamillipixel
// watch out for zero image scale

/// A coordinate system of Sprites. Different sprites are shown for different
/// Entity states. A SpriteRect is used to group all Sprites for a given state.
///
/// Since Sprites are arranged relative to each other and the system, the system
/// location in level coordinates is preserved so that a subsequent update can
/// correctly reconcile the current state of the Sprites and the requested
/// change relative to the system coordinates.
///
/// E.g., consider an entity with a visible and a hidden state. The letter A is
/// shown at level coordinates 5,5 in the visible state. Then the state is
/// changed to hidden and moved to 10,10. Finally, the state is changed back to
/// visible. The expected result is to render A at 10,10. However, without
/// SpriteRect tracking the position, A would appear at 5,5.
///
/// Additionally, SpriteRect offers a cached bounding box that contains all of
/// its images. This can be used for quick viewport render and collision
/// tests.
pub struct SpriteLayout {
  /// The upper-left and size of the local coordinate system in level
  /// coordinates. The sprites are moved relative this position and origin.
  bounds: R16,

  /// For sprites that require an additional offset to be included move
  /// computations.
  origin: XY16,

  /// Collision bodies and sprite rectangles include absolute scaling in their
  /// dimensions. Nonzero scaling is enforced so that operations are reversible.
  /// The scalar sign is only considered when rendering the flipped or unflipped
  /// sprite. Each sprite's original orientation is preserved in Sprite so that
  /// a SpriteRect composed of a mishmash of flipped sprites will mirror that
  /// mishmash and not lose each individual's sprite's relative flip.
  scale: XY16,
  // use std::num::NonZeroI16;
  /// If set, the constituentID for all sprites. See Sprite._constituentID. The
  /// reversal is lossy when the transformed Sprite's original constituentID was
  /// not Sprite.id.
  constituent_id: Option<AnimationID>,

  /// The relative offset for each layer.
  elevation: SpriteLayer,

  /// Sprite coordinates are not relative the bounds origin, they're in level
  /// coordinates.
  sprites: Vec<Sprite>,
}

// export interface Props {
//   readonly position?: XY
//   readonly origin?: XY
//   readonly scale?: XY
//   readonly constituentID?: AtlasID
//   readonly elevation?: Layer
//   readonly sprites?: Sprite[]
// }

impl SpriteLayout {
  // pub fn new(props: SpriteRect.Props = {})-> Self {
  //     let origin = props.origin ?? new XY(0, 0);
  //     let bounds = Rect.make(0, 0, 0, 0);
  //     let scale = new XY(1, 1);
  //     let sprites = props.sprites ?? [];
  //     let constituentID = props.constituentID;
  //     let elevation = props.elevation ?? 0;
  //     // this.invalidate();
  //     if (props.position) this.moveTo(props.position);
  //     if (props.scale) this.scaleBy(props.scale);
  //   Self{bounds,origin,scale,constituentID,elevation,sprites}
  // }

  /// See Self.bounds.
  pub fn get_bounds(&self) -> &R16 {
    &self.bounds
  }

  /// See Self.origin.
  pub fn get_origin(&self) -> XY16 {
    self.bounds.from.clone() + self.origin.clone()
  }

  /// Doesn't actually move anything.
  pub fn set_origin(&mut self, origin: &XY16) {
    // should we allow for addition / subtraction like this with the moving?
    self.origin = origin.clone() - self.bounds.min();
  }

  // do I needd UpdateStatus?
  // pub fn move_to(&mut self, to: &XY16) {
  //   self.move_by(&(to.clone() - self.origin))
  // }

  // pub fn move_by(&mut self,by: &XY16) {
  //   if by.x == 0 && by.y == 0 {return}
  //   self.bounds += by;
  //   for sprite in self.sprites {sprite.move_by(by);}
  // }

  pub fn get_scale(&self) -> &XY16 {
    &self.scale
  }

  // pub fn scale_to(&mut self, to: &XY16) {
  //   self.scale_by(&(to.clone() / self.scale))
  // }

  // pub fn scale_by(&mut self,by: &XY16) {
  //   if by.x == 1 && by.y == 1 {return }
  //   Sprite.validateScale(by);
  //   for sprite in self.sprites {sprite.scale_by(by)}
  //   self.scale *= by.clone();
  //   self.invalidate();
  // }

  // pub fn  get_constituent_id(&mut self)-> Option<AtlasID> {
  //   self.constituent_id
  // }

  // pub fn set_constituent_id(&mut self,id: &Option<AnimationID>) {
  //   if self.constituent_id == id {return}
  //   self.constituent_id = id;
  //   for sprite in self.sprites {sprite.constituent_id = id;}
  // }

  // pub fn  get_elevation(& self,) -> Layer {
  //   self.elevation
  // }

  // pub fn elevateTo(&mut self,to: &Layer) {
  //   self.elevateBy(to - this.elevation)
  // }

  // pub fn elevate_by(&mut self,by: &Layer) {
  //   if !by {return}
  //   self.elevation += by;
  //   for sprite of self.sprites {sprite.layer += by;}
  // }

  pub fn sprites(&self) -> &Vec<Sprite> {
    &self.sprites
  }

  // pub fn add(&mut self,...sprites: readonly Sprite[]): void {
  //   this._sprites.push(...sprites)
  //   this.invalidate()
  // }

  // pub fn replace(&mut self,...sprites: readonly Sprite[]): void {
  //   this._sprites.length = 0
  //   this.add(...sprites)
  // }

  // pub fn intersects(&mut self,bounds: &R16)-> Vec<&Sprite> {
  //   self.sprites.filter(|sprite| bounds.intersects(sprite.bounds))
  // }

  // pub fn invalidate(&mut self,) {
  //   let union = self.sprites.map(|sprite| sprite.get_bounds()).union();
  //   if union.is_none() {return}

  //   // Invalidation crops the sprite to its images. This may cause the upper
  //   // left of the SpriteRect to move which may be unexpected if an image was
  //   // intended to remain at an offset from the upper left. In this case, use
  //   // origin.
  //   self.bounds.position.x = union.position.x
  //   self.bounds.position.y = union.position.y

  //   self.bounds.size.w = union.size.w
  //   self.bounds.size.h = union.size.h
  // }

  // pub fn reset_animation(&mut self) {
  //   for sprite in self.sprites {sprite.reset_animation()}
  // }
}
