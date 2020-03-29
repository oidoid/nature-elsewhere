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
use crate::sprites::{SpriteComposition, SpriteLayer};
use serde::{Deserialize, Serialize};
use specs::prelude::DenseVecStorage;
use specs::{Component, Entity};
use std::any::Any;
use std::collections::HashMap;

#[derive(Component)]
pub struct Player {}

#[derive(Component)]
pub struct FollowMouse {} // Or LockOn + alignment options

#[derive(Component)]
pub struct Position {
  pub position: XY16,
}

#[derive(Component)]
pub struct Velocity {
  pub velocity: XY16,
}

#[derive(Component)]
pub struct Text {
  pub text: String,
}

#[derive(Component)]
pub struct MaxWH {
  pub area: WH16,
}

#[derive(Component)]
pub struct Cam {
  pub area: WH16,
}

#[derive(Clone, Component)]
pub struct Parent {
  pub parent: Entity,
}

#[derive(Clone, Component)]
pub struct Children {
  pub children: Vec<Entity>,
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

// todo: establish relationship components (anything with Entity ID target or parent / child relationship)
// enum Relation {
//   Parent,
//   Child,
//   TargetPlayer(Player),
//   Camera
// }
// there are cases where non-i16 xy are useful.
