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
