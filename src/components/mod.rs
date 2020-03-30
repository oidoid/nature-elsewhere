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
use crate::sprites::{Sprite, SpriteComposition, SpriteLayer};
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
  pub sprites: HashMap<T, Vec<Sprite>>,
}

// it sucks that this requires full sprite inflation for every state of everything whether it is in use or not. manufacturing anything is super expensive
// the state machine should have to consult the blueprint to change states instead.
pub struct RenderBuddy {
  // sprite
  pub id: AnimationID,
  pub constituent_id: AnimationID,
  pub composition: SpriteComposition,
  pub bounds: R16,
  pub layer: SpriteLayer,
  pub scale: XY16,
  pub wrap: XY16,
  pub wrap_velocity: XY16, // Decamillipixel
                           // animator
}

// todo: establish relationship components (anything with Entity ID target or parent / child relationship)
// enum Relation {
//   Parent,
//   Child,
//   TargetPlayer(Player),
//   Camera
// }
// there are cases where non-i16 xy are useful.
