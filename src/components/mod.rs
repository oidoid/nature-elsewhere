mod align;
mod bounds;
mod collision;
mod cursor;
mod wraparound;

pub use align::*;
pub use bounds::*;
pub use collision::*;
pub use cursor::*;
pub use wraparound::*;

use crate::atlas::{AnimationID, Animator};
use crate::math::{R16, WH16, XY16};
use crate::sprites::sprite_composition::SpriteComposition;
use crate::sprites::sprite_layer::SpriteLayer;
use num::traits::identities::Zero;
use serde::{Deserialize, Serialize};
use specs::prelude::DenseVecStorage;
use specs::{Component, Entity};
use std::any::Any;
use std::collections::HashMap;

#[serde(deny_unknown_fields)]
#[derive(Component, Deserialize)]
pub struct Player {}

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct FollowMouse {} // Or LockOn + alignment options

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct Position {
  #[serde(default)]
  pub xy: XY16,
}

impl Position {
  pub fn new(xy: XY16) -> Self {
    Self { xy }
  }
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize, PartialEq, Debug)]
pub struct Velocity {
  #[serde(skip_serializing_if = "i16::is_zero")]
  #[serde(default)]
  pub x: i16,
  #[serde(skip_serializing_if = "i16::is_zero")]
  #[serde(default)]
  pub y: i16,
}

impl From<&Velocity> for XY16 {
  fn from(velocity: &Velocity) -> Self {
    Self { x: velocity.x, y: velocity.y }
  }
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct Text {
  pub text: String,
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct MaxWH {
  pub wh: WH16,
}

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct Cam {
  pub wh: WH16,
}

#[derive(Clone, Component)]
pub struct Parent {
  pub parent: Entity,
}

impl Parent {
  pub fn new(parent: Entity) -> Self {
    Self { parent }
  }
}

#[derive(Clone, Component)]
pub struct Children {
  pub children: Vec<Entity>,
}

impl Children {
  pub fn new(children: Vec<Entity>) -> Self {
    Self { children }
  }
}

#[derive(Component)]
pub struct StateBestFriend<T: Any + Send + Sync + Default> {
  pub state: T,
}

#[derive(Component)]
pub struct Renderable<T: Any + Send + Sync + Default> {
  pub sprites: HashMap<T, Vec<RenderBuddy>>,
}

pub struct RenderBuddy {
  id: AnimationID,
  constituent_id: AnimationID,
  composition: SpriteComposition,
  bounds: R16,
  // readonly position?: XYConfig
  // readonly x?: Integer
  // readonly y?: Integer
  // readonly size?: WHConfig
  // readonly w?: Integer
  // readonly h?: Integer
  layer: SpriteLayer,
  scale: XY16,
  // readonly sx?: Integer
  // readonly sy?: Integer
  animator: Animator<'static>,
  // readonly period?: Integer
  // readonly exposure?: Milliseconds
  wrap: XY16,
  // readonly wx?: Integer // Decamillipixel
  // readonly wy?: Integer // Decamillipixel
  wrap_velocity: XY16, // Decamillipixel
                       // readonly wvx?: Integer // Decamillipixel
                       // readonly wvy?: Integer // Decamillipixel
}
// where do animators fit in? separate component? then there's some overlap...
