mod align;
mod bounds;
mod collision;
mod cursor;
mod player;
mod render_source;
mod renderable;
mod wraparound;

use crate::math::{WH16, XY16};
use specs::prelude::DenseVecStorage;
use specs::{Component, Entity};

pub use align::*;
pub use bounds::*;
pub use collision::*;
pub use cursor::*;
pub use player::*;
pub use render_source::*;
pub use renderable::*;
pub use wraparound::*;

// #[serde(rename_all = "snake_case")]
// #[derive(Clone, Deserialize, Serialize)]
// pub enum AnyComponent {
//   Cam(Cam),
//   FollowMouse(FollowMouse),
//   Position(Position),
//   Velocity(Velocity),
//   Text(Text),
//   MaxWH(MaxWH),
// }

// impl AnyComponent {
//   pub fn value<T: Component + Send + Sync>(&self) -> &T {
//     match self {
//       Self::Cam(cam) => cam,
//       Self::FollowMouse(follow_mouse) => follow_mouse,
//       Self::Position(position) => position,
//       Self::Velocity(velocity) => velocity,
//       Self::Text(text) => text,
//       Self::MaxWH(max_wh) => max_wh,
//     }
//   }
// }

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct FollowMouse; // Or LockOn + alignment options

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct Position(pub XY16); // make these fields optional for deserialization

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct Velocity(pub XY16);

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct Text(pub String);

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct MaxWH(pub WH16);

#[serde(deny_unknown_fields)]
#[derive(Clone, Component, Deserialize, Serialize)]
pub struct Cam(pub WH16);

#[derive(Clone, Component)]
pub struct Parent(pub Entity);

#[derive(Clone, Component)]
pub struct Children(pub Vec<Entity>);
