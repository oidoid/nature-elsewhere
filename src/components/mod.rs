pub mod align;
pub mod bounds;
pub mod collision;
pub mod cursor;
pub mod max_wh;
pub mod player;
pub mod render_source;
pub mod renderable;
pub mod text;
pub mod velocity;
pub mod wraparound;

use crate::math::XY16;
use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component, Deserialize)]
pub struct FollowMouse;

#[derive(Component, Deserialize)]
pub struct Position(pub XY16);
